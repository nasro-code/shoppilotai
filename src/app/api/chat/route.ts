import OpenAI from "openai";
import { type NextRequest } from "next/server";
import { getOrCreateUser, saveMessage } from "@/lib/database";
import { getOrderByEmail } from "@/lib/shopify";
import { createClient } from "@/utils/supabase/server";

// Initialize OpenAI client with Groq configuration
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are an ecommerce AI support agent with access to order data and customer context. 

PLAYBOOK & RULES:
1. **Order Context**: Always check the "CUSTOMER ORDER CONTEXT" provided below. If data exists, use it to answer questions about status, tracking, and items.
2. **Missing Data**: If the user asks about an order but no order context is provided, ask for their Order ID or clarify which email they used.
3. **Refunds**:
    - If 'is_refundable' is true: Guide them on how to return the item (e.g., "You can start a return in your portal").
    - If 'is_refundable' is false: Explain why (e.g., "Orders currently in 'Processing' status cannot be refunded until they are delivered").
4. **Shipping**: Provide specific tracking numbers if available. If the status is 'Shipped' but no tracking number is present, apologize and state you'll check with the courier.
5. **No Hallucination**: NEVER make up tracking numbers, dates, or shipping carriers. If you don't know, say "I don't have that information right now".
6. **Conciseness**: Keep responses under 3 sentences unless a step-by-step guide is needed.`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the actual authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;
    const email = authUser.email!; // Use the real authenticated email

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Missing or invalid 'message' field" },
        { status: 400 }
      );
    }

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      return Response.json(
        { error: "Groq API Key is missing or using the placeholder. Please update .env.local with a real key from console.groq.com" },
        { status: 500 }
      );
    }

    // 1. Get or create the user in Supabase
    const user = await getOrCreateUser(email);

    // 2. Fetch mock Shopify data
    const order = await getOrderByEmail(email);
    let orderContext = "";
    if (order) {
      orderContext = `

CUSTOMER ORDER CONTEXT:
- Order ID: ${order.order_id}
- Status: ${order.status}
- Shipping Date: ${order.shipping_date}
- Items: ${order.items.join(", ")}
- Total: ${order.total_price}
- Tracking: ${order.tracking_number || "Not available yet"}
- Refund Eligible: ${order.is_refundable ? "Yes" : "No (Orders in 'Processing' or 'Delivered > 30 days' are ineligible)"}`;
    }

    // 3. Generate the AI response using Groq (Llama 3.3 70B)
    console.log(`Calling Groq AI for user: ${email}`);
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + orderContext },
        { role: "user", content: message },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    // 4. Save the conversation to Supabase
    try {
      await saveMessage(user.id, message, reply);
    } catch (dbError) {
      console.error("Failed to save message to Supabase:", dbError);
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

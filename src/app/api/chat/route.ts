import OpenAI from "openai";
import { type NextRequest } from "next/server";
import { getOrCreateUser, saveMessage } from "@/lib/database";
import { getOrderById, getShippingStatus, requestRefund } from "@/lib/shopify";
import { createClient } from "@/utils/supabase/server";
import { sanitizeInput, sanitizeForToolArg } from "@/lib/sanitize";

// Initialize OpenAI client with Groq configuration
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are AutoCommerce AI, a premium customer support agent. 
You have access to real-time Shopify data and can perform actions on behalf of the customer.

CAPABILITIES:
1. **Order Lookup**: You can find orders by ID or check the customer's current order history.
2. **Shipping Status**: You can check exactly where an order is and provide delivery estimates.
3. **Refunds**: You can process refunds if the order is eligible.
4. **Multi-channel**: You can notify customers via Email or WhatsApp (simulated).

RULES:
- If a customer asks about their order and you don't have the ID, use the 'get_customer_orders' tool first.
- Before processing a refund, ALWAYS confirm the Order ID and the reason with the customer.
- Be professional, concise, and helpful.
- If you perform an action (like a refund), tell the customer you've sent them a confirmation email.
- NEVER hallucinate data. Use the tools provided.`;

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_order_details",
      description: "Retrieve full details for a specific Shopify order",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "The order ID (e.g., AC-12345)" },
        },
        required: ["orderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_shipping_status",
      description: "Get real-time tracking and delivery estimates for an order",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "The order ID" },
        },
        required: ["orderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "process_refund",
      description: "Initiate a refund for an eligible order",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "The order ID" },
          reason: { type: "string", description: "The reason for the refund" },
        },
        required: ["orderId", "reason"],
      },
    },
  },
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let { message } = body;
    const email = authUser.email!;

    if (!message) return Response.json({ error: "Missing message" }, { status: 400 });

    const { sanitized, wasModified } = sanitizeInput(message);
    if (wasModified) {
      console.warn("Potentially malicious input detected and sanitized:", message.slice(0, 100));
    }
    message = sanitized;

    // 1. Get or create the user
    const user = await getOrCreateUser(email);

    // 2. Initial AI call to see if it needs tools
    let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools,
      tool_choice: "auto",
      temperature: 0.2,
    });

    let responseMessage = response.choices[0].message;

    // 3. Handle tool calls
    if (responseMessage.tool_calls) {
      messages.push(responseMessage);

      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        let toolResult;

        console.log(`Executing tool: ${functionName}`, args);

        if (functionName === "get_order_details") {
          toolResult = await getOrderById(sanitizeForToolArg(args.orderId), user.id);
        } else if (functionName === "check_shipping_status") {
          toolResult = await getShippingStatus(sanitizeForToolArg(args.orderId), user.id);
        } else if (functionName === "process_refund") {
          toolResult = await requestRefund(sanitizeForToolArg(args.orderId), sanitizeForToolArg(args.reason), user.id);
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult || { error: "No data found" }),
        });
      }

      // Final completion after tool results
      const finalResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
      });
      responseMessage = finalResponse.choices[0].message;
    }

    const reply = responseMessage.content || "";

    // 4. Save to DB
    await saveMessage(user.id, message, reply);

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


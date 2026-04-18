You MUST use:

Frontend: Next.js (App Router)
Backend API: Next.js API routes
Database: Supabase
Auth: Supabase Auth
Automation Engine: n8n (webhooks)
AI Model: OpenAI (GPT-4o-mini or similar)
Payments (optional MVP stage): Stripe
📁 3. PROJECT STRUCTURE (MUST FOLLOW)

Create this exact structure:

autocommerce-ai/
│
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/
│   │   ├── page.tsx            # Main dashboard
│   │   ├── chats/page.tsx      # Conversations UI
│   │   ├── orders/page.tsx     # Orders page
│   │   ├── settings/page.tsx   # Settings page
│   │
│   ├── api/
│   │   ├── chat/route.ts       # AI chat endpoint
│   │   ├── webhook/route.ts    # n8n webhook receiver
│
├── components/
│   ├── Sidebar.tsx
│   ├── ChatBox.tsx
│   ├── MessageBubble.tsx
│   ├── KPIWidget.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── openai.ts
│   ├── shopify.ts
│
├── styles/
│   ├── globals.css
│
├── workflows/
│   ├── n8n-ai-support.json
│
├── .env.local
├── package.json
🎯 4. CORE FEATURES (MVP SCOPE ONLY)
✅ Must build:
1. AI Chat API
Accepts customer message
Sends to OpenAI
Returns response
2. Dashboard UI
Show dummy KPI cards:
Messages handled
Response time
Automation rate
3. Chat Interface
Simple UI:
Customer message (left)
AI reply (right)
4. Webhook endpoint (n8n integration)
Receives:
{
  "message": "",
  "email": "",
  "store_id": ""
}
Sends response back to AI engine
5. Database (Supabase)

Tables:

users
id
email
plan
messages
id
user_id
message
response
created_at
🤖 5. AI BEHAVIOR RULES

Use this system prompt:

You are an AI ecommerce customer support agent.

Rules:
- Be short and helpful
- Do not hallucinate order data
- If missing information, ask questions
- Always be polite
- Focus on solving customer problems
🧠 6. API ROUTE SPEC (IMPORTANT)
/api/chat

Input:

{
  "message": "Where is my order?"
}

Output:

{
  "reply": "Your order is on the way. Can you share your order ID?"
}
⚙️ 7. N8N WORKFLOW INTEGRATION

You must support this webhook:

POST:
/webhook/support

Flow:

Receive message
Send to AI API
Get response
Return response
🎨 8. UI STYLE GUIDE

Design must be:

Dark mode SaaS
Colors:
Background: #0B0F1A
Card: #111827
Primary: #3B82F6
Style: modern SaaS dashboard
Rounded corners
Minimal UI
Clean spacing
📊 9. DASHBOARD CONTENT

Include:

KPI cards
Chat panel
Sidebar navigation
Simple analytics section
🔐 10. AUTH SYSTEM

Use Supabase Auth:

Email login
Protected dashboard routes
💳 11. (OPTIONAL) STRIPE INTEGRATION

If implemented:

Subscription plans:
Starter ($29)
Pro ($79)
Agency ($149)

🚨 12. IMPORTANT RULES
Keep MVP SIMPLE
No overengineering
Must be functional first
UI > perfection
Focus on working AI chat system
🏁 13. MVP SUCCESS CRITERIA

The app is complete when:

✔ User can send message
✔ AI responds correctly
✔ Messages stored in DB
✔ Dashboard shows messages
✔ Webhook works with n8n

🚀 14. FINAL OUTPUT

You are building a real SaaS MVP, not a demo.

Think:

“This should be sellable to a real Shopify store.”
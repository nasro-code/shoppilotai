"use client";

import { useState, useCallback } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

export interface Message {
  id: string;
  sender: "customer" | "ai";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: "active" | "resolved" | "pending";
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    avatar: "SJ",
    lastMessage: "When will my order arrive?",
    time: "2m ago",
    unread: 2,
    status: "active",
    messages: [
      { id: "1a", sender: "customer", text: "Hi, I placed an order 3 days ago and haven\u2019t received any update yet.", time: "10:32 AM" },
      { id: "1b", sender: "ai", text: "Hello Sarah! I\u2019d be happy to help you track your order. Could you please share your order number?", time: "10:32 AM" },
      { id: "1c", sender: "customer", text: "Sure, it\u2019s #AC-20458", time: "10:33 AM" },
      { id: "1d", sender: "ai", text: "Thanks! I found your order. It\u2019s currently in transit with DHL. Estimated delivery is April 20th. Here\u2019s your tracking link: https://tracking.example.com/AC-20458", time: "10:33 AM" },
      { id: "1e", sender: "customer", text: "Great, thanks! Can I change the delivery address?", time: "10:35 AM" },
      { id: "1f", sender: "ai", text: "Since the package is already in transit, address changes aren\u2019t possible at this stage. However, I can request a hold at the nearest pickup point. Would you like me to do that?", time: "10:35 AM" },
      { id: "1g", sender: "customer", text: "When will my order arrive?", time: "10:36 AM" },
    ],
  },
  {
    id: "2",
    customerName: "Marcus Chen",
    avatar: "MC",
    lastMessage: "The refund hasn\u2019t appeared yet",
    time: "15m ago",
    unread: 0,
    status: "pending",
    messages: [
      { id: "2a", sender: "customer", text: "I returned my order last week but still no refund. What\u2019s going on?", time: "9:12 AM" },
      { id: "2b", sender: "ai", text: "I apologize for the delay, Marcus. Let me check the status of your return. One moment please.", time: "9:12 AM" },
      { id: "2c", sender: "ai", text: "I can see your return was received at our warehouse on April 15th. Refunds typically take 5\u20137 business days to process. Yours should appear by April 22nd.", time: "9:13 AM" },
      { id: "2d", sender: "customer", text: "The refund hasn\u2019t appeared yet", time: "9:15 AM" },
    ],
  },
  {
    id: "3",
    customerName: "Emily Davis",
    avatar: "ED",
    lastMessage: "That fixed it, thank you!",
    time: "1h ago",
    unread: 0,
    status: "resolved",
    messages: [
      { id: "3a", sender: "customer", text: "I can\u2019t log into my account. Keep getting an error.", time: "8:45 AM" },
      { id: "3b", sender: "ai", text: "I\u2019m sorry to hear that, Emily. Let me help you regain access. Could you try clearing your browser cache and cookies first?", time: "8:45 AM" },
      { id: "3c", sender: "customer", text: "Tried that, still not working", time: "8:47 AM" },
      { id: "3d", sender: "ai", text: "I\u2019ve sent a password reset link to your registered email (e***@gmail.com). Please check your inbox and spam folder.", time: "8:47 AM" },
      { id: "3e", sender: "customer", text: "That fixed it, thank you!", time: "8:52 AM" },
    ],
  },
  {
    id: "4",
    customerName: "James Wilson",
    avatar: "JW",
    lastMessage: "Is the blue variant back in stock?",
    time: "3h ago",
    unread: 1,
    status: "active",
    messages: [
      { id: "4a", sender: "customer", text: "Hey, I\u2019ve been waiting for the blue variant of the Pro Wireless Headphones to come back. Any updates?", time: "5:20 PM" },
      { id: "4b", sender: "ai", text: "Hi James! The blue variant is expected to be restocked by April 25th. Would you like me to notify you as soon as it\u2019s available?", time: "5:20 PM" },
      { id: "4c", sender: "customer", text: "Is the blue variant back in stock?", time: "5:22 PM" },
    ],
  },
  {
    id: "5",
    customerName: "Priya Patel",
    avatar: "PP",
    lastMessage: "I need to cancel order #AC-20501",
    time: "5h ago",
    unread: 0,
    status: "resolved",
    messages: [
      { id: "5a", sender: "customer", text: "I need to cancel order #AC-20501. I accidentally ordered the wrong size.", time: "2:10 PM" },
      { id: "5b", sender: "ai", text: "No problem, Priya. I\u2019ve cancelled order #AC-20501. A full refund will be issued within 3\u20135 business days. Would you like help placing a new order with the correct size?", time: "2:10 PM" },
      { id: "5c", sender: "customer", text: "Yes please, I need size M instead of L", time: "2:12 PM" },
      { id: "5d", sender: "ai", text: "Done! I\u2019ve created a new order #AC-20502 for size M. You\u2019ll receive a confirmation email shortly. Is there anything else I can help with?", time: "2:12 PM" },
    ],
  },
];

function getTimeNow(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ChatsView() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);

  const selectedConversation = conversations.find((c) => c.id === selectedId) || conversations[0];

  const handleSendMessage = useCallback(
    async (text: string) => {
      const timeNow = getTimeNow();

      // Add the user message immediately
      const userMsg: Message = {
        id: `${selectedId}-${Date.now()}`,
        sender: "customer",
        text,
        time: timeNow,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, messages: [...c.messages, userMsg], lastMessage: text, time: "Just now" }
            : c
        )
      );

      // Call the API
      setIsLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to get AI response");
        }

        const aiMsg: Message = {
          id: `${selectedId}-ai-${Date.now()}`,
          sender: "ai",
          text: data.reply,
          time: getTimeNow(),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? { ...c, messages: [...c.messages, aiMsg], lastMessage: data.reply, time: "Just now" }
              : c
          )
        );
      } catch (error) {
        const errMsg: Message = {
          id: `${selectedId}-err-${Date.now()}`,
          sender: "ai",
          text: error instanceof Error ? `Error: ${error.message}` : "Sorry, something went wrong. Please try again.",
          time: getTimeNow(),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? { ...c, messages: [...c.messages, errMsg] }
              : c
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedId]
  );

  return (
    <div className="-m-8 flex h-[calc(100vh-4rem)]">
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ChatWindow
        conversation={selectedConversation}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

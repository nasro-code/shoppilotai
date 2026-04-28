"use client";

import { Search } from "lucide-react";
import type { Conversation } from "./ChatsView";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <div
      className="w-80 shrink-0 flex flex-col"
      style={{
        backgroundColor: "#FFFFFF",
        borderRight: "0.67px solid #F1F5F9"
      }}
    >
      <div className="p-4" style={{ borderBottom: "0.67px solid #F1F5F9" }}>
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#0F172A" }}>Conversations</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748B" }} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-colors"
            style={{
              backgroundColor: "#F8FAFC",
              border: "0.67px solid #E2E8F0",
              color: "#0F172A"
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const isSelected = conv.id === selectedId;
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left px-4 py-3.5 flex gap-3 transition-all duration-150 ${
                isSelected ? "bg-emerald-50 border-l-2" : "hover:bg-gray-50 border-l-2 border-l-transparent"
              }`}
              style={{
                borderBottom: "0.67px solid #F1F5F9",
                backgroundColor: isSelected ? "#F0FDF4" : "transparent"
              }}
            >
              <div className="relative shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                  style={
                    isSelected
                      ? { background: "linear-gradient(135deg, #10B981, #059669)" }
                      : { backgroundColor: "#F1F5F9", border: "0.67px solid #E2E8F0" }
                  }
                >
                  {conv.avatar}
                </div>
                {conv.status === "active" && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: "#10B981", borderColor: "#FFFFFF" }}
                  ></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`text-sm font-medium truncate ${
                      isSelected ? "" : ""
                    }`}
                    style={{ color: isSelected ? "#0F172A" : "#374151" }}
                  >
                    {conv.customerName}
                  </span>
                  <span className="text-xs shrink-0 ml-2" style={{ color: "#64748B" }}>{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs truncate pr-2" style={{ color: "#64748B" }}>{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span
                      className="shrink-0 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#10B981" }}
                    >
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  <span
                    className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: conv.status === "active" ? "#F0FDF4" : conv.status === "pending" ? "#FEF3C7" : "#F3F4F6",
                      color: conv.status === "active" ? "#10B981" : conv.status === "pending" ? "#D97706" : "#64748B",
                      border: `0.67px solid ${conv.status === "active" ? "#D1FAE5" : conv.status === "pending" ? "#FDE68A" : "#E2E8F0"}`
                    }}
                  >
                    {conv.status.charAt(0).toUpperCase() + conv.status.slice(1)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

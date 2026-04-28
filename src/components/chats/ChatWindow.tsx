"use client";

import { useState } from "react";
import { Send, Paperclip, Smile, MoreVertical, Bot, User } from "lucide-react";
import type { Conversation } from "./ChatsView";

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatWindow({ conversation, onSendMessage, isLoading }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex-1 flex flex-col min-w-0"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div
        className="h-16 px-6 flex items-center justify-between shrink-0"
        style={{ backgroundColor: "#FFFFFF", borderBottom: "0.67px solid #F1F5F9" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
          >
            {conversation.avatar}
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>{conversation.customerName}</h3>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    conversation.status === "active" ? "#10B981" : conversation.status === "pending" ? "#F59E0B" : "#94A3B8"
                }}
              ></span>
              <span className="text-xs capitalize" style={{ color: "#64748B" }}>{conversation.status}</span>
            </div>
          </div>
        </div>
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#64748B" }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {conversation.messages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                  style={{ backgroundColor: "#F0FDF4", border: "0.67px solid #D1FAE5" }}
                >
                  <Bot className="w-4 h-4" style={{ color: "#10B981" }} />
                </div>
              )}
              <div className={`max-w-[65%] group`}>
                <div
                  className="px-4 py-3 text-sm leading-relaxed"
                  style={{
                    borderRadius: isAI ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                    backgroundColor: isAI ? "#FFFFFF" : "#10B981",
                    color: isAI ? "#0F172A" : "#FFFFFF",
                    border: isAI ? "0.67px solid #F1F5F9" : "none",
                    boxShadow: isAI ? "0 1px 2px rgba(0,0,0,0.05)" : "0 4px 6px -1px rgba(16, 185, 129, 0.2)"
                  }}
                >
                  {msg.text}
                </div>
                <span
                  className={`text-[10px] mt-1.5 block ${isAI ? "text-left" : "text-right"}`}
                  style={{ color: "#64748B" }}
                >
                  {msg.time}
                </span>
              </div>
              {!isAI && (
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                  style={{ backgroundColor: "#F1F5F9", border: "0.67px solid #E2E8F0" }}
                >
                  <User className="w-4 h-4" style={{ color: "#64748B" }} />
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
              style={{ backgroundColor: "#F0FDF4", border: "0.67px solid #D1FAE5" }}
            >
              <Bot className="w-4 h-4" style={{ color: "#10B981" }} />
            </div>
            <div
              className="px-4 py-3 text-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: "0.67px solid #F1F5F9",
                borderRadius: "16px 16px 16px 4px",
                color: "#64748B"
              }}
            >
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-2 shrink-0">
        <div
          className="flex items-end gap-3 rounded-2xl p-2 transition-colors"
          style={{
            backgroundColor: "#FFFFFF",
            border: "0.67px solid #E2E8F0"
          }}
        >
          <button
            className="p-2 rounded-lg transition-colors shrink-0"
            style={{ color: "#64748B" }}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm outline-none resize-none py-2 max-h-32"
            style={{ color: "#0F172A" }}
          />
          <button
            className="p-2 rounded-xl transition-colors shrink-0"
            style={{ color: "#64748B" }}
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-xl transition-colors shrink-0 disabled:opacity-50"
            style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
          >
            <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
        </div>
        <p className="text-[10px] mt-2 text-center" style={{ color: "#64748B" }}>
          AI-powered responses are generated automatically. Review before sending to customers.
        </p>
      </div>
    </div>
  );
}

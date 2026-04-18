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
    <div className="flex-1 flex flex-col bg-[#0B0F1A] min-w-0">
      {/* Chat header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-white/5 shrink-0 bg-[#0B0F1A]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {conversation.avatar}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{conversation.customerName}</h3>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${
                conversation.status === "active" ? "bg-emerald-400" : conversation.status === "pending" ? "bg-amber-400" : "bg-gray-400"
              }`}></span>
              <span className="text-xs text-gray-400 capitalize">{conversation.status}</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {conversation.messages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4 text-[#3B82F6]" />
                </div>
              )}
              <div className={`max-w-[65%] group`}>
                <div
                  className={`px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                    isAI
                      ? "bg-[#111827] border border-white/5 text-gray-200 rounded-tl-md"
                      : "bg-[#3B82F6] text-white rounded-tr-md"
                  }`}
                >
                  {msg.text}
                </div>
                <span className={`text-[10px] text-gray-500 mt-1.5 block ${isAI ? "text-left" : "text-right"}`}>
                  {msg.time}
                </span>
              </div>
              {!isAI && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/10 flex items-center justify-center mt-1">
              <Bot className="w-4 h-4 text-blue-500/50" />
            </div>
            <div className="bg-[#111827] border border-white/5 text-gray-500 px-4 py-3 rounded-2xl rounded-tl-md text-sm">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-6 pb-6 pt-2 shrink-0">
        <div className="flex items-end gap-3 bg-[#111827] border border-white/10 rounded-2xl p-2 focus-within:border-[#3B82F6]/50 transition-colors">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none resize-none py-2 max-h-32 disabled:opacity-50"
          />
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors shrink-0">
            <Smile className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-[#3B82F6] hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl transition-colors shrink-0"
          >
            <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          AI-powered responses are generated automatically. Review before sending to customers.
        </p>
      </div>
    </div>
  );
}

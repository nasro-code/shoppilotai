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
    <div className="w-80 shrink-0 border-r border-white/5 flex flex-col bg-[#0B0F1A]">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white mb-3">Conversations</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 bg-[#111827] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>
      </div>

      {/* Conversation items */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const isSelected = conv.id === selectedId;
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left px-4 py-3.5 flex gap-3 transition-all duration-150 border-b border-white/[0.03] ${
                isSelected
                  ? "bg-[#3B82F6]/10 border-l-2 border-l-[#3B82F6]"
                  : "hover:bg-white/[0.03] border-l-2 border-l-transparent"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                  isSelected ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" : "bg-[#111827] text-gray-300 border border-white/10"
                }`}>
                  {conv.avatar}
                </div>
                {conv.status === "active" && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0B0F1A]"></span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-sm font-medium truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
                    {conv.customerName}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0 ml-2">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 truncate pr-2">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 bg-[#3B82F6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    conv.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : conv.status === "pending"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-gray-500/10 text-gray-400"
                  }`}>
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

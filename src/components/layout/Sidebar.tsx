import Link from "next/link";
import { LayoutDashboard, MessageSquare, ShoppingCart, Settings } from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Chats", href: "/chats", icon: MessageSquare },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/5 flex flex-col" style={{ backgroundColor: "#0B0F1A" }}>
      <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          AutoCommerce AI
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 block">
        {navItems.map((item) => {
          const isActive = item.name === "Dashboard"; // Hardcoded for preview
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-[#3B82F6]/10 text-[#3B82F6]" 
                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-[#3B82F6]" : "text-gray-400 group-hover:text-gray-100 transition-colors"}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-[#111827] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

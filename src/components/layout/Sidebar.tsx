'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  ShoppingCart, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Chats", href: "/chats", icon: MessageSquare },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const userInitial = user?.email?.[0].toUpperCase() || "A";

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/5 flex flex-col z-50 shadow-2xl" style={{ backgroundColor: "#0B0F1A" }}>
      <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
           <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
             <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_8px_white]"></div>
           </div>
           <h1 className="text-lg font-bold tracking-tight text-white">
            AutoCommerce
          </h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? "bg-blue-500/10 text-blue-400 font-semibold shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"></div>
              )}
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`} />
              <span className="text-sm">{item.name}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto text-blue-400/50" />
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-white/5 space-y-3">
        {user && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              {userInitial}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.email?.split('@')[0]}</p>
              <p className="text-[10px] text-gray-500 truncate font-medium">{user.email}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

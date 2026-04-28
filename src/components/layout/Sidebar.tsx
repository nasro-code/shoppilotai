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
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
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
    <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col z-50 shadow-lg" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="h-16 flex items-center px-6 shrink-0" style={{ borderBottom: "0.67px solid #E2E8F0" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#10B981" }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFFFFF" }}></div>
          </div>
          <h1 className="text-lg font-semibold tracking-tight" style={{ color: "#0F172A" }}>
            Shoppilot
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
                  ? "text-white font-semibold shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              style={isActive ? { backgroundColor: "#10B981" } : {}}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-6 rounded-r-full" style={{ backgroundColor: "#0F172A" }}></div>
              )}
              <item.icon
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span className="text-sm" style={isActive ? { color: "#FFFFFF" } : {}}>{item.name}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" style={{ color: "#FFFFFF" }} />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 space-y-3" style={{ borderTop: "0.67px solid #E2E8F0" }}>
        {user && (
          <div className="flex items-center gap-3 p-2 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "0.67px solid #E2E8F0" }}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-md"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
            >
              {userInitial}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: "#0F172A" }}>{user.email?.split('@')[0]}</p>
              <p className="text-[10px] truncate font-medium" style={{ color: "#64748B" }}>{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group"
          style={{ color: "#64748B" }}
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

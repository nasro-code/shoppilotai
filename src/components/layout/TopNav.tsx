import { Search, Bell } from "lucide-react";

export default function TopNav() {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md" style={{ backgroundColor: "rgba(11, 15, 26, 0.8)" }}>
      <div className="flex-1">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-[#111827] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-sm text-white placeholder-gray-500 outline-none transition-all"
            placeholder="Search functionality..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#3B82F6] rounded-full border border-[#0B0F1A]"></span>
        </button>
      </div>
    </header>
  );
}

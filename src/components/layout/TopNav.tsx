import { Search, Bell } from "lucide-react";

export default function TopNav() {
  return (
    <header
      className="h-16 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderBottom: "0.67px solid #F1F5F9"
      }}
    >
      <div className="flex-1">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4" style={{ color: "#64748B" }} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 rounded-xl text-sm outline-none transition-all"
            style={{
              backgroundColor: "#F8FAFC",
              border: "0.67px solid #E2E8F0",
              color: "#0F172A"
            }}
            placeholder="Search functionality..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-full transition-colors"
          style={{ color: "#64748B" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-2 right-2.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#10B981", border: "2px solid #FFFFFF" }}
          ></span>
        </button>
      </div>
    </header>
  );
}

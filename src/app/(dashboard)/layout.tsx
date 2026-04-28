import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopNav />
        <main className="p-8" style={{ backgroundColor: "#F8FAFC" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

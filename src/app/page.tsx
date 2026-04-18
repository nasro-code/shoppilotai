import KPICard from "@/components/dashboard/KPICard";
import { MessageSquareText, Clock, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening with your AutoCommerce AI today.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KPICard 
          title="Messages Handled" 
          value="14,295" 
          icon={<MessageSquareText className="w-6 h-6" />} 
          trend="+12%" 
          trendUp={true} 
        />
        <KPICard 
          title="Avg. Response Time" 
          value="1.2s" 
          icon={<Clock className="w-6 h-6" />} 
          trend="-0.3s" 
          trendUp={true} 
        />
        <KPICard 
          title="Automation Rate" 
          value="92.4%" 
          icon={<Zap className="w-6 h-6" />} 
          trend="+4.1%" 
          trendUp={true} 
        />
      </div>
      
      {/* Dummy charts/boards area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 bg-[#111827] border border-white/5 rounded-2xl p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Message Volume</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-full w-full flex items-center justify-center border-t border-white/5 pt-4">
            <p className="text-sm text-gray-500">Chart Visualization Placeholder</p>
          </div>
        </div>
        
        <div className="lg:col-span-3 bg-[#111827] border border-white/5 rounded-2xl p-6 min-h-[400px]">
          <h3 className="font-semibold text-lg mb-4">Recent Automation Events</h3>
          <div className="space-y-4 border-t border-white/5 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-[#3B82F6] mt-2 shrink-0 shadow-[0_0_8px_#3B82F6]"></div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Order #100{i} Processed</p>
                  <p className="text-xs text-gray-400">AI successfully identified and created tracking link.</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">{i * 10}m ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

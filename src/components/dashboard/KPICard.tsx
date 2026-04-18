import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string;
  trend?: string;
  icon: ReactNode;
  trendUp?: boolean;
}

export default function KPICard({ title, value, trend, icon, trendUp = true }: KPICardProps) {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/0 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 bg-white/5 rounded-lg text-[#3B82F6]">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

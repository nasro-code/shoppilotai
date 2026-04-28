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
    <div
      className="transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        border: "0.666667px solid #F1F5F9",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px"
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"
        style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)" }}
      ></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "#F0FDF4", color: "#10B981" }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              backgroundColor: trendUp ? "#F0FDF4" : "#FEF2F2",
              color: trendUp ? "#10B981" : "#EF4444",
              border: `0.67px solid ${trendUp ? "#D1FAE5" : "#FEE2E2"}`
            }}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-medium mb-1" style={{ color: "#64748B" }}>{title}</h3>
        <p
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#0F172A" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

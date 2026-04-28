'use client';

import { useState, useEffect } from 'react';
import KPICard from "@/components/dashboard/KPICard";
import {
  MessageSquareText,
  Clock,
  Zap,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const messageData = [
  { name: 'Mon', count: 1200 },
  { name: 'Tue', count: 1900 },
  { name: 'Wed', count: 1600 },
  { name: 'Thu', count: 2100 },
  { name: 'Fri', count: 2400 },
  { name: 'Sat', count: 1800 },
  { name: 'Sun', count: 2200 },
];

const automationData = [
  { name: 'Automated', value: 92 },
  { name: 'Human Escalation', value: 8 },
];

const COLORS = ['#10B981', '#E2E8F0'];

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>Dashboard Overview</h2>
        <p className="mt-1" style={{ color: "#64748B" }}>Real-time performance metrics for your Shoppilot AI.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Total Messages"
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="p-6 shadow-md"
          style={{
            backgroundColor: "#FFFFFF",
            border: "0.666667px solid #F1F5F9",
            borderRadius: "24px",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: "#10B981" }} />
              <h3 className="text-lg font-semibold" style={{ color: "#0F172A" }}>Chat Volume</h3>
            </div>
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "#F0FDF4",
                color: "#10B981",
                border: "0.67px solid #D1FAE5"
              }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% growth</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {isClient && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={messageData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '0.67px solid #F1F5F9',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#0F172A' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div
          className="p-6 shadow-md"
          style={{
            backgroundColor: "#FFFFFF",
            border: "0.666667px solid #F1F5F9",
            borderRadius: "24px",
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-4 h-4" style={{ color: "#10B981" }} />
            <h3 className="text-lg font-semibold" style={{ color: "#0F172A" }}>Automation Success</h3>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            {isClient && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={automationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {automationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '0.67px solid #F1F5F9',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold" style={{ color: "#0F172A" }}>92%</span>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#64748B" }}>Auto</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10B981" }}></div>
              <span className="text-xs font-medium" style={{ color: "#64748B" }}>Automated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E2E8F0" }}></div>
              <span className="text-xs font-medium" style={{ color: "#64748B" }}>Escalated</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div
          className="lg:col-span-2 p-6 shadow-md"
          style={{
            backgroundColor: "#FFFFFF",
            border: "0.666667px solid #F1F5F9",
            borderRadius: "24px",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: "#0F172A" }}>Recent Automation Events</h3>
            <button
              className="flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: "#10B981" }}
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 transition-all"
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "0.67px solid #F1F5F9",
                  borderRadius: "16px"
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#F0FDF4", border: "0.67px solid #D1FAE5" }}
                >
                  <Zap className="w-5 h-5" style={{ color: "#10B981" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Order #AC-100{i} Processed</p>
                  <p className="text-xs" style={{ color: "#64748B" }}>AI successfully identified tracking link for customer.</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>{i * 10}m ago</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full mt-1 font-medium"
                    style={{
                      backgroundColor: "#F0FDF4",
                      color: "#10B981",
                      border: "0.67px solid #D1FAE5"
                    }}
                  >
                    Success
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-6 shadow-md"
          style={{
            backgroundColor: "#FFFFFF",
            border: "0.666667px solid #F1F5F9",
            borderRadius: "24px",
          }}
        >
          <h3 className="text-lg font-semibold mb-6" style={{ color: "#0F172A" }}>Top Customer Issues</h3>
          <div className="space-y-5">
            {[
              { topic: "Order Status", percent: 45, color: "#10B981" },
              { topic: "Returns & Refunds", percent: 30, color: "#0F172A" },
              { topic: "Account Access", percent: 15, color: "#EF4444" },
              { topic: "Other", percent: 10, color: "#94A3B8" }
            ].map((issue, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium" style={{ color: "#0F172A" }}>{issue.topic}</span>
                  <span style={{ color: "#64748B" }}>{issue.percent}%</span>
                </div>
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ backgroundColor: "#F1F5F9" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${issue.percent}%`, backgroundColor: issue.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-8 p-4 rounded-xl"
            style={{
              backgroundColor: "#F0FDF4",
              border: "0.67px solid #D1FAE5"
            }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-1"
              style={{ color: "#10B981" }}
            >
              AI Recommendation
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
              Consider updating your &quot;Order Status&quot; FAQ prompt to reduce manual overrides by 15%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

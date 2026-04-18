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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock Data for Charts
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

const COLORS = ['#3B82F6', '#1E293B'];

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-gray-400 mt-1">Real-time performance metrics for your AutoCommerce AI.</p>
      </div>
      
      {/* KPI Cards */}
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
      
      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Message Volume Area Chart */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-lg text-white">Chat Volume</h3>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
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
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Automation Rate Pie Chart */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-lg text-white">Automation Success</h3>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
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
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-white">92%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Auto</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-400 font-medium">Automated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-800"></div>
              <span className="text-xs text-gray-400 font-medium">Escalated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Recent Activity & Top Issues */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-2xl p-6">
           <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-white">Recent Automation Events</h3>
            <button className="text-blue-400 text-xs font-semibold flex items-center gap-1 hover:text-blue-300 transition-colors">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-200">Order #AC-100{i} Processed</p>
                  <p className="text-xs text-gray-400">AI successfully identified tracking link for customer.</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{i * 10}m ago</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">Success</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
           <h3 className="font-semibold text-lg text-white mb-6">Top Customer Issues</h3>
           <div className="space-y-5">
             {[
               { topic: "Order Status", percent: 45, color: "bg-blue-500" },
               { topic: "Returns & Refunds", percent: 30, color: "bg-purple-500" },
               { topic: "Account Access", percent: 15, color: "bg-amber-500" },
               { topic: "Other", percent: 10, color: "bg-gray-500" }
             ].map((issue, idx) => (
               <div key={idx} className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-300 font-medium">{issue.topic}</span>
                   <span className="text-gray-500">{issue.percent}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div 
                    className={`h-full ${issue.color} rounded-full`} 
                    style={{ width: `${issue.percent}%` }}
                   ></div>
                 </div>
               </div>
             ))}
           </div>
           <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
             <p className="text-[11px] text-blue-400 font-bold uppercase tracking-widest mb-1">AI Recommendation</p>
             <p className="text-xs text-gray-400 leading-relaxed">
               Consider updating your "Order Status" FAQ prompt to reduce manual overrides by 15%.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}

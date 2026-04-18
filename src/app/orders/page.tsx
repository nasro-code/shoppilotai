import { getAllOrders } from "@/lib/shopify";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default async function OrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Orders Management</h2>
          <p className="text-gray-400 mt-1">Manage and track your customer orders from Shopify.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all text-sm font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-blue-500/20">
            Sync Stores
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Orders", value: "2,543" },
          { label: "Successful Deliveries", value: "2,401" },
          { label: "Refunded", value: "12" },
          { label: "Pending", value: "130" }
        ].map((stat, idx) => (
          <div key={idx} className="p-4 bg-[#111827] border border-white/5 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Filters */}
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search orders, customers, IDs..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/5 transition-all text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-sm font-semibold text-white">{order.order_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      order.status === "Shipped" || order.status === "Delivered" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : order.status === "Processing" 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{order.shipping_date}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300 truncate max-w-[200px]">{order.items.join(", ")}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{order.items.length} items</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white text-right">{order.total_price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors" title="View in Shopify">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">Showing 1-4 of 2,543 orders</p>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1 bg-white/5 text-gray-600 rounded-lg text-xs font-bold border border-white/5 cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 bg-white/5 text-white rounded-lg text-xs font-bold border border-white/5 hover:bg-white/10 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

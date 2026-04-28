import { getAllOrders } from "@/lib/shopify";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let orders: any[] = [];
  try {
    orders = await getAllOrders(user.id);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>Orders Management</h2>
          <p className="mt-1" style={{ color: "#64748B" }}>Manage and track your customer orders from Shopify.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium"
            style={{
              backgroundColor: "#FFFFFF",
              border: "0.67px solid #E2E8F0",
              color: "#475569"
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold text-white shadow-md"
            style={{ backgroundColor: "#10B981" }}
          >
            Sync Stores
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Orders", value: "2,543" },
          { label: "Successful Deliveries", value: "2,401" },
          { label: "Refunded", value: "12" },
          { label: "Pending", value: "130" }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4"
            style={{
              backgroundColor: "#FFFFFF",
              border: "0.67px solid #F1F5F9",
              borderRadius: "16px"
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#64748B" }}>{stat.label}</p>
            <p className="text-xl font-bold" style={{ color: "#0F172A" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div
        className="overflow-hidden shadow-md"
        style={{
          backgroundColor: "#FFFFFF",
          border: "0.67px solid #F1F5F9",
          borderRadius: "24px"
        }}
      >
        <div
          className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between"
          style={{ borderBottom: "0.67px solid #F1F5F9" }}
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748B" }} />
            <input
              type="text"
              placeholder="Search orders, customers, IDs..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: "#F8FAFC",
                border: "0.67px solid #E2E8F0",
                color: "#0F172A"
              }}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all text-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: "0.67px solid #E2E8F0",
                color: "#475569"
              }}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "0.67px solid #F1F5F9" }}>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>Order ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>Items</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right" style={{ color: "#64748B" }}>Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody style={{ borderBottom: "0.67px solid #F1F5F9" }}>
              {orders.map((order) => (
                <tr key={order.order_id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#F8FAFC", border: "0.67px solid #E2E8F0" }}
                      >
                        <ShoppingBag className="w-4 h-4" style={{ color: "#64748B" }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>{order.order_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: order.status === "Shipped" || order.status === "Delivered" ? "#F0FDF4" : order.status === "Processing" ? "#FEF3C7" : "#FEF2F2",
                        color: order.status === "Shipped" || order.status === "Delivered" ? "#10B981" : order.status === "Processing" ? "#D97706" : "#EF4444",
                        border: `0.67px solid ${order.status === "Shipped" || order.status === "Delivered" ? "#D1FAE5" : order.status === "Processing" ? "#FDE68A" : "#FEE2E2"}`
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#64748B" }}>{order.shipping_date}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm truncate max-w-[200px]" style={{ color: "#374151" }}>{order.items.join(", ")}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>{order.items.length} items</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-right" style={{ color: "#0F172A" }}>{order.total_price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: "#64748B" }}
                        title="View in Shopify"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: "#64748B" }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="p-4 flex items-center justify-between"
          style={{ borderTop: "0.67px solid #F1F5F9" }}
        >
          <p className="text-xs font-medium" style={{ color: "#64748B" }}>Showing 1-4 of 2,543 orders</p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-3 py-1 rounded-lg text-xs font-bold cursor-not-allowed"
              style={{ backgroundColor: "#F8FAFC", color: "#94A3B8", border: "0.67px solid #E2E8F0" }}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
              style={{ backgroundColor: "#F8FAFC", color: "#0F172A", border: "0.67px solid #E2E8F0" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

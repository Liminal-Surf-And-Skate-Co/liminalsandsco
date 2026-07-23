// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, ArrowLeft, Eye, X, ListFilter as Filter, Loader as Loader2 } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Admin — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: AdminOrdersPage,
});

type CustomOrder = {
  id: string;
  email: string;
  product_type: string;
  product_name: string;
  design_json: Record<string, unknown> | null;
  specs_json: Record<string, unknown> | null;
  image_data_url: string | null;
  price: number;
  status: string;
  customer_note: string;
  created_at: string;
  share_slug: string;
};

type OrderStatus = "all" | "pending" | "in production" | "shipped";

function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [selected, setSelected] = useState<CustomOrder | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "custom-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as CustomOrder[]) ?? [];
    },
  });

  const filtered = orders?.filter((o) => {
    if (statusFilter === "all") return true;
    return o.status.toLowerCase() === statusFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-silver/60 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-2xl md:text-3xl">Order & Design Management</h1>
        </div>

        {/* Status filter bar */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-silver/60" />
          {(["all", "pending", "in production", "shipped"] as OrderStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border rounded-md transition-colors ${
                statusFilter === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-silver hover:border-primary"
              }`}
            >
              {s}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-silver/60">{filtered?.length ?? 0} orders</span>
        </div>

        {/* Orders table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-silver/40" />
          </div>
        ) : !filtered || filtered.length === 0 ? (
          <div className="border border-border/60 bg-card rounded-lg p-8 text-center">
            <p className="text-silver/60 text-sm">No orders found for this filter.</p>
          </div>
        ) : (
          <div className="border border-border/60 bg-card rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Product</th>
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Email</th>
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Price</th>
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Status</th>
                    <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Date</th>
                    <th className="text-right px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-t border-border/30 hover:bg-muted/50">
                      <td className="px-4 py-3 font-mono text-xs">{order.product_name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-silver/60">{order.email}</td>
                      <td className="px-4 py-3 font-mono text-xs">${Number(order.price).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-mono uppercase rounded-full ${
                          order.status === "pending" ? "bg-warning/20 text-warning" :
                          order.status === "in production" ? "bg-primary/20 text-primary" :
                          order.status === "shipped" ? "bg-success/20 text-success" :
                          "bg-muted text-silver/60"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-silver/50">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelected(order)} className="p-1.5 text-silver hover:text-primary">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Inline preview modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelected(null)}>
          <div className="bg-card max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg border border-border/60 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl">Order Details</h2>
              <button onClick={() => setSelected(null)} className="text-silver hover:text-destructive">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs mb-4">
              <Row label="Product" value={selected.product_name} />
              <Row label="Type" value={selected.product_type} />
              <Row label="Email" value={selected.email} />
              <Row label="Price" value={`$${Number(selected.price).toFixed(2)}`} />
              <Row label="Status" value={selected.status} />
              <Row label="Note" value={selected.customer_note || "—"} />
              <Row label="Created" value={new Date(selected.created_at).toLocaleString()} />
            </div>

            {/* Preview thumbnail */}
            {selected.image_data_url && (
              <div className="mb-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2">Preview Thumbnail</p>
                <img src={selected.image_data_url} alt="Design preview" className="w-full max-w-sm border border-border/40 rounded-md" />
              </div>
            )}

            {/* Design JSON spec */}
            {selected.design_json && (
              <div className="mb-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2">Design JSON Spec</p>
                <pre className="bg-background border border-border/40 rounded-md p-3 text-[10px] overflow-x-auto max-h-48">
                  {JSON.stringify(selected.design_json, null, 2)}
                </pre>
              </div>
            )}

            {/* Specs JSON */}
            {selected.specs_json && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2">Specs JSON</p>
                <pre className="bg-background border border-border/40 rounded-md p-3 text-[10px] overflow-x-auto max-h-48">
                  {JSON.stringify(selected.specs_json, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-silver/50 uppercase tracking-widest w-24 shrink-0">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

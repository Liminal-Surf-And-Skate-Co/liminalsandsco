import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/main";

type CustomOrder = {
  id: string;
  email: string;
  product_type: string;
  product_name: string;
  design_json: Record<string, unknown>;
  specs_json: Record<string, unknown>;
  image_data_url: string | null;
  price: number;
  status: string;
  customer_note: string;
  created_at: string;
  share_slug: string;
};

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CustomOrder | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data } = await supabase
        .from("custom_orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders((data as CustomOrder[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    await supabase.from("custom_orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status } : null));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">Admin</p>
        <h1 className="font-display font-black text-4xl mb-8">CUSTOM ORDERS</h1>

        {orders.length === 0 ? (
          <div className="border border-border/60 bg-card p-8 text-center">
            <p className="text-silver/60 text-sm">No custom orders submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-border/60 bg-card">
              <thead>
                <tr className="border-b border-border/40 font-mono text-[10px] uppercase tracking-widest text-silver/60">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{order.product_name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-silver">{order.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-silver">${Number(order.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="px-2 py-1 bg-background border border-border/60 font-mono text-[10px] uppercase tracking-widest text-silver focus:outline-none focus:border-accent"
                      >
                        {["pending", "reviewing", "approved", "completed", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-silver/50">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(order)} className="p-1.5 text-silver hover:text-accent">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelected(null)}>
          <div className="bg-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 border border-border/60" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl">Order Details</h2>
              <button onClick={() => setSelected(null)} className="text-silver hover:text-destructive">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <Row label="Product" value={selected.product_name} />
              <Row label="Type" value={selected.product_type} />
              <Row label="Email" value={selected.email} />
              <Row label="Price" value={`$${Number(selected.price).toFixed(2)}`} />
              <Row label="Status" value={selected.status} />
              <Row label="Note" value={selected.customer_note || "—"} />
              <Row label="Share Slug" value={selected.share_slug} />
              <Row label="Created" value={new Date(selected.created_at).toLocaleString()} />
            </div>
            {selected.image_data_url && (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2">Exported Mockup</p>
                <img src={selected.image_data_url} alt="Design mockup" className="w-full border border-border/40" />
              </div>
            )}
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2">Design JSON</p>
              <pre className="bg-background border border-border/40 p-3 text-[10px] overflow-x-auto max-h-48">
                {JSON.stringify(selected.design_json, null, 2)}
              </pre>
            </div>
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2">Specs JSON</p>
              <pre className="bg-background border border-border/40 p-3 text-[10px] overflow-x-auto max-h-48">
                {JSON.stringify(selected.specs_json, null, 2)}
              </pre>
            </div>
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

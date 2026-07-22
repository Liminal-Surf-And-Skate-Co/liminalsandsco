import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Trash2, Eye, RefreshCw } from "lucide-react";
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
  price: number;
  status: string;
  customer_note: string;
  created_at: string;
  share_slug: string;
};

export default function GaragePage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) { setLoading(false); return; }
      setSessionEmail(session.session.user.email ?? null);
      const { data } = await supabase
        .from("custom_orders")
        .select("*")
        .eq("email", session.session.user.email ?? "")
        .order("created_at", { ascending: false });
      setOrders((data as CustomOrder[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const deleteOrder = async (id: string) => {
    if (!supabase) return;
    await supabase.from("custom_orders").delete().eq("id", id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
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
      <main className="max-w-5xl mx-auto px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">My Garage</p>
        <h1 className="font-display font-black text-4xl mb-8">SAVED BUILDS</h1>

        {!sessionEmail && (
          <div className="border border-border/60 bg-card p-8 text-center">
            <p className="text-silver/60 text-sm mb-4">Sign in to view your saved custom designs.</p>
            <Link to="/design-studio" className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
              Go to Design Studio →
            </Link>
          </div>
        )}

        {sessionEmail && orders.length === 0 && (
          <div className="border border-border/60 bg-card p-8 text-center">
            <p className="text-silver/60 text-sm mb-4">No saved builds yet. Design something custom!</p>
            <Link to="/design-studio" className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
              Open Design Studio →
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border border-border/60 bg-card p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary/40 border border-border/40 flex items-center justify-center text-2xl">
                  {order.product_type === "skate" ? "🛹" : order.product_type === "surf" ? "🏄" : order.product_type === "tee" ? "👕" : "🧥"}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-sm">{order.product_name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
                    {order.product_type} · ${Number(order.price).toFixed(2)} · {order.status}
                  </p>
                  <p className="font-mono text-[9px] text-silver/40 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to="/design-studio"
                  className="p-2 text-silver hover:text-accent"
                  title="Load in studio"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="p-2 text-silver hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link to="/design-studio" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
            <RefreshCw className="h-3 w-3" /> Back to Design Studio
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

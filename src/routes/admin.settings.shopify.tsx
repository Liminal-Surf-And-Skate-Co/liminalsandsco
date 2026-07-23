import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Store, ArrowLeft, Eye, EyeOff, RefreshCw, CircleCheck as CheckCircle2, Circle as XCircle } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/shopify")({
  head: () => ({ meta: [{ title: "Shopify Settings — Admin — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: ShopifySettingsPage,
});

type SyncedProduct = {
  id: string;
  title: string;
  sku: string;
  inventory: number;
  syncStatus: "synced" | "pending" | "error";
  lastSynced: string;
};

const MOCK_PRODUCTS: SyncedProduct[] = [
  { id: "1", title: "Venice Deck — 8.0\"", sku: "VD-800", inventory: 24, syncStatus: "synced", lastSynced: "2025-07-22 10:30" },
  { id: "2", title: "Liminal Hoodie — Black", sku: "LH-BLK", inventory: 12, syncStatus: "synced", lastSynced: "2025-07-22 09:15" },
  { id: "3", title: "Surf Wax — Tropical", sku: "SW-TROP", inventory: 0, syncStatus: "pending", lastSynced: "2025-07-21 16:00" },
  { id: "4", title: "Custom Truck Set — 99A", sku: "CT-99A", inventory: 8, syncStatus: "error", lastSynced: "2025-07-20 12:00" },
  { id: "5", title: "Retro Tee — Sunset", sku: "RT-SUN", inventory: 45, syncStatus: "synced", lastSynced: "2025-07-22 11:00" },
];

function ShopifySettingsPage() {
  const [apiKey, setApiKey] = useState("shpat_••••••••••••••••••••••••");
  const [apiSecret, setApiSecret] = useState("shpss_•••••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [inventoryWebhooks, setInventoryWebhooks] = useState(false);
  const [orderPush, setOrderPush] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [products] = useState<SyncedProduct[]>(MOCK_PRODUCTS);

  const syncNow = () => {
    setSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setSyncing(false);
          toast.success("Shopify sync complete — 5 products updated");
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-silver/60 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Store className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-2xl md:text-3xl">Shopify Integration</h1>
        </div>

        {/* API credentials */}
        <div className="border border-border/60 bg-card rounded-lg p-6 mb-6">
          <h2 className="font-display font-bold text-lg mb-4">API Credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-1.5">Shopify API Key</label>
              <div className="flex gap-2">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver rounded-md focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="px-3 py-2.5 border border-border/60 rounded-md text-silver hover:border-primary"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-1.5">Shopify API Secret</label>
              <div className="flex gap-2">
                <input
                  type={showSecret ? "text" : "password"}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver rounded-md focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="px-3 py-2.5 border border-border/60 rounded-md text-silver hover:border-primary"
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sync controls */}
        <div className="border border-border/60 bg-card rounded-lg p-6 mb-6">
          <h2 className="font-display font-bold text-lg mb-4">Sync Settings</h2>
          <div className="space-y-3">
            <ToggleRow label="Auto-Sync Products" description="Automatically sync product catalog every 15 minutes" checked={autoSync} onChange={setAutoSync} />
            <ToggleRow label="Inventory Webhooks" description="Listen for real-time inventory updates from Shopify" checked={inventoryWebhooks} onChange={setInventoryWebhooks} />
            <ToggleRow label="Order Push" description="Push completed orders to Shopify for fulfillment" checked={orderPush} onChange={setOrderPush} />
          </div>

          {/* Sync Now button with progress */}
          <div className="mt-6">
            <button
              onClick={syncNow}
              disabled={syncing}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-lg hover:opacity-90 disabled:opacity-40"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Syncing…" : "Sync Now"}
            </button>
            {syncing && (
              <div className="mt-3">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-150" style={{ width: `${syncProgress}%` }} />
                </div>
                <p className="font-mono text-[10px] text-silver/60 mt-1">{syncProgress}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Synced products table */}
        <div className="border border-border/60 bg-card rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40">
            <h2 className="font-display font-bold text-lg">Recently Syncched Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Product</th>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">SKU</th>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Inventory</th>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Last Synced</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border/30 hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-xs">{p.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-silver/60">{p.sku}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.inventory}</td>
                    <td className="px-4 py-3">
                      {p.syncStatus === "synced" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-success">
                          <CheckCircle2 className="h-3 w-3" /> Synced
                        </span>
                      )}
                      {p.syncStatus === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-warning">
                          <RefreshCw className="h-3 w-3" /> Pending
                        </span>
                      )}
                      {p.syncStatus === "error" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-destructive">
                          <XCircle className="h-3 w-3" /> Error
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-silver/50">{p.lastSynced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs text-silver/60">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : ""}`} />
      </button>
    </div>
  );
}

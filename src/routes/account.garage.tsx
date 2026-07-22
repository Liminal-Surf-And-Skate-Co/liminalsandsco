// @ts-nocheck
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, ShoppingCart, ExternalLink, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/account/garage")({
  head: () => ({
    meta: [
      { title: "My Garage — Saved Designs · Liminal" },
      { name: "description", content: "Your saved custom designs. Load, rename, add to cart, or delete." },
      { property: "og:title", content: "My Garage — Liminal" },
      { property: "og:description", content: "Manage your saved custom board and apparel designs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GaragePage,
});

const STORAGE_KEY = "liminal:garage";

type SavedDesign = {
  id: string;
  title: string;
  product: string;
  thumbnail?: string;
  bg?: string;
  ink?: string;
  price?: number;
  savedAt: string;
  data?: unknown;
};

function readGarage(): SavedDesign[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeGarage(list: SavedDesign[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function GaragePage() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setDesigns(readGarage());
  }, []);

  const handleDelete = (id: string) => {
    const next = designs.filter((d) => d.id !== id);
    setDesigns(next);
    writeGarage(next);
    toast.success("Design deleted");
  };

  const handleRename = (id: string) => {
    const next = designs.map((d) => (d.id === id ? { ...d, title: renameValue.trim() || d.title } : d));
    setDesigns(next);
    writeGarage(next);
    setEditingId(null);
    toast.success("Renamed");
  };

  const handleAddToCart = (d: SavedDesign) => {
    add(`custom-${d.id}`, 1);
    toast.success(`Added "${d.title}" to cart`);
  };

  const handleLoad = (d: SavedDesign) => {
    try {
      localStorage.setItem("liminal:studio-load", JSON.stringify(d));
    } catch {}
    navigate({ to: "/design-studio" });
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">Account</p>
            <h1 className="font-display font-black text-4xl md:text-5xl text-foreground">My Garage</h1>
            <p className="text-sm text-muted-foreground mt-2">Your saved custom designs live here.</p>
          </div>
          <Link to="/design-studio">
            <Button variant="default" className="font-mono text-xs uppercase tracking-widest">
              Start New Design
            </Button>
          </Link>
        </div>

        {designs.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 text-center bg-card">
            <ImageOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-display text-xl mb-2">No saved designs yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Head to the Design Studio and hit "Save to Garage" to see your creations here.
            </p>
            <Link to="/design-studio">
              <Button>Open Design Studio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((d) => (
              <article
                key={d.id}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-card flex flex-col"
              >
                <div
                  className="aspect-square w-full flex items-center justify-center"
                  style={{ background: d.bg || "var(--muted)" }}
                >
                  {d.thumbnail ? (
                    <img src={d.thumbnail} alt={d.title} className="w-full h-full object-cover" />
                  ) : (
                    <span
                      className="font-display font-black text-3xl"
                      style={{ color: d.ink || "var(--foreground)" }}
                    >
                      {(d.title || "LIMINAL").slice(0, 12).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  {editingId === d.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleRename(d.id)}
                      />
                      <Button size="sm" onClick={() => handleRename(d.id)}>Save</Button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-display font-bold text-lg text-foreground truncate">{d.title}</h2>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {d.product} · {new Date(d.savedAt).toLocaleDateString()}
                      </p>
                      {typeof d.price === "number" && (
                        <p className="font-mono text-sm text-primary mt-1">${d.price.toFixed(2)}</p>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleLoad(d)}
                      className="font-mono text-[10px] uppercase tracking-widest"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(d.id);
                        setRenameValue(d.title);
                      }}
                      className="font-mono text-[10px] uppercase tracking-widest"
                    >
                      <Pencil className="h-3 w-3 mr-1" /> Rename
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(d)}
                      className="font-mono text-[10px] uppercase tracking-widest"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" /> Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(d.id)}
                      className="font-mono text-[10px] uppercase tracking-widest text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

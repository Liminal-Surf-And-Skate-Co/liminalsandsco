import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { useProducts, productImage, effectivePrice, DEPARTMENT_LABELS } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Liminal Surf & Skate Co" },
      { name: "description", content: "Your saved pieces — boards, gear, and one-offs waiting for payday." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { slugs, remove } = useWishlist();
  const { add } = useCart();
  const { data: products = [], isLoading } = useProducts();
  const items = products.filter((p) => slugs.includes(p.slug));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-4xl lg:text-5xl">Your Wishlist</h1>
        </div>

        {isLoading ? (
          <p className="font-mono text-xs text-silver/60">Loading…</p>
        ) : items.length === 0 ? (
          <div className="border border-border/60 bg-card p-12 text-center">
            <p className="font-mono text-sm text-silver/70 mb-6">No saved pieces yet.</p>
            <Link to="/shop" className="font-mono text-xs uppercase tracking-widest text-primary hover:underline">
              Browse the shop →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <div key={p.slug} className="group bg-card border border-border/60 overflow-hidden relative">
                <button
                  onClick={() => remove(p.slug)}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center bg-background/80 backdrop-blur border border-border/60 text-silver hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
                <Link to="/shop/$slug" params={{ slug: p.slug }} className="block aspect-square overflow-hidden bg-background">
                  <img src={productImage(p)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </Link>
                <div className="p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">{DEPARTMENT_LABELS[p.department]}</p>
                  <h3 className="font-display font-bold text-lg mb-3">{p.title}</h3>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-silver text-sm font-mono">${effectivePrice(p)}</span>
                    <button
                      onClick={() => add(p.slug)}
                      className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

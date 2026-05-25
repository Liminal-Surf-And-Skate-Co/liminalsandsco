import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingCart, X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/hooks/use-cart";
import { getProductBySlug } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Liminal Surf & Skate Co" },
      { name: "description", content: "Your selected pieces, ready to inquire." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const lines = items
    .map((i) => ({ item: i, product: getProductBySlug(i.slug) }))
    .filter((l): l is { item: typeof items[number]; product: NonNullable<ReturnType<typeof getProductBySlug>> } => Boolean(l.product));

  const subtotal = lines.reduce((n, l) => n + l.product.price * l.item.qty, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-4xl lg:text-5xl">Your Cart</h1>
        </div>

        {lines.length === 0 ? (
          <div className="border border-border/60 bg-card p-12 text-center">
            <p className="font-mono text-sm text-silver/70 mb-6">Cart is empty.</p>
            <Link to="/shop" className="font-mono text-xs uppercase tracking-widest text-primary hover:underline">
              Browse the shop →
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border/40 border-y border-border/40 mb-8">
              {lines.map(({ item, product }) => (
                <li key={product.slug} className="flex gap-4 py-5 items-center">
                  <Link to="/shop/$slug" params={{ slug: product.slug }} className="w-20 h-20 bg-background overflow-hidden shrink-0">
                    <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">{product.category}</p>
                    <h3 className="font-display font-bold text-lg truncate">{product.title}</h3>
                    <p className="font-mono text-xs text-silver/70">${product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(product.slug, item.qty - 1)}
                      className="h-8 w-8 border border-border/60 font-mono text-silver hover:border-primary"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="font-mono text-sm w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => setQty(product.slug, item.qty + 1)}
                      className="h-8 w-8 border border-border/60 font-mono text-silver hover:border-primary"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-mono text-sm w-20 text-right">${product.price * item.qty}</p>
                  <button onClick={() => remove(product.slug)} aria-label="Remove" className="text-silver/60 hover:text-primary">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button onClick={clear} className="font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary">
                Clear cart
              </button>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">Subtotal</p>
                <p className="font-display font-black text-3xl mb-4">${subtotal}</p>
                <button
                  onClick={() => alert("Checkout is coming soon — for now, contact us via the product inquiry form.")}
                  className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-8 py-3 hover:opacity-90 transition-opacity"
                >
                  Proceed to inquiry
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

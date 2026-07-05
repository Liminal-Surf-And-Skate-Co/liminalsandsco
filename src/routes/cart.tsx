import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingCart, X, Package, Gift } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/hooks/use-cart";
import { useProducts, productImage, effectivePrice, DEPARTMENT_LABELS } from "@/lib/products";
import { MascotLiam } from "@/components/site/MascotLiam";

const FREE_SHIPPING_THRESHOLD = 150; // AUD

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
  const { data: products = [], isLoading } = useProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines = items
    .map((i) => ({ item: i, product: bySlug.get(i.slug) }))
    .filter(
      (
        l,
      ): l is {
        item: (typeof items)[number];
        product: NonNullable<ReturnType<typeof bySlug.get>>;
      } => Boolean(l.product),
    );

  const subtotal = lines.reduce((n, l) => n + effectivePrice(l.product) * l.item.qty, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-4xl lg:text-5xl">Your Cart</h1>
        </div>

        {isLoading ? (
          <p className="font-mono text-xs text-silver/60">Loading…</p>
        ) : lines.length === 0 ? (
          <div className="border border-border/60 bg-card p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-silver/10 flex items-center justify-center mx-auto mb-4">
              <MascotLiam size={40} />
            </div>
            <p className="font-display font-bold text-xl mb-2 text-silver">
              Your cart is completely empty.
            </p>
            <p className="font-mono text-sm text-silver/70 mb-6 italic">
              "Liam is judging you. Go get some gear."
            </p>
            <Link
              to="/shop"
              className="inline-block font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground px-6 py-3 hover:opacity-90"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border/40 border-y border-border/40 mb-8">
              {lines.map(({ item, product }) => {
                const price = effectivePrice(product);
                return (
                  <li key={product.slug} className="flex gap-4 py-5 items-center">
                    <Link
                      to="/shop/$slug"
                      params={{ slug: product.slug }}
                      className="w-20 h-20 bg-background overflow-hidden shrink-0"
                    >
                      <img
                        src={productImage(product)}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">
                        {DEPARTMENT_LABELS[product.department]}
                      </p>
                      <h3 className="font-display font-bold text-lg truncate">{product.title}</h3>
                      <p className="font-mono text-xs text-silver/70">${price}</p>
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
                    <p className="font-mono text-sm w-20 text-right">${price * item.qty}</p>
                    <button
                      onClick={() => remove(product.slug)}
                      aria-label="Remove"
                      className="text-silver/60 hover:text-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                onClick={clear}
                className="font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary"
              >
                Clear cart
              </button>
              <div className="text-right w-full sm:w-auto">
                {/* Free shipping progress */}
                <div className="mb-4">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <div className="flex items-center gap-2 justify-end text-primary">
                      <Gift className="h-4 w-4" />
                      <span className="font-mono text-xs uppercase tracking-widest">
                        Free shipping unlocked!
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
                          ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} more for free shipping
                        </span>
                      </div>
                      <div className="h-1.5 w-full max-w-xs bg-silver/20 rounded-full overflow-hidden ml-auto">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
                  Subtotal
                </p>
                <p className="font-display font-black text-3xl mb-4">${subtotal.toFixed(2)} AUD</p>
                <Link
                  to="/checkout"
                  className="inline-block bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-8 py-3 hover:opacity-90 transition-opacity shadow-glow"
                >
                  Proceed to checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

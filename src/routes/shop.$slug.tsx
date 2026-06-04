import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, Star, Minus, Plus } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ProductBadges } from "@/components/site/ProductBadges";
import { ProductReviews } from "@/components/site/ProductReviews";
import { useProductReviews, averageRating } from "@/lib/reviews";
import {
  useProduct,
  useProducts,
  productGallery,
  productImage,
  effectivePrice,
  isLowStock,
  isOutOfStock,
  DEPARTMENT_LABELS,
  type Product,
} from "@/lib/products";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Liminal Surf & Skate Co` },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: allProducts } = useProducts();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<"inquiry" | "custom">("inquiry");
  const [message, setMessage] = useState("");
  const { has: wishHas, toggle: wishToggle } = useWishlist();
  const { add: cartAdd } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="max-w-3xl mx-auto px-6 py-32 text-center font-mono text-sm text-silver/60">Loading…</main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="max-w-3xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display font-black text-4xl mb-4">Piece not found</h1>
          <Link to="/shop" className="font-mono text-xs uppercase tracking-widest text-primary">
            ← Back to the shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const saved = wishHas(product.slug);
  const gallery = productGallery(product);
  const onSale = product.sale_price !== null && product.sale_price < product.price;
  const oos = isOutOfStock(product);
  const low = !oos && isLowStock(product);
  const price = effectivePrice(product);
  const needsSize = product.sizes && product.sizes.length > 0;

  const related = useMemo(() => recommendRelated(product, allProducts ?? []), [product, allProducts]);
  const { data: reviews } = useProductReviews(product.id);
  const { avg, count } = averageRating(reviews);

  const handleAddToCart = () => {
    if (needsSize && !size) {
      alert("Please choose a size first.");
      return;
    }
    for (let i = 0; i < qty; i++) cartAdd(product.slug);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/70 hover:text-primary mb-10"
        >
          <ArrowLeft className="h-3 w-3" /> Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            <div className="bg-card border border-border/60">
              <div className="aspect-square overflow-hidden">
                <img src={gallery[activeImg]} alt={product.title} className="w-full h-full object-cover" />
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden border-2 transition-colors ${
                      activeImg === i ? "border-primary" : "border-border/60 hover:border-silver"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
              {DEPARTMENT_LABELS[product.department]}{product.product_type ? ` · ${product.product_type}` : ""}
            </p>
            <h1 className="font-display font-black text-4xl lg:text-5xl leading-none mb-4">{product.title}</h1>

            {/* Star ratings (placeholder until reviews shipped) */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`h-4 w-4 ${i <= 4 ? "fill-primary text-primary" : "text-silver/30"}`} />
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-silver/60">4.0 · 12 reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              {onSale ? (
                <>
                  <span className="font-mono text-2xl text-primary">${product.sale_price}</span>
                  <span className="font-mono text-lg text-silver/50 line-through">${product.price}</span>
                </>
              ) : (
                <span className="font-mono text-2xl text-silver">${price}</span>
              )}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-8">
              {oos ? <span className="text-silver/60">Out of stock</span>
                   : low ? <span className="text-amber-300">Only {product.stock_count} left</span>
                         : <span className="text-primary">In stock</span>}
            </p>

            <p className="text-silver/90 leading-relaxed mb-8">{product.description}</p>

            {/* Size selector */}
            {needsSize && (
              <div className="mb-6">
                <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors ${
                        size === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/60 text-silver hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-border/60">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 flex items-center justify-center text-silver hover:text-primary" aria-label="Decrease">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-mono text-sm">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock_count || 99, q + 1))} className="h-10 w-10 flex items-center justify-center text-silver hover:text-primary" aria-label="Increase">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cart + Wishlist actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={oos}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" /> {oos ? "Out of stock" : "Add to cart"}
              </button>
              <button
                onClick={() => wishToggle(product.slug)}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                className={`h-12 w-12 flex items-center justify-center border transition-colors ${
                  saved ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"
                }`}
              >
                <Heart className={`h-5 w-5 ${saved ? "fill-primary" : ""}`} />
              </button>
            </div>

            {/* Details + Specs */}
            {product.details.length > 0 && (
              <ul className="border-y border-border/60 divide-y divide-border/60 mb-6">
                {product.details.map((d) => (
                  <li key={d} className="py-3 font-mono text-xs uppercase tracking-widest text-silver/80">
                    — {d}
                  </li>
                ))}
              </ul>
            )}

            {Object.keys(product.specs).length > 0 && (
              <div className="border border-border/60 bg-card/40 p-5 mb-8">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">Specifications</p>
                <dl className="grid grid-cols-2 gap-y-2 text-xs font-mono">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-silver/60 uppercase tracking-widest">{k.replace(/_/g, " ")}</dt>
                      <dd className="text-silver">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Inquiry / Custom order */}
            <div className="border border-border/60 bg-card p-6">
              <div className="flex gap-2 mb-5">
                {([
                  ["inquiry", "Inquire"],
                  ["custom", "Custom order"],
                ] as const).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setMode(k)}
                    className={`flex-1 font-mono text-[10px] uppercase tracking-widest px-3 py-2 border transition-colors ${
                      mode === k
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 text-silver hover:border-primary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {sent ? (
                <p className="font-mono text-xs uppercase tracking-widest text-primary py-6 text-center">
                  Thanks — we'll be in touch within 48 hours.
                </p>
              ) : (
                <form onSubmit={submit} className="space-y-3">
                  <input
                    required
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                  />
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder={
                      mode === "custom"
                        ? "Tell us about the custom build — dimensions, colours, timeline…"
                        : "Questions about this piece? Stock, sizing, shipping…"
                    }
                    className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity"
                  >
                    {mode === "custom" ? "Send custom request" : "Send inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-border/40 pt-12">
            <h2 className="font-display font-black text-2xl lg:text-3xl mb-6">You might also need</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/shop/$slug"
                  params={{ slug: r.slug }}
                  className="group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden bg-background">
                    <img src={productImage(r)} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">{DEPARTMENT_LABELS[r.department]}</p>
                    <h3 className="font-display font-bold text-base mb-1">{r.title}</h3>
                    <span className="font-mono text-xs text-silver">${effectivePrice(r)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

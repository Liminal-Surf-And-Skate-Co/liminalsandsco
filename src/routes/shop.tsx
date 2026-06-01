import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Heart, Search, SlidersHorizontal, X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Slider } from "@/components/ui/slider";
import {
  useProducts,
  ALL_DEPARTMENTS,
  DEPARTMENT_LABELS,
  SORT_LABELS,
  sortProducts,
  productImage,
  effectivePrice,
  isLowStock,
  isOutOfStock,
  type Department,
  type Product,
  type SortKey,
} from "@/lib/products";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

const PRICE_MIN = 0;
const PRICE_MAX = 2000;

const shopSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(["newest", "oldest", "price-asc", "price-desc"]), "newest").default("newest"),
  dept: fallback(z.enum(["skate", "surf", "clothing", "accessories", "other", "all"]), "all").default("all"),
  type: fallback(z.string(), "").default(""),
  min: fallback(z.number().min(0), PRICE_MIN).default(PRICE_MIN),
  max: fallback(z.number().min(0), PRICE_MAX).default(PRICE_MAX),
});

type ShopSearch = z.infer<typeof shopSearchSchema>;

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(shopSearchSchema),
  head: () => ({
    meta: [
      { title: "Shop — Liminal Surf & Skate Co" },
      { name: "description", content: "Surfboards, skateboards, apparel, footwear, accessories and hand-crafted pieces from Liminal." },
      { property: "og:title", content: "Shop — Liminal Surf & Skate Co" },
      { property: "og:description", content: "Everything we make, in one place." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [open, setOpen] = useState(true);
  const { has: wishHas, toggle: wishToggle } = useWishlist();
  const { add: cartAdd } = useCart();
  const { data: products, isLoading, error } = useProducts();

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }), replace: true });

  const filtered = useMemo(() => {
    let list = (products ?? []).slice();
    if (search.dept !== "all") list = list.filter((p) => p.department === search.dept);
    if (search.type) list = list.filter((p) => (p.product_type ?? "") === search.type);
    if (search.q.trim()) {
      const q = search.q.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.product_type ?? "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
      );
    }
    list = list.filter((p) => {
      const price = effectivePrice(p);
      return price >= search.min && price <= search.max;
    });
    return sortProducts(list, search.sort);
  }, [products, search.q, search.sort, search.min, search.max, search.dept, search.type]);

  const reset = () =>
    navigate({
      search: { q: "", sort: "newest", dept: "all", type: "", min: PRICE_MIN, max: PRICE_MAX },
      replace: true,
    });

  const currentDeptLabel =
    search.dept === "all" ? "Everything we make" : DEPARTMENT_LABELS[search.dept as Department];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              {search.dept === "all" ? "The Shop" : `Shop · ${currentDeptLabel}`}
            </p>
            <h1 className="font-display font-black text-5xl lg:text-7xl leading-none mb-8">
              {currentDeptLabel},<br />in one place.
            </h1>

            {/* Department pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => update({ dept: "all", type: "" })}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                  search.dept === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 text-silver hover:border-primary"
                }`}
              >
                All
              </button>
              {ALL_DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  onClick={() => update({ dept: d, type: "" })}
                  className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                    search.dept === d
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-silver hover:border-primary"
                  }`}
                >
                  {DEPARTMENT_LABELS[d]}
                </button>
              ))}
            </div>

            {/* Hero search */}
            <div className="relative max-w-xl">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-silver/50" />
              <input
                value={search.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search products — wheels, wetsuit, hoodie…"
                className="w-full pl-11 pr-4 py-3 bg-card border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8 items-start">
          <aside className={`${open ? "w-72" : "w-12"} shrink-0 sticky top-20 transition-[width] duration-300 hidden md:block`}>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close filters" : "Open filters"}
                className="h-10 w-10 flex items-center justify-center border border-silver/40 text-silver hover:bg-silver hover:text-background transition-colors"
              >
                {open ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
              </button>
              {open && (
                <button onClick={reset} className="font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary">
                  Reset
                </button>
              )}
            </div>

            {open && (
              <div className="space-y-6 border border-border/60 bg-card p-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70">Price</label>
                    <span className="font-mono text-[10px] text-silver">${search.min} – ${search.max}</span>
                  </div>
                  <Slider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={10}
                    value={[search.min, search.max]}
                    onValueChange={(v) => update({ min: v[0], max: v[1] })}
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">Sort by</label>
                  <div className="grid gap-2">
                    {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => update({ sort: key })}
                        className={`text-left text-xs font-mono uppercase tracking-widest px-3 py-2 border transition-colors ${
                          search.sort === key
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/60 text-silver hover:border-primary"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {search.dept !== "all" && (
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
                      Showing
                    </label>
                    <div className="px-3 py-2 border border-primary/60 text-primary font-mono text-xs uppercase tracking-widest">
                      {DEPARTMENT_LABELS[search.dept as Department]}
                      {search.type && ` · ${search.type}`}
                    </div>
                  </div>
                )}
              </div>
            )}
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-6">
              <p className="font-mono text-xs uppercase tracking-widest text-silver/70">
                {isLoading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
              </p>
            </div>

            {error ? (
              <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70">
                Couldn't load the shop. Try refreshing.
              </div>
            ) : !isLoading && filtered.length === 0 ? (
              <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70">
                Nothing matches those filters.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    saved={wishHas(p.slug)}
                    onWish={() => wishToggle(p.slug)}
                    onCart={() => cartAdd(p.slug)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({
  product,
  saved,
  onWish,
  onCart,
}: {
  product: Product;
  saved: boolean;
  onWish: () => void;
  onCart: () => void;
}) {
  const onSale = product.sale_price !== null && product.sale_price < product.price;
  const oos = isOutOfStock(product);
  const low = !oos && isLowStock(product);
  const isNew = product.tags.includes("new");
  const isLimited = product.tags.includes("limited");

  return (
    <div className="group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden relative">
      {/* Corner badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {oos && <Badge tone="muted">Out of stock</Badge>}
        {!oos && low && <Badge tone="warn">Only {product.stock_count} left</Badge>}
        {onSale && <Badge tone="sale">Sale</Badge>}
        {isNew && !onSale && <Badge tone="accent">New</Badge>}
        {isLimited && <Badge tone="accent">Limited</Badge>}
      </div>
      <button
        onClick={(e) => { e.preventDefault(); onWish(); }}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        className="absolute top-3 right-3 z-10 h-9 w-9 flex items-center justify-center bg-background/80 backdrop-blur border border-border/60 hover:border-primary"
      >
        <Heart className={`h-4 w-4 ${saved ? "fill-primary text-primary" : "text-silver"}`} />
      </button>

      <Link to="/shop/$slug" params={{ slug: product.slug }} className="block">
        <div className="aspect-square overflow-hidden bg-background">
          <img
            src={productImage(product)}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-5 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
              {DEPARTMENT_LABELS[product.department]}{product.product_type ? ` · ${product.product_type}` : ""}
            </p>
            <h3 className="font-display font-bold text-lg">{product.title}</h3>
          </div>
          <div className="text-right">
            {onSale ? (
              <>
                <span className="block text-silver/50 text-xs font-mono line-through">${product.price}</span>
                <span className="block text-primary text-sm font-mono">${product.sale_price}</span>
              </>
            ) : (
              <span className="text-silver text-sm font-mono">${product.price}</span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <button
          onClick={onCart}
          disabled={oos}
          className="w-full font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {oos ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "muted" | "warn" | "sale" | "accent" }) {
  const styles: Record<typeof tone, string> = {
    muted: "bg-silver/20 text-silver border-silver/30",
    warn: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    sale: "bg-primary text-primary-foreground border-primary",
    accent: "bg-primary/15 text-primary border-primary/40",
  } as any;
  return (
    <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-1 border ${styles[tone]}`}>
      {children}
    </span>
  );
}

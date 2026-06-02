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
import {
  COLOURS, GENDERS, SIZES, DECK_SPEC_FIELDS, SURF_SPEC_FIELDS,
} from "@/lib/shop-taxonomy";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

const PRICE_MIN = 0;
const PRICE_MAX = 2000;

// CSV helpers for multi-select search params
const csvSchema = fallback(z.string(), "").default("");
const splitCsv = (s: string) => (s ? s.split(",").filter(Boolean) : []);
const joinCsv = (a: string[]) => a.join(",");

const shopSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(["newest", "oldest", "price-asc", "price-desc"]), "newest").default("newest"),
  dept: fallback(z.enum(["skate", "surf", "clothing", "accessories", "other", "all"]), "all").default("all"),
  type: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
  colour: csvSchema,        // CSV
  gender: csvSchema,        // CSV
  size: csvSchema,          // CSV
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

  const selColours = splitCsv(search.colour);
  const selGenders = splitCsv(search.gender);
  const selSizes = splitCsv(search.size);

  const toggle = (csv: string, value: string) => {
    const set = new Set(splitCsv(csv));
    set.has(value) ? set.delete(value) : set.add(value);
    return joinCsv([...set]);
  };

  const filtered = useMemo(() => {
    let list = (products ?? []).slice();
    if (search.dept !== "all") list = list.filter((p) => p.department === search.dept);
    if (search.type) list = list.filter((p) => (p.product_type ?? "") === search.type);
    if (search.category) {
      const cat = search.category.toLowerCase();
      list = list.filter((p) =>
        p.tags.map((t) => t.toLowerCase()).includes(cat) ||
        (p.target_group ?? "").toLowerCase() === cat,
      );
    }
    if (selColours.length) list = list.filter((p) => p.colour && selColours.includes(p.colour.toLowerCase()));
    if (selGenders.length) list = list.filter((p) => p.target_group && selGenders.includes(p.target_group.toLowerCase()));
    if (selSizes.length) list = list.filter((p) => p.sizes.some((s) => selSizes.includes(s)));
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
  }, [products, search, selColours, selGenders, selSizes]);

  const reset = () =>
    navigate({
      search: { q: "", sort: "newest", dept: "all", type: "", category: "", colour: "", gender: "", size: "", min: PRICE_MIN, max: PRICE_MAX },
      replace: true,
    });

  const currentDeptLabel =
    search.dept === "all" ? "Everything we make" : DEPARTMENT_LABELS[search.dept as Department];

  // Active filter badges
  const badges: { key: string; label: string; clear: () => void }[] = [];
  if (search.dept !== "all") badges.push({ key: "dept", label: DEPARTMENT_LABELS[search.dept as Department], clear: () => update({ dept: "all", type: "", category: "" }) });
  if (search.type) badges.push({ key: "type", label: search.type, clear: () => update({ type: "" }) });
  if (search.category) badges.push({ key: "category", label: search.category, clear: () => update({ category: "" }) });
  selColours.forEach((c) => badges.push({ key: `c-${c}`, label: `Colour: ${c}`, clear: () => update({ colour: toggle(search.colour, c) }) }));
  selGenders.forEach((g) => badges.push({ key: `g-${g}`, label: `Gender: ${g}`, clear: () => update({ gender: toggle(search.gender, g) }) }));
  selSizes.forEach((s) => badges.push({ key: `s-${s}`, label: `Size: ${s}`, clear: () => update({ size: toggle(search.size, s) }) }));
  if (search.min !== PRICE_MIN || search.max !== PRICE_MAX) badges.push({ key: "price", label: `$${search.min}–$${search.max}`, clear: () => update({ min: PRICE_MIN, max: PRICE_MAX }) });
  if (search.q.trim()) badges.push({ key: "q", label: `“${search.q}”`, clear: () => update({ q: "" }) });

  const showDeckSpecs = search.dept === "skate";
  const showSurfSpecs = search.dept === "surf";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="py-16 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              {search.dept === "all" ? "The Shop" : `Shop · ${currentDeptLabel}`}
            </p>
            <h1 className="font-display font-black text-5xl lg:text-7xl leading-none mb-8">
              {currentDeptLabel},<br />in one place.
            </h1>

            {/* Department pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => update({ dept: "all", type: "", category: "" })}
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
                  onClick={() => update({ dept: d, type: "", category: "" })}
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
              {open && badges.length > 0 && (
                <button onClick={reset} className="font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70">
                  Clear all
                </button>
              )}
            </div>

            {open && (
              <div className="space-y-6 border border-border/60 bg-card p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {/* Active filter badges */}
                {badges.length > 0 && (
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">Active filters</label>
                    <div className="flex flex-wrap gap-1.5">
                      {badges.map((b) => (
                        <button
                          key={b.key}
                          onClick={b.clear}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary/15 border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-primary-foreground"
                        >
                          {b.label} <X className="h-2.5 w-2.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <FilterGroup label="Price">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-silver">${search.min} – ${search.max}</span>
                  </div>
                  <Slider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={10}
                    value={[search.min, search.max]}
                    onValueChange={(v) => update({ min: v[0], max: v[1] })}
                  />
                </FilterGroup>

                <FilterGroup label="Sort by">
                  <div className="grid gap-1.5">
                    {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => update({ sort: key })}
                        className={`text-left text-[11px] font-mono uppercase tracking-widest px-2.5 py-1.5 border transition-colors ${
                          search.sort === key
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/60 text-silver hover:border-primary"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup label="Colour">
                  <div className="flex flex-wrap gap-1.5">
                    {COLOURS.map((c) => {
                      const on = selColours.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => update({ colour: toggle(search.colour, c) })}
                          className={`px-2 py-1 font-mono text-[10px] uppercase border ${
                            on ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </FilterGroup>

                <FilterGroup label="Gender">
                  <div className="flex flex-wrap gap-1.5">
                    {GENDERS.map((g) => {
                      const on = selGenders.includes(g);
                      return (
                        <button
                          key={g}
                          onClick={() => update({ gender: toggle(search.gender, g) })}
                          className={`px-2 py-1 font-mono text-[10px] uppercase border ${
                            on ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </FilterGroup>

                <FilterGroup label="Size">
                  <div className="flex flex-wrap gap-1.5">
                    {SIZES.map((s) => {
                      const on = selSizes.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => update({ size: toggle(search.size, s) })}
                          className={`px-2 py-1 font-mono text-[10px] uppercase border ${
                            on ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </FilterGroup>

                {/* Department-aware spec filters via category param */}
                {showDeckSpecs && (
                  <FilterGroup label="Deck specs">
                    <p className="font-mono text-[10px] text-silver/50 mb-2">
                      Filter by spec keyword (matches product spec values).
                    </p>
                    <div className="space-y-1.5">
                      {DECK_SPEC_FIELDS.map((f) => (
                        <button
                          key={f.key}
                          onClick={() => update({ category: search.category === f.key ? "" : f.key })}
                          className={`w-full text-left px-2 py-1 font-mono text-[10px] uppercase border ${
                            search.category === f.key ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </FilterGroup>
                )}

                {showSurfSpecs && (
                  <FilterGroup label="Surf specs">
                    <div className="space-y-1.5">
                      {SURF_SPEC_FIELDS.map((f) => (
                        <button
                          key={f.key}
                          onClick={() => update({ category: search.category === f.key ? "" : f.key })}
                          className={`w-full text-left px-2 py-1 font-mono text-[10px] uppercase border ${
                            search.category === f.key ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </FilterGroup>
                )}
              </div>
            )}
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-6">
              <p className="font-mono text-xs uppercase tracking-widest text-silver/70">
                {isLoading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
              </p>
              {badges.length > 0 && (
                <button onClick={reset} className="md:hidden font-mono text-[10px] uppercase tracking-widest text-primary">
                  Clear all
                </button>
              )}
            </div>

            {/* Mobile active filter badges */}
            {badges.length > 0 && (
              <div className="md:hidden flex flex-wrap gap-1.5 mb-4">
                {badges.map((b) => (
                  <button
                    key={b.key}
                    onClick={b.clear}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/15 border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-widest"
                  >
                    {b.label} <X className="h-2.5 w-2.5" />
                  </button>
                ))}
              </div>
            )}

            {error ? (
              <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70">
                Couldn't load the shop. Try refreshing.
              </div>
            ) : !isLoading && filtered.length === 0 ? (
              <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70">
                Nothing matches those filters.
                {badges.length > 0 && (
                  <div className="mt-3">
                    <button onClick={reset} className="text-primary underline-offset-4 hover:underline">Clear all filters</button>
                  </div>
                )}
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

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">{label}</label>
      {children}
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

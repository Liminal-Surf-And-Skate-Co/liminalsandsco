import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Slider } from "@/components/ui/slider";
import { allProducts, categories, type Category } from "@/lib/products";

const PRICE_MIN = 0;
const PRICE_MAX = Math.max(...allProducts.map((p) => p.price));

const shopSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(["newest", "oldest", "price-asc", "price-desc"]), "newest").default("newest"),
  cats: fallback(z.array(z.string()), []).default([]),
  min: fallback(z.number().min(0), PRICE_MIN).default(PRICE_MIN),
  max: fallback(z.number().min(0), PRICE_MAX).default(PRICE_MAX),
});

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(shopSearchSchema),
  head: () => ({
    meta: [
      { title: "Shop — Liminal Surf & Skate Co" },
      { name: "description", content: "Skateboards, surfboards, merchandise, jewellery, and hand-crafted pieces from Liminal." },
      { property: "og:title", content: "Shop — Liminal Surf & Skate Co" },
      { property: "og:description", content: "Skateboards, surfboards, merchandise, jewellery, and hand-crafted pieces from Liminal." },
    ],
  }),
  component: ShopPage,
});

type SortKey = "newest" | "oldest" | "price-asc" | "price-desc";

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [open, setOpen] = useState(true);

  const activeCats = search.cats.filter((c): c is Category =>
    (categories as string[]).includes(c),
  );

  const update = (patch: Partial<typeof search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const toggleCat = (c: Category) => {
    const next = activeCats.includes(c) ? activeCats.filter((x) => x !== c) : [...activeCats, c];
    update({ cats: next });
  };

  const filtered = useMemo(() => {
    let list = allProducts.slice();
    if (search.q.trim()) {
      const q = search.q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
    }
    if (activeCats.length) list = list.filter((p) => activeCats.includes(p.category));
    list = list.filter((p) => p.price >= search.min && p.price <= search.max);
    list.sort((a, b) => {
      switch (search.sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "oldest": return a.addedAt.localeCompare(b.addedAt);
        case "newest":
        default: return b.addedAt.localeCompare(a.addedAt);
      }
    });
    return list;
  }, [search.q, search.sort, search.min, search.max, activeCats]);

  const grouped = useMemo(() => {
    const map = new Map<Category, typeof allProducts>();
    for (const p of filtered) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return map;
  }, [filtered]);

  const reset = () =>
    navigate({
      search: { q: "", sort: "newest", cats: [], min: PRICE_MIN, max: PRICE_MAX },
      replace: true,
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">The Shop</p>
            <h1 className="font-display font-black text-5xl lg:text-7xl leading-none">
              Everything we make,<br />in one place.
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8 items-start">
          {/* Sidebar */}
          <aside className={`${open ? "w-72" : "w-12"} shrink-0 sticky top-20 transition-[width] duration-300`}>
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
                  <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">Search</label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-silver/50" />
                    <input
                      value={search.q}
                      onChange={(e) => update({ q: e.target.value })}
                      placeholder="Find a product…"
                      className="w-full pl-9 pr-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70">Price</label>
                    <span className="font-mono text-[10px] text-silver">
                      ${search.min} – ${search.max}
                    </span>
                  </div>
                  <Slider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={10}
                    value={[search.min, search.max]}
                    onValueChange={(v) => update({ min: v[0], max: v[1] })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">Sort by</label>
                  <div className="grid gap-2">
                    {([
                      ["newest", "Newest added"],
                      ["oldest", "Oldest added"],
                      ["price-asc", "Price: low → high"],
                      ["price-desc", "Price: high → low"],
                    ] as [SortKey, string][]).map(([key, label]) => (
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

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">Category</label>
                  <div className="grid gap-2">
                    {categories.map((c) => {
                      const on = activeCats.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleCat(c)}
                          className={`text-left text-xs font-mono uppercase tracking-widest px-3 py-2 border transition-colors ${
                            on
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border/60 text-silver hover:border-primary"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-6">
              <p className="font-mono text-xs uppercase tracking-widest text-silver/70">
                {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70">
                Nothing matches those filters.
              </div>
            ) : (
              <div className="space-y-16">
                {Array.from(grouped.entries()).map(([cat, items]) => (
                  <section key={cat}>
                    <h2 className="font-display font-black text-2xl lg:text-3xl mb-6">{cat}</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((p) => (
                        <Link
                          key={p.slug}
                          to="/shop/$slug"
                          params={{ slug: p.slug }}
                          className="group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden"
                        >
                          <div className="aspect-square overflow-hidden bg-background">
                            <img
                              src={p.img}
                              alt={p.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <div className="p-5 flex items-end justify-between">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">{p.tag}</p>
                              <h3 className="font-display font-bold text-lg">{p.title}</h3>
                            </div>
                            <span className="text-silver text-sm font-mono">${p.price}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
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

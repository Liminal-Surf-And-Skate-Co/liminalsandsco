import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import deck from "@/assets/hero-deck.jpg";
import surfboard from "@/assets/craft-surfboard.jpg";
import apparel from "@/assets/apparel.jpg";
import accessories from "@/assets/accessories.jpg";
import workshop from "@/assets/about-workshop.jpg";

export const Route = createFileRoute("/shop")({
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

type Category = "Skate & Surf" | "Merchandise" | "Jewellery" | "Hand Crafted";
type Product = {
  img: string;
  title: string;
  price: number;
  tag: string;
  category: Category;
  addedAt: string; // ISO date
};

const allProducts: Product[] = [
  // Skate & Surf
  { img: deck, title: "Maple Cruisers", price: 180, tag: "Skate", category: "Skate & Surf", addedAt: "2025-02-12" },
  { img: deck, title: "Street Decks", price: 160, tag: "Skate", category: "Skate & Surf", addedAt: "2025-05-04" },
  { img: surfboard, title: "Shaped Shortboards", price: 720, tag: "Surf", category: "Skate & Surf", addedAt: "2024-11-20" },
  { img: surfboard, title: "Longboard Logs", price: 880, tag: "Surf", category: "Skate & Surf", addedAt: "2026-01-08" },
  // Merchandise
  { img: apparel, title: "Heavyweight Hoodies", price: 85, tag: "Hoodies", category: "Merchandise", addedAt: "2025-09-14" },
  { img: apparel, title: "Logo Tees", price: 38, tag: "T-Shirts", category: "Merchandise", addedAt: "2025-07-02" },
  { img: apparel, title: "Workshop Caps", price: 32, tag: "Hats", category: "Merchandise", addedAt: "2026-03-19" },
  { img: accessories, title: "Salt Sunglasses", price: 95, tag: "Sunglasses", category: "Merchandise", addedAt: "2025-12-01" },
  { img: apparel, title: "Canvas Work Pants", price: 110, tag: "Pants", category: "Merchandise", addedAt: "2026-04-10" },
  // Jewellery
  { img: accessories, title: "Resin Wave Pendant", price: 48, tag: "Pendant", category: "Jewellery", addedAt: "2025-08-22" },
  { img: accessories, title: "Brass Surf Ring", price: 62, tag: "Ring", category: "Jewellery", addedAt: "2026-02-14" },
  { img: accessories, title: "Cord Bracelet", price: 28, tag: "Bracelet", category: "Jewellery", addedAt: "2025-06-30" },
  // Hand Crafted
  { img: workshop, title: "Hand-Shaped Fins", price: 140, tag: "One-off", category: "Hand Crafted", addedAt: "2025-10-05" },
  { img: workshop, title: "Inlay Cruiser", price: 320, tag: "Limited", category: "Hand Crafted", addedAt: "2026-05-01" },
  { img: workshop, title: "Carved Wall Piece", price: 540, tag: "Art", category: "Hand Crafted", addedAt: "2024-12-18" },
];

const categories: Category[] = ["Skate & Surf", "Merchandise", "Jewellery", "Hand Crafted"];

type SortKey = "newest" | "oldest" | "price-asc" | "price-desc";

function ShopPage() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [activeCats, setActiveCats] = useState<Category[]>([]);

  const toggleCat = (c: Category) =>
    setActiveCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filtered = useMemo(() => {
    let list = allProducts.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
    }
    if (activeCats.length) list = list.filter((p) => activeCats.includes(p.category));
    list.sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "oldest": return a.addedAt.localeCompare(b.addedAt);
        case "newest":
        default: return b.addedAt.localeCompare(a.addedAt);
      }
    });
    return list;
  }, [query, sort, activeCats]);

  const grouped = useMemo(() => {
    const map = new Map<Category, Product[]>();
    for (const p of filtered) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return map;
  }, [filtered]);

  const reset = () => { setQuery(""); setSort("newest"); setActiveCats([]); };

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
          <aside
            className={`${open ? "w-72" : "w-12"} shrink-0 sticky top-20 transition-[width] duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close filters" : "Open filters"}
                className="h-10 w-10 flex items-center justify-center border border-silver/40 text-silver hover:bg-silver hover:text-background transition-colors"
              >
                {open ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
              </button>
              {open && (
                <button
                  onClick={reset}
                  className="font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary"
                >
                  Reset
                </button>
              )}
            </div>

            {open && (
              <div className="space-y-6 border border-border/60 bg-card p-5">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-silver/50" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Find a product…"
                      className="w-full pl-9 pr-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
                    Sort by
                  </label>
                  <div className="grid gap-2">
                    {([
                      ["newest", "Newest added"],
                      ["oldest", "Oldest added"],
                      ["price-asc", "Price: low → high"],
                      ["price-desc", "Price: high → low"],
                    ] as [SortKey, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSort(key)}
                        className={`text-left text-xs font-mono uppercase tracking-widest px-3 py-2 border transition-colors ${
                          sort === key
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
                  <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
                    Category
                  </label>
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
                        <a
                          key={p.title}
                          href="#newsletter"
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
                              <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                                {p.tag}
                              </p>
                              <h3 className="font-display font-bold text-lg">{p.title}</h3>
                            </div>
                            <span className="text-silver text-sm font-mono">${p.price}</span>
                          </div>
                        </a>
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

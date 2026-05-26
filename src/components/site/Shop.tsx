import { Link } from "@tanstack/react-router";
import { allProducts } from "@/lib/products";

const featuredSlugs = ["maple-cruisers", "shaped-shortboards", "heavyweight-hoodies", "salt-sunglasses"];
const products = featuredSlugs
  .map((s) => allProducts.find((p) => p.slug === s))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

export function Shop() {
  return (
    <section id="shop" className="relative py-32 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              (02) The Drop
            </p>
            <h2 className="font-display font-black text-5xl lg:text-7xl">
              Shop the<br />latest run.
            </h2>
          </div>
          <Link
            to="/shop"
            className="font-mono text-xs uppercase tracking-widest text-silver/70 hover:text-primary border-b border-silver/30 pb-1"
          >
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
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
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                    {p.tag}
                  </p>
                  <h3 className="font-display font-bold text-lg">{p.title}</h3>
                </div>
                <span className="text-silver text-sm font-mono">${p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

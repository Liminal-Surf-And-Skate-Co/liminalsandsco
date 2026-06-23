import { Link } from "@tanstack/react-router";
import { useProducts, productImage, effectivePrice, DEPARTMENT_LABELS } from "@/lib/products";
import { ProductBadges } from "@/components/site/ProductBadges";

export function Shop() {
  const { data: all } = useProducts();
  const products = (all ?? []).filter((p) => p.featured).slice(0, 4);
  const fallback = (all ?? []).slice(0, 4);
  const list = products.length > 0 ? products : fallback;

  return (
    <section id="shop" className="relative py-32 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              (02) The Drop
            </p>
            <h2 className="font-display font-black text-5xl lg:text-7xl">
              Shop the
              <br />
              latest run.
            </h2>
          </div>
          <Link
            to="/shop"
            className="font-mono text-xs uppercase tracking-widest text-silver/70 hover:text-primary border-b border-silver/30 pb-1"
          >
            View all →
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="text-silver/60 font-mono text-xs">
            No products yet — add some in the admin.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((p) => {
              const onSale = p.sale_price !== null && p.sale_price < p.price;
              return (
                <Link
                  key={p.slug}
                  to="/shop/$slug"
                  params={{ slug: p.slug }}
                  className="group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden relative"
                >
                  <ProductBadges product={p} />
                  <div className="aspect-square overflow-hidden bg-background">
                    <img
                      src={productImage(p)}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 flex items-end justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                        {DEPARTMENT_LABELS[p.department]}
                      </p>
                      <h3 className="font-display font-bold text-lg">{p.title}</h3>
                    </div>
                    <div className="text-right">
                      {onSale ? (
                        <>
                          <span className="block text-silver/50 text-xs font-mono line-through">
                            ${p.price}
                          </span>
                          <span className="block text-primary text-sm font-mono">
                            ${effectivePrice(p)}
                          </span>
                        </>
                      ) : (
                        <span className="text-silver text-sm font-mono">${effectivePrice(p)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

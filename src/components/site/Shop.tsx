import { Link } from "@tanstack/react-router";
import { useProducts, productImage, effectivePrice, DEPARTMENT_LABELS } from "@/lib/products";
import { ProductBadges } from "@/components/site/ProductBadges";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

export function Shop() {
  return (
    <ErrorBoundary>
      <ShopInner />
    </ErrorBoundary>
  );
}

function ShopInner() {
  const { data: all, isLoading, error } = useProducts();

  // Fall back to mock catalog if the fetch failed entirely, so the storefront
  // never renders as a dead empty section.
  const source = error ? MOCK_PRODUCTS : (all ?? []);
  const featured = source.filter((p) => p?.featured).slice(0, 4);
  const list = featured.length > 0 ? featured : source.slice(0, 4);

  return (
    <section id="shop" className="relative py-32 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              (02) The Drop
            </p>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-7xl">
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

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border/60 overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="text-silver/60 font-mono text-xs">
            No products yet — add some in the admin.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list?.map((p) => {
              if (!p) return null;
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

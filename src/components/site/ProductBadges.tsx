import { isLowStock, isOutOfStock, type Product } from "@/lib/products";

type Tone = "muted" | "warn" | "sale" | "accent" | "new";

function Badge({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  const styles: Record<Tone, string> = {
    muted: "bg-silver/20 text-silver border-silver/30",
    warn: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    sale: "bg-primary text-primary-foreground border-primary",
    accent: "bg-primary/15 text-primary border-primary/40",
    new: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  };
  return (
    <span
      className={`font-mono text-[9px] uppercase tracking-widest px-2 py-1 border ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

/** Was the product created in the last 14 days? */
function isNewlyAdded(p: Pick<Product, "created_at">) {
  if (!p.created_at) return false;
  const created = new Date(p.created_at).getTime();
  return Date.now() - created < 14 * 24 * 60 * 60 * 1000;
}

export function ProductBadges({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const oos = isOutOfStock(product);
  const low = !oos && isLowStock(product);
  const onSale = product.sale_price !== null && product.sale_price < product.price;
  const pct = onSale
    ? Math.round(((product.price - (product.sale_price ?? 0)) / product.price) * 100)
    : 0;
  const fresh = isNewlyAdded(product) || product.tags?.includes("new");
  const limited = product.tags?.includes("limited");

  return (
    <div className={`absolute top-3 left-3 z-10 flex flex-col gap-1 ${className}`}>
      {oos && <Badge tone="muted">Out of stock</Badge>}
      {low && <Badge tone="warn">Only {product.stock_count} left</Badge>}
      {onSale && <Badge tone="sale">{pct > 0 ? `-${pct}%` : "Sale"}</Badge>}
      {fresh && !onSale && <Badge tone="new">New</Badge>}
      {limited && <Badge tone="accent">Limited</Badge>}
    </div>
  );
}

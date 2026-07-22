import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as isOutOfStock, V as isLowStock } from "./router-BcrAlKxT.mjs";
function Badge({ children, tone }) {
  const styles = {
    muted: "bg-silver/20 text-silver border-silver/30",
    warn: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    sale: "bg-primary text-primary-foreground border-primary",
    accent: "bg-primary/15 text-primary border-primary/40",
    new: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `font-mono text-[9px] uppercase tracking-widest px-2 py-1 border ${styles[tone]}`,
      children
    }
  );
}
function isNewlyAdded(p) {
  if (!p.created_at) return false;
  const created = new Date(p.created_at).getTime();
  return Date.now() - created < 14 * 24 * 60 * 60 * 1e3;
}
function ProductBadges({
  product,
  className = ""
}) {
  const oos = isOutOfStock(product);
  const low = !oos && isLowStock(product);
  const onSale = product.sale_price !== null && product.sale_price < product.price;
  const pct = onSale ? Math.round((product.price - (product.sale_price ?? 0)) / product.price * 100) : 0;
  const fresh = isNewlyAdded(product) || product.tags?.includes("new");
  const limited = product.tags?.includes("limited");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute top-3 left-3 z-10 flex flex-col gap-1 ${className}`, children: [
    oos && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "muted", children: "Out of stock" }),
    low && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "warn", children: [
      "Only ",
      product.stock_count,
      " left"
    ] }),
    onSale && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "sale", children: pct > 0 ? `-${pct}%` : "Sale" }),
    fresh && !onSale && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "new", children: "New" }),
    limited && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "accent", children: "Limited" })
  ] });
}
export {
  ProductBadges as P
};

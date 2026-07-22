import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { l as useCart, u as useProducts, e as effectivePrice, N as Nav, p as productImage, D as DEPARTMENT_LABELS, F as Footer } from "./router-BZBp0UBL.mjs";
import { g as getCustomDesigns } from "./design-studio-DkvfFIKj.mjs";
import "../_libs/sonner.mjs";
import { o as ShoppingCart, X, G as Gift } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-DYwJbDLa.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/date-fns.mjs";
const FREE_SHIPPING_THRESHOLD = 150;
const SUBTYPE_TO_DEPARTMENT = {
  skate: "skate",
  surf: "surf",
  tee: "clothing",
  hoodie: "clothing"
};
const SUBTYPE_LABEL = {
  skate: "Custom Skate Deck",
  surf: "Custom Surfboard",
  tee: "Custom Tee",
  hoodie: "Custom Hoodie"
};
function designToProduct(d) {
  const dept = SUBTYPE_TO_DEPARTMENT[d.subType];
  const title = d.text ? `${SUBTYPE_LABEL[d.subType]} — "${d.text.slice(0, 24)}"` : SUBTYPE_LABEL[d.subType];
  return {
    id: d.id,
    slug: d.slug,
    title,
    department: dept,
    product_type: "custom",
    target_group: "unisex",
    description: d.text || `Custom ${d.subType} from the Design Studio.`,
    details: [],
    price: d.price,
    sale_price: null,
    colour: null,
    sizes: [],
    stock_count: 99,
    images: d.image ? [d.image] : [],
    tags: ["custom"],
    specs: d.specs,
    featured: false,
    created_at: d.createdAt,
    updated_at: d.createdAt
  };
}
function CartPage() {
  const {
    items,
    setQty,
    remove,
    clear
  } = useCart();
  const {
    data: products = [],
    isLoading
  } = useProducts();
  const [designsVersion, setDesignsVersion] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const handler = () => setDesignsVersion((v) => v + 1);
    window.addEventListener("liminal:custom-designs-change", handler);
    return () => window.removeEventListener("liminal:custom-designs-change", handler);
  }, []);
  const bySlug = new Map([...products.map((p) => [p.slug, p]), ...getCustomDesigns().map((d) => [d.slug, designToProduct(d)])]);
  const lines = items.map((i) => ({
    item: i,
    product: bySlug.get(i.slug)
  })).filter((l) => Boolean(l.product));
  const subtotal = lines.reduce((n, l) => n + effectivePrice(l.product) * l.item.qty, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-5xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl lg:text-5xl", children: "Your Cart" })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60", children: "Loading…" }) : lines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-silver/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-lg text-silver", children: "LL" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl mb-2 text-silver", children: "Your cart is completely empty." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-silver/70 mb-6 italic", children: '"Liam is judging you. Go get some gear."' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "inline-block font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground px-6 py-3 hover:opacity-90", children: "Browse the shop" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 border-y border-border/40 mb-8", children: lines.map(({
          item,
          product
        }) => {
          const price = effectivePrice(product);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 py-5 items-center", children: [
            product.slug.startsWith("custom-") ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/design-studio", className: "w-20 h-20 bg-background overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: productImage(product), alt: product.title, className: "w-full h-full object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop/$slug", params: {
              slug: product.slug
            }, className: "w-20 h-20 bg-background overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: productImage(product), alt: product.title, className: "w-full h-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-1", children: DEPARTMENT_LABELS[product.department] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg truncate", children: product.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-silver/70", children: [
                "$",
                price
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(product.slug, item.qty - 1), className: "h-8 w-8 border border-border/60 font-mono text-silver hover:border-primary", "aria-label": "Decrease quantity", children: "−" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm w-6 text-center", children: item.qty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(product.slug, item.qty + 1), className: "h-8 w-8 border border-border/60 font-mono text-silver hover:border-primary", "aria-label": "Increase quantity", children: "+" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm w-20 text-right", children: [
              "$",
              price * item.qty
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(product.slug), "aria-label": "Remove", className: "text-silver/60 hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] }, product.slug);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clear, className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary", children: "Clear cart" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: subtotal >= FREE_SHIPPING_THRESHOLD ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-widest", children: "Free shipping unlocked!" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: [
                "$",
                (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0),
                " more for free shipping"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full max-w-xs bg-silver/20 rounded-full overflow-hidden ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all", style: {
                width: `${Math.min(100, subtotal / FREE_SHIPPING_THRESHOLD * 100)}%`
              } }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-black text-3xl mb-4", children: [
              "$",
              subtotal.toFixed(2),
              " AUD"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/checkout", className: "inline-block bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-8 py-3 hover:opacity-90 transition-opacity shadow-glow", children: "Proceed to checkout" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  CartPage as component
};

import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { m as useWishlist, l as useCart, u as useProducts, N as Nav, p as productImage, D as DEPARTMENT_LABELS, e as effectivePrice, F as Footer } from "./router-BcrAlKxT.mjs";
import "../_libs/sonner.mjs";
import { H as Heart, X } from "../_libs/lucide-react.mjs";
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
function WishlistPage() {
  const {
    slugs,
    remove
  } = useWishlist();
  const {
    add
  } = useCart();
  const {
    data: products = [],
    isLoading
  } = useProducts();
  const items = products.filter((p) => slugs.includes(p.slug));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl lg:text-5xl", children: "Your Wishlist" })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60", children: "Loading…" }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-silver/70 mb-6", children: "No saved pieces yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "font-mono text-xs uppercase tracking-widest text-primary hover:underline", children: "Browse the shop →" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-card border border-border/60 overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(p.slug), "aria-label": "Remove from wishlist", className: "absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center bg-background/80 backdrop-blur border border-border/60 text-silver hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop/$slug", params: {
          slug: p.slug
        }, className: "block aspect-square overflow-hidden bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: productImage(p), alt: p.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: DEPARTMENT_LABELS[p.department] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-3", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-silver text-sm font-mono", children: [
              "$",
              effectivePrice(p)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => add(p.slug), className: "font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors", children: "Add to cart" })
          ] })
        ] })
      ] }, p.slug)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  WishlistPage as component
};

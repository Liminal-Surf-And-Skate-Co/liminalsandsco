import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { R as Route$d, n as useGlobalSearch, N as Nav, G as GlobalSearch, p as productImage, D as DEPARTMENT_LABELS, o as highlightText, e as effectivePrice, F as Footer } from "./router-BcrAlKxT.mjs";
import "../_libs/sonner.mjs";
import { u as Search, P as Package, F as FileText, s as Mail, e as Calendar } from "../_libs/lucide-react.mjs";
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
function safeHtml(html) {
  return {
    __html: html
  };
}
function SearchPage() {
  const {
    q
  } = Route$d.useSearch();
  const res = useGlobalSearch(q, 50);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border/40 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "Search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl lg:text-6xl leading-none mb-6", children: q ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Results for",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-stroke", children: [
            "“",
            q,
            "”"
          ] })
        ] }) : "Search Liminal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalSearch, {}) }),
        q && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-mono text-[11px] uppercase tracking-widest text-silver/60", children: res.loading && res.total === 0 ? "Searching…" : `${res.total} result${res.total === 1 ? "" : "s"} across the site` })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-6 py-12 space-y-14", children: [
        !q && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70 flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-primary" }),
          "Type above to search products, articles, newsletters and events."
        ] }),
        q && res.total === 0 && !res.loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-silver/40 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-silver/70 mb-1", children: [
            "Nothing matched ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
              "“",
              q,
              "”"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/50 mb-6", children: "Try a different keyword or browse these categories." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Shop All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", search: {
              dept: "skate"
            }, className: "px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Skate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", search: {
              dept: "surf"
            }, className: "px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Surf" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", search: {
              dept: "clothing"
            }, className: "px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Clothing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", search: {
              dept: "accessories"
            }, className: "px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Accessories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Blog" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/community", className: "px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Community" })
          ] })
        ] }),
        res.products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { title: "Products Found", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-primary" }), count: res.products.length, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: res.products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop/$slug", params: {
          slug: p.slug
        }, className: "group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: productImage(p), alt: p.title, loading: "lazy", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-end justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-1", children: DEPARTMENT_LABELS[p.department] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base", dangerouslySetInnerHTML: safeHtml(highlightText(p.title, q)) }),
              q && matchDescription(p.description, q) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 mt-1 line-clamp-2", dangerouslySetInnerHTML: safeHtml(highlightText(p.description, q)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-silver text-sm font-mono", children: [
              "$",
              effectivePrice(p)
            ] })
          ] })
        ] }, p.id)) }) }),
        res.posts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { title: "Articles Found", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-primary" }), count: res.posts.length, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 border-y border-border/40", children: res.posts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
          slug: p.slug
        }, className: "grid md:grid-cols-12 gap-4 py-6 hover:bg-primary/5 px-2 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2 font-mono text-[10px] uppercase tracking-widest text-silver/50", children: new Date(p.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-1", children: p.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-2xl text-silver group-hover:text-primary transition-colors", dangerouslySetInnerHTML: safeHtml(highlightText(p.title, q)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 text-sm mt-1", dangerouslySetInnerHTML: safeHtml(highlightText(p.excerpt, q)) })
          ] })
        ] }) }, p.slug)) }) }),
        res.newsletters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { title: "Weekly Letters Found", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-primary" }), count: res.newsletters.length, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: res.newsletters.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
          slug: `newsletter-${n.id}`
        }, className: "group block bg-card border border-border/60 hover:border-primary p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: [
            "Newsletter ·",
            " ",
            new Date(n.scheduled_for ?? n.sent_at).toLocaleDateString("en-AU", {
              month: "short",
              day: "2-digit",
              year: "numeric"
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg leading-tight group-hover:text-primary mb-2", dangerouslySetInnerHTML: safeHtml(highlightText(n.subject, q)) }),
          n.excerpt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 line-clamp-3", dangerouslySetInnerHTML: safeHtml(highlightText(n.excerpt, q)) })
        ] }, n.id)) }) }),
        res.events.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { title: "Events Found", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary" }), count: res.events.length, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 border-y border-border/40", children: res.events.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "grid md:grid-cols-12 gap-4 py-6 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2 font-mono text-xs uppercase tracking-widest text-silver/60", children: e.date }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl text-silver mb-1", dangerouslySetInnerHTML: safeHtml(highlightText(e.title, q)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 text-sm", dangerouslySetInnerHTML: safeHtml(highlightText(e.detail, q)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3 md:text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/community", hash: "events", className: "font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70", children: "View in Community →" }) })
        ] }, e.id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function matchDescription(text, term) {
  return text.toLowerCase().includes(term.toLowerCase());
}
function Group({
  title,
  icon,
  count,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-2xl lg:text-3xl flex items-center gap-3", children: [
        icon,
        " ",
        title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: [
        count,
        " found"
      ] })
    ] }),
    children
  ] });
}
export {
  SearchPage as component
};

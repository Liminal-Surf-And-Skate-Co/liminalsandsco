import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useNewsletters, k as posts, N as Nav, F as Footer } from "./router-BZBp0UBL.mjs";
import "../_libs/sonner.mjs";
import { u as Search, s as Mail, a0 as ArrowRight, w as Play } from "../_libs/lucide-react.mjs";
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
const media = [{
  title: "Daily Swell — Tues 6:14am",
  kind: "Spot Check",
  duration: "1:42"
}, {
  title: "North Point — Dawn Patrol Log",
  kind: "Surf Vlog",
  duration: "8:21"
}, {
  title: "Riverside Bowls Session",
  kind: "Skate Edit",
  duration: "3:55"
}, {
  title: "Workshop B-Roll: Glassing Day",
  kind: "Photography",
  duration: "—"
}, {
  title: "Sunrise Long-Board Cruise",
  kind: "Surf Vlog",
  duration: "5:10"
}, {
  title: "Local Skatepark Tour",
  kind: "Skate Edit",
  duration: "6:38"
}];
function BlogIndex() {
  const [q, setQ] = reactExports.useState("");
  const {
    data: newsletters
  } = useNewsletters();
  const filtered = reactExports.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((p) => p.title.toLowerCase().includes(term) || p.excerpt.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
  }, [q]);
  const filteredMedia = reactExports.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return media;
    return media.filter((m) => m.title.toLowerCase().includes(term) || m.kind.toLowerCase().includes(term));
  }, [q]);
  const filteredNewsletters = reactExports.useMemo(() => {
    const list = newsletters ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((n) => n.subject.toLowerCase().includes(term) || (n.excerpt ?? "").toLowerCase().includes(term));
  }, [newsletters, q]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "grain", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-5xl mx-auto px-6 pt-24 pb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6", children: "Blog · Dispatches · Weekly Letters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-5xl lg:text-8xl leading-[0.85] tracking-tighter mb-6", children: [
          "FIELD",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stroke", children: "NOTES" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 text-lg max-w-2xl mb-8", children: "Stories from the bench, the break, and the in-between. New weekly letter every Friday." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-silver/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search articles, newsletters, videos…", className: "w-full pl-11 pr-4 py-3 bg-card border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-5xl mx-auto px-6 pb-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-2xl lg:text-3xl flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-6 w-6 text-primary" }),
            " News & Weekly Letters"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: "Sent every Friday" })
        ] }),
        filteredNewsletters.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70", children: newsletters === void 0 ? "Loading…" : q ? `No issues match "${q}".` : "No issues published yet — first letter drops Friday." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredNewsletters.map((n) => {
          const d = new Date(n.scheduled_for ?? n.sent_at);
          const weekday = d.toLocaleDateString("en-AU", {
            weekday: "short"
          });
          const dateLabel = d.toLocaleDateString("en-AU", {
            month: "short",
            day: "2-digit",
            year: "numeric"
          });
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
            slug: `newsletter-${n.id}`
          }, className: "group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/10] bg-background overflow-hidden", children: n.cover_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: n.cover_image, alt: n.subject, loading: "lazy", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-10 w-10 text-silver/40" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-1", children: [
                "Newsletter · ",
                weekday,
                " · ",
                dateLabel
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors", children: n.subject }),
              n.excerpt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 line-clamp-2 mb-3", children: n.excerpt }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-silver/70 group-hover:text-primary", children: [
                "Read issue ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
              ] })
            ] })
          ] }, n.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-5xl mx-auto px-6 pb-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl lg:text-3xl mb-6", children: "Articles" }),
        filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70", children: [
          'No posts match "',
          q,
          '".'
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 border-y border-border/40", children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
          slug: p.slug
        }, className: "group grid md:grid-cols-12 gap-6 py-10 items-baseline hover:bg-primary/5 transition-colors px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2 font-mono text-[10px] uppercase tracking-widest text-silver/50", children: new Date(p.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: p.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-3xl md:text-4xl tracking-tight text-silver group-hover:text-primary transition-colors mb-2", children: p.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 max-w-xl", children: p.excerpt })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 font-mono text-[10px] uppercase tracking-widest text-silver/50 md:text-right", children: [
            p.readTime,
            " →"
          ] })
        ] }) }, p.slug)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-5xl mx-auto px-6 pb-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl lg:text-3xl", children: "Daily Swell · Log · Videos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: "Edits & spot checks" })
        ] }),
        filteredMedia.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70", children: [
          'No clips match "',
          q,
          '".'
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredMedia.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 overflow-hidden group cursor-pointer hover:border-primary transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-background flex items-center justify-center relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-10 w-10 text-silver/70 group-hover:text-primary transition-colors relative" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-2 right-2 font-mono text-[10px] text-silver bg-background/80 px-2 py-0.5", children: m.duration })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-1", children: m.kind }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base", children: m.title })
          ] })
        ] }, m.title)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  BlogIndex as component
};

import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { K as Route$4, L as getPost, N as Nav, F as Footer, n as posts } from "./router-BkwgZ6Uu.mjs";
import { s as supabase } from "./client-DYwJbDLa.mjs";
import "../_libs/sonner.mjs";
import { s as Mail, E as ExternalLink } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const NL_PREFIX = "newsletter-";
function SlugPage() {
  const {
    slug
  } = Route$4.useParams();
  if (slug.startsWith(NL_PREFIX)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(NewsletterPage, { id: slug.slice(NL_PREFIX.length) });
  }
  const post = getPost(slug);
  if (!post) throw notFound();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PostPage, { post });
}
function PostPage({
  post
}) {
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "grain", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "max-w-3xl mx-auto px-6 pt-24 pb-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-10 inline-block", children: "← Journal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-4", children: [
          post.category,
          " ·",
          " ",
          new Date(post.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          }),
          " ",
          "· ",
          post.readTime
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl md:text-6xl leading-[0.9] tracking-tighter mb-8", children: post.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-silver/80 mb-12 leading-relaxed border-l-2 border-primary pl-5", children: post.excerpt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 text-silver/80 text-lg leading-relaxed", children: post.body.map((para, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: para }, i)) })
      ] }),
      others.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-5xl mx-auto px-6 pb-32 border-t border-border/40 pt-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-8", children: "Keep reading" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-8", children: others.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
          slug: p.slug
        }, className: "group block border border-border/40 p-6 hover:border-primary transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-3", children: p.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-2xl text-silver group-hover:text-primary transition-colors mb-2", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/60 text-sm", children: p.excerpt })
        ] }, p.slug)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function NewsletterPage({
  id
}) {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["newsletter", id],
    queryFn: async () => {
      const {
        data: data2,
        error: error2
      } = await supabase.from("newsletters").select("*").eq("id", id).maybeSingle();
      if (error2) throw error2;
      return data2;
    }
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "py-32 text-center font-mono text-xs text-silver/60", children: "Loading issue…" })
  ] });
  if (error || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-3xl mx-auto px-6 py-32 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl mb-4", children: "Issue not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "text-primary font-mono text-xs uppercase tracking-widest", children: "← Back to newsletters" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] });
  }
  const d = new Date(data.scheduled_for ?? data.sent_at);
  const links = Array.isArray(data.links) ? data.links : [];
  const paragraphs = (data.body ?? "").split(/\n\s*\n/);
  const isImage = (s) => /^https?:\/\/\S+\.(png|jpe?g|gif|webp|avif)(\?\S*)?$/i.test(s.trim());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "grain", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "max-w-3xl mx-auto px-6 pt-24 pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-10 inline-block", children: "← Journal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-4 inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
        " Weekly Letter ·",
        " ",
        d.toLocaleDateString("en-AU", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl md:text-6xl leading-[0.9] tracking-tighter mb-8", children: data.subject }),
      data.cover_image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: data.cover_image, alt: data.subject, className: "w-full mb-10 border border-border/40" }),
      data.excerpt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-silver/80 mb-12 leading-relaxed border-l-2 border-primary pl-5", children: data.excerpt }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 text-silver/80 text-lg leading-relaxed", children: paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (!trimmed) return null;
        if (isImage(trimmed)) {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: trimmed, alt: "", className: "w-full border border-border/40" }, i);
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap", children: trimmed }, i);
      }) }),
      links.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 pt-8 border-t border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-3", children: "Links" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: links.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: l.url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 text-silver hover:text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
          " ",
          l.label || l.url
        ] }) }, i)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  SlugPage as component
};

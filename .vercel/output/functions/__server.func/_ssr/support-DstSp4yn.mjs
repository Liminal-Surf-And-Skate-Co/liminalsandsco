import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { N as Nav, F as Footer } from "./router-BZBp0UBL.mjs";
import "../_libs/sonner.mjs";
import { u as Search, ap as Ruler, v as Truck, W as Waves, s as Mail, M as MessageCircle, C as Clock } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
const DISCORD_URL = "https://discord.gg/your-invite-here";
const SUPPORT_EMAIL = "support@liminal.co";
const faqs = [{
  group: "Orders",
  q: "How long does shipping take for oversized items like surfboards?",
  a: "Surfboards ship via freight and typically take 7–14 business days domestic, 3–5 weeks international. We email tracking and freight contact details the day it leaves the bench."
}, {
  group: "Orders",
  q: "Do you offer international shipping or local shop / curbside pickup?",
  a: "Yes — we ship worldwide. Locals can choose Workshop Pickup at checkout (free) and grab orders from the shop Wed–Sat, 11am–5pm."
}, {
  group: "Orders",
  q: "How do I change or cancel my order after it's been placed?",
  a: "Email support within 12 hours of ordering and we'll do our best. Once a custom build is started or grip tape is applied, changes aren't possible."
}, {
  group: "Surf",
  q: "How do I choose the right wetsuit thickness for my water temperature?",
  a: "Rough guide: 22°C+ springsuit, 18–22°C 2/2mm, 14–18°C 3/2mm, 10–14°C 4/3mm with boots, sub-10°C 5/4mm + boots, gloves and hood."
}, {
  group: "Surf",
  q: "What's your warranty policy on surfboards and snapped fins?",
  a: "Manufacturer defects (delam, dry spots, broken stringers from glassing) covered 90 days. Snapped fins from impact aren't covered, but we'll always quote a repair."
}, {
  group: "Surf",
  q: "How should I rinse and store my wetsuit so it lasts?",
  a: "Fresh-water rinse inside and out after every session, hang folded at the waist on a wide hanger out of direct sun. Never tumble dry or leave it wet in the boot."
}, {
  group: "Skate",
  q: "Do completes come fully assembled, or do I need tools?",
  a: "Completes ship fully built, gripped, and ready to roll. We include a skate tool with every complete in case you want to swap hardware later."
}, {
  group: "Skate",
  q: "What size skateboard deck fits my shoe size or riding style?",
  a: 'Street/tech under 8.25", all-rounder 8.25–8.5", transition/cruising 8.5–9.0". Bigger feet (US 11+) generally want 8.5" or wider for stability.'
}, {
  group: "Skate",
  q: "What's your return policy on gripped or skated decks?",
  a: "Decks can be returned within 14 days only if the grip tape has NOT been applied and the deck is unridden. Once gripped or skated, all sales are final — industry-wide rule."
}];
function SupportPage() {
  const [query, setQuery] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.group.toLowerCase().includes(q));
  }, [query]);
  const grouped = reactExports.useMemo(() => {
    const out = {
      Orders: [],
      Surf: [],
      Skate: []
    };
    filtered.forEach((f) => out[f.group].push(f));
    return out;
  }, [filtered]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border/40 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "Help Center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-5xl lg:text-7xl leading-none mb-6", children: [
          "How can we",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stroke", children: "help?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 text-lg mb-8", children: "Search size charts, shipping, returns, wetsuit care, skate gear — or hit us up directly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5 text-silver/60 absolute left-4 top-1/2 -translate-y-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: 'Try "wetsuit return" or "truck size"…', className: "w-full bg-input/60 border border-border pl-12 pr-4 py-4 font-mono text-sm focus:outline-none focus:border-primary" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-5", children: [{
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Ruler, { className: "h-5 w-5 text-primary" }),
        title: "Size Charts",
        body: "Deck widths, wetsuit thickness, apparel fit guides."
      }, {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-primary" }),
        title: "Shipping Info",
        body: "Rates, transit times, freight on oversized boards."
      }, {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Waves, { className: "h-5 w-5 text-primary" }),
        title: "Returns & Care",
        body: "Return windows, wetsuit care, warranty terms."
      }].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3", children: c.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl mb-2", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 text-sm", children: c.body })
      ] }, c.title)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-6 space-y-14", children: [
        ["Orders", "Surf", "Skate"].map((g) => {
          const items = grouped[g];
          if (!items.length) return null;
          const label = g === "Orders" ? "📦 Orders & Shipping" : g === "Surf" ? "🏄‍♂️ Surf & Wetsuit Care" : "🛹 Skate Gear & Assembly";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl mb-6", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 border-y border-border/40", children: items.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "cursor-pointer list-none flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-silver", children: f.q }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-primary text-xl group-open:rotate-45 transition-transform", children: "+" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-silver/80 leading-relaxed", children: f.a })
            ] }) }, f.q)) })
          ] }, g);
        }),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-silver/60 font-mono text-sm", children: "No results. Try a different keyword, or reach out below." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "Reach Us" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-4xl lg:text-5xl leading-none mb-6", children: "Still stuck? Hit us up." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-primary mt-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${SUPPORT_EMAIL}`, className: "text-silver/80 hover:text-primary", children: SUPPORT_EMAIL }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-1", children: "We usually reply within 24 hours" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5 text-primary mt-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg", children: "Discord — Live Support" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: DISCORD_URL, target: "_blank", rel: "noreferrer noopener", className: "text-silver/80 hover:text-primary", children: "Open the #support channel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-1", children: "Crew online most evenings" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary mt-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg", children: "Shop Hours" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80", children: "Wed – Sat · 11am – 5pm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80", children: "Sun · 10am – 2pm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-1", children: "Closed Mon & Tue" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          alert("Thanks — we'll get back to you within 24 hours.");
        }, className: "bg-card/60 border border-border p-8 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-2xl mb-2", children: "Send a message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-4", children: "We usually reply within 24 hours" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", name: "name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", name: "email", type: "email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Order # (optional)", name: "order", required: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2", children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 5, required: true, className: "w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary resize-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full bg-gradient-purple text-primary-foreground py-4 font-mono text-xs uppercase tracking-widest shadow-glow hover:translate-y-[-2px] transition-transform", children: "Send Message" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-6 space-y-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Policy, { id: "privacy", title: "Privacy Policy", body: "We collect only what we need to fulfil your order (name, email, shipping address, payment info handled by our processor). We never sell or share your data. Cookies are used for cart persistence and basic analytics — you can opt out in your browser." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Policy, { id: "terms", title: "Terms of Service", body: "By using this site or buying from us, you agree to our terms: products are described as accurately as possible, custom items are non-refundable once started, and prices are subject to change. Disputes are governed by the laws of our home jurisdiction." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Policy, { id: "refund", title: "Refund Policy", body: "Unused, unridden, and ungripped items: 14-day refund or exchange. Custom builds, gripped decks, glassed surfboards, worn apparel, and pierced jewellery are final sale. Defects covered by 90-day warranty — email photos for a quick resolution." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Field({
  label,
  name,
  type = "text",
  required = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, type, required, className: "w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary" })
  ] });
}
function Policy({
  id,
  title,
  body
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id, className: "scroll-mt-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl mb-4", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: body })
  ] });
}
export {
  SupportPage as component
};

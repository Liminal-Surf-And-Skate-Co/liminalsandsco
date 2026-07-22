import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { N as Nav, d as deck, s as surfboard, F as Footer } from "./router-BZBp0UBL.mjs";
import { A as About, w as workshop } from "./About-BQuJuJUb.mjs";
import "../_libs/sonner.mjs";
import { k as Wrench, U as Users, x as Leaf, H as Heart } from "../_libs/lucide-react.mjs";
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
const crew = [{
  name: "Sam Ortega",
  role: "Founder · Shaper",
  img: workshop,
  spot: "North Point reef",
  board: `6'2" round-tail`
}, {
  name: "Jules Park",
  role: "Glassing · Repairs",
  img: workshop,
  spot: "Riverside bowls",
  board: 'Custom 8.25" street'
}, {
  name: "Mika Tan",
  role: "Graphics · Studio",
  img: workshop,
  spot: "Harbour wall longboard",
  board: `9'4" log`
}];
const team = [{
  name: "Theo K.",
  stance: "Goofy",
  town: "Westside",
  img: deck,
  ride: 'Street Decks 8.25"'
}, {
  name: "Maya R.",
  stance: "Regular",
  town: "North Point",
  img: surfboard,
  ride: `Shaped Shortboard 5'10"`
}, {
  name: "Leo F.",
  stance: "Regular",
  town: "Downtown",
  img: deck,
  ride: "Maple Cruiser"
}, {
  name: "Ana D.",
  stance: "Goofy",
  town: "Coastal Vil.",
  img: surfboard,
  ride: `Longboard Log 9'2"`
}];
function AboutPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(About, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 border-t border-border/40 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6", children: "01 · The Origin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-4xl lg:text-6xl leading-none mb-10", children: [
          "It started in a",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stroke", children: "garage." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 text-silver/85 text-lg leading-relaxed max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "One winter, two friends, a borrowed planer and a stack of seconds blanks no one else wanted. We were tired of paying $900 for a board that snapped on its third session — and tired of decks that felt mass-pressed and dead under our feet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "So we started shaping our own. Bad ones, then okay ones, then ones our friends asked for. Liminal grew out of that — a workshop making honest, durable gear that survives heavy street sessions and saltwater abuse, without costing a fortune." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm uppercase tracking-widest text-primary pt-4 border-t border-border/40", children: "Mission: keep the soul, lose the markup." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "02 · The Crew" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-4xl lg:text-5xl leading-none", children: "Who's at the bench." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-6 w-6 text-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: crew.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/5] overflow-hidden bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.img, alt: c.name, className: "w-full h-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl mb-1", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-3", children: c.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-silver/80", children: [
              "Local spot: ",
              c.spot
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-silver/80", children: [
              "Daily ride: ",
              c.board
            ] })
          ] })
        ] }, c.name)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 border-t border-border/40 bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "03 · The Team" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-4xl lg:text-5xl leading-none", children: "Riders we back." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 max-w-2xl mb-10", children: "The people who put our boards through their paces. Local crew, real footage, no marketing copy." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: team.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.img, alt: r.name, className: "w-full h-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-1", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: [
              r.stance,
              " · ",
              r.town
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-silver/80", children: [
              "Ride: ",
              r.ride
            ] })
          ] })
        ] }, r.name)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "04 · What we stand for" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-4xl lg:text-5xl leading-none mb-12", children: "Beliefs, not slogans." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-7", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "h-6 w-6 text-primary mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-2xl mb-3", children: "Sustainability" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "Recycled cotton blends. Plastic-free shipping. Salvaged blanks where we can. We don't have it perfect — we have it in progress. We run beach cleanups every season and donate a cut of every Hand Crafted piece to local ocean conservation." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-7", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-6 w-6 text-primary mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-2xl mb-3", children: "Inclusivity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "Skate and surf are for everyone. Every age, every body, every background, every skill level. If you've never stepped on a board before, come by the shop — we'll point you at the right setup and the right spot." })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  AboutPage as component
};

import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const workshop = "/assets/about-workshop-DKuA_Tw7.jpg";
function About() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "about", className: "relative py-32 grain", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-6 bg-primary/15 blur-3xl rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: workshop,
          alt: "A craftsperson hand-shaping a skate deck in the Liminal workshop",
          width: 1280,
          height: 1280,
          className: "relative w-full h-auto shadow-card"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6", children: "About · The Workshop" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-5xl lg:text-7xl leading-[0.9] tracking-tighter mb-8", children: [
        "ONE BENCH.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stroke", children: "TWO WORLDS." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 text-silver/80 text-lg leading-relaxed max-w-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Liminal started where most days end — between the last set and the first push down an empty street. We make boards for the in-between people: surfers who skate, skaters who paddle out, anyone who lives in the gap." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: 'Every deck and blank is shaped by hand on a single bench. No CNC. No outsourced glassing. Just slow work, salvaged blanks, and a "oh yeah, not bad" when it finally rolls right.' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border/40 pt-8 max-w-xl", children: [
        ["7-day", "Shape & cure"],
        ["100%", "Hand-finished"],
        ["1 of 1", "Custom graphics"],
        ["∞", "Soul per board"]
      ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-display text-3xl text-primary", children: k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 mt-1", children: v })
      ] }, v)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid grid-cols-3 gap-6 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { k: "2026", v: "Founded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { k: "100%", v: "Hand-made" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { k: "1", v: "Bench" })
      ] })
    ] })
  ] }) });
}
function Stat({ k, v }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-primary/40 pt-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl text-silver", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-1", children: v })
  ] });
}
export {
  About as A,
  workshop as w
};

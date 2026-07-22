import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { l as useCart, N as Nav, F as Footer } from "./router-BcrAlKxT.mjs";
import { d as defaultDesignState, c as calculatePrice, p as priceBreakdown, H as HARDWARE_VIEWS, A as APPAREL_VIEWS, S as SKATE_SPECS, a as SURF_SPECS, B as BASE_COLORS, P as PRICE_MODIFIERS, b as PRESETS, s as saveCustomDesign } from "./design-studio-CQ2WUHfV.mjs";
import { a3 as Palette, z as Settings, d as Plus, a4 as Type, h as Upload, a5 as Image, b as Sparkles, a6 as Eye, o as ShoppingCart, a7 as RotateCw, a8 as Trash2, m as ChevronDown } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
function DesignStudioPage() {
  const [state, setState] = reactExports.useState(defaultDesignState());
  const [textDraft, setTextDraft] = reactExports.useState("");
  const [presetPanel, setPresetPanel] = reactExports.useState(null);
  const fileRef = reactExports.useRef(null);
  const {
    add: cartAdd
  } = useCart();
  const price = reactExports.useMemo(() => calculatePrice(state), [state]);
  const breakdown = reactExports.useMemo(() => priceBreakdown(state), [state]);
  const update = (key, value) => setState((s) => ({
    ...s,
    [key]: value
  }));
  const setCategory = (category) => {
    const subType = category === "hardware" ? state.subType === "surf" ? "surf" : "skate" : state.subType === "hoodie" ? "hoodie" : "tee";
    const view = category === "hardware" ? "top" : "front";
    setState((s) => ({
      ...s,
      category,
      subType,
      view,
      specs: {}
    }));
  };
  const setSubType = (subType) => {
    setState((s) => ({
      ...s,
      subType,
      specs: {},
      layers: []
    }));
  };
  const setView = (view) => update("view", view);
  const viewLayers = state.layers.filter((l) => l.view === state.view);
  const addTextLayer = () => {
    const value = textDraft.trim();
    if (!value) return;
    const layer = {
      id: `txt-${Date.now()}`,
      type: "text",
      value,
      view: state.view
    };
    update("layers", [...state.layers, layer]);
    setTextDraft("");
  };
  const addImageLayer = (dataUrl) => {
    const layer = {
      id: `img-${Date.now()}`,
      type: "image",
      value: dataUrl,
      view: state.view
    };
    update("layers", [...state.layers, layer]);
  };
  const addPresetLayer = (presetId) => {
    const layer = {
      id: `pre-${Date.now()}`,
      type: "preset",
      value: presetId,
      view: state.view
    };
    update("layers", [...state.layers, layer]);
    setPresetPanel(presetId);
  };
  const removeLayer = (id) => update("layers", state.layers.filter((l) => l.id !== id));
  const onFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        addImageLayer(reader.result);
        toast.success("Image added to current view");
      }
    };
    reader.readAsDataURL(file);
  };
  const setSpec = (key, value) => update("specs", {
    ...state.specs,
    [key]: value
  });
  const pushToCart = () => {
    const slug = `custom-${state.subType}-${Date.now()}`;
    const saved = {
      id: slug,
      slug,
      subType: state.subType,
      price,
      baseColor: state.baseColor,
      text: state.layers.find((l) => l.type === "text")?.value ?? "",
      image: state.layers.find((l) => l.type === "image")?.value ?? null,
      preset: state.layers.find((l) => l.type === "preset")?.value ?? null,
      specs: state.specs,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    saveCustomDesign(saved);
    cartAdd(slug);
    toast.success(`Custom ${state.subType} added to cart — $${price.toFixed(2)}`);
  };
  const reset = () => {
    setState(defaultDesignState());
    setTextDraft("");
    setPresetPanel(null);
  };
  const views = state.category === "hardware" ? HARDWARE_VIEWS : APPAREL_VIEWS;
  const specsList = state.subType === "skate" ? SKATE_SPECS : state.subType === "surf" ? SURF_SPECS : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border/40 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3", children: "Studio · Make it yours" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl lg:text-6xl leading-none mb-3", children: "DESIGN STUDIO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 max-w-2xl text-sm", children: "Build a custom deck, surfboard, tee or hoodie. Flip between views, stack layers, lock your specs — price updates live as you go." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/40 bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2", children: [
        [{
          key: "hardware",
          label: "Hardware (Skate/Surf)"
        }, {
          key: "apparel",
          label: "Apparel (Hoodie/Tee)"
        }].map(({
          key,
          label
        }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategory(key), className: `px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${state.category === key ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: label }, key)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center gap-2", children: state.category === "hardware" ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: ["skate", "surf"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSubType(s), className: `px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border ${state.subType === s ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"}`, children: s === "skate" ? "Skate Deck" : "Surfboard" }, s)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: ["tee", "hoodie"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSubType(s), className: `px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border ${state.subType === s ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"}`, children: s === "tee" ? "T-Shirt" : "Hoodie" }, s)) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-full lg:w-[350px] shrink-0 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "h-4 w-4" }), title: "Base Colour", defaultOpen: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: BASE_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update("baseColor", c.value), title: c.name, className: `aspect-square border-2 transition-all ${state.baseColor === c.value ? "border-primary scale-105" : "border-border/40 hover:border-silver"}`, style: {
              backgroundColor: c.value
            }, "aria-label": c.name }, c.value)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-silver/50 mt-2", children: BASE_COLORS.find((c) => c.value === state.baseColor)?.name ?? "Custom" })
          ] }),
          specsList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }), title: "Equipment Specs", defaultOpen: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            specsList.map((spec) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-1.5", children: spec.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: state.specs[spec.key] ?? "", onChange: (e) => setSpec(spec.key, e.target.value), className: "w-full px-3 py-2 bg-card border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select —" }),
                spec.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: opt }, opt))
              ] })
            ] }, spec.key)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-primary", children: [
              "+$",
              PRICE_MODIFIERS.specs,
              " when specs locked"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4" }), title: "Custom Text", defaultOpen: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: textDraft, onChange: (e) => setTextDraft(e.target.value.slice(0, 40)), onKeyDown: (e) => e.key === "Enter" && addTextLayer(), placeholder: "Type your text (max 40)", className: "w-full px-3 py-2 bg-card border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addTextLayer, disabled: !textDraft.trim(), className: "w-full inline-flex items-center justify-center gap-2 bg-primary/10 border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-widest py-2 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add to ",
              state.view
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-primary", children: [
              "+$",
              PRICE_MODIFIERS.text,
              " when text present"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }), title: "Image Upload", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => fileRef.current?.click(), className: "w-full border border-dashed border-border/60 py-8 flex flex-col items-center gap-2 text-silver/60 hover:border-primary hover:text-primary transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest", children: "Drop / click to upload (5 MB)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/png,image/jpeg,image/webp", hidden: true, onChange: (e) => onFile(e.target.files?.[0]) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-primary mt-2", children: [
              "+$",
              PRICE_MODIFIERS.image,
              " when image present"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }), title: "Preset Gallery", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addPresetLayer(preset.id), className: `aspect-square border flex items-center justify-center text-center p-1 font-mono text-[9px] uppercase tracking-widest transition-all ${presetPanel === preset.id ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver/70 hover:border-primary"}`, title: preset.name, children: preset.name }, preset.id)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-primary/40 bg-card p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }),
              " Live Price"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 font-mono text-xs", children: breakdown.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between text-silver/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: b.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "$",
                b.amount
              ] })
            ] }, b.label)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 pt-2 flex justify-between items-baseline", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-black text-2xl text-primary", children: [
                "$",
                price.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: pushToCart, className: "w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }),
              " Add to cart"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: reset, className: "w-full font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "h-3 w-3 inline mr-1" }),
              " Reset studio"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex-1 w-full min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 mr-1", children: "View:" }),
            views.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView(v.id), className: `px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-colors ${state.view === v.id ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: v.label }, v.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-silver/30 border border-border/60 overflow-hidden", style: {
            minHeight: "60vh"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCanvas, { state }),
            viewLayers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-3 right-3 max-h-40 overflow-y-auto bg-background/90 backdrop-blur border border-border/60 p-3 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] uppercase tracking-widest text-silver/60", children: [
                "Layers on this view (",
                viewLayers.length,
                ")"
              ] }),
              viewLayers.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-silver border-b border-border/40 pb-1.5 last:border-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary uppercase", children: l.type === "text" ? "TXT" : l.type === "image" ? "IMG" : "PRE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-silver/80", children: l.type === "image" ? "Uploaded image" : l.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeLayer(l.id), className: "text-silver/50 hover:text-destructive", "aria-label": "Remove layer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
              ] }, l.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-silver/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-primary" }),
              " Current view isolated"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              state.category === "hardware" ? "Grip / Graphic" : "Front / Back / Sleeve",
              " — layers stay per view"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function ProductCanvas({
  state
}) {
  const {
    subType,
    view,
    baseColor,
    layers
  } = state;
  const isHardware = state.category === "hardware";
  const viewLayers = layers.filter((l) => l.view === view);
  const shape = isHardware ? subType === "skate" ? {
    width: "220px",
    height: "520px",
    borderRadius: "110px / 60px"
  } : {
    width: "180px",
    height: "560px",
    borderRadius: "90px / 40px"
  } : subType === "hoodie" ? {
    width: "420px",
    height: "440px",
    borderRadius: "8px"
  } : {
    width: "360px",
    height: "440px",
    borderRadius: "8px"
  };
  const isGrip = isHardware && view === "top";
  const gripTexture = isGrip ? "repeating-linear-gradient(45deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 4px)" : "none";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shadow-2xl transition-colors", style: {
    ...shape,
    backgroundColor: baseColor,
    backgroundImage: gripTexture
  }, children: [
    !isHardware && view === "sleeve" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 top-12 w-16 h-24 border-2 border-silver/40 rounded-sm bg-card/80 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px] uppercase tracking-widest text-silver/60 text-center", children: [
      "Left",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      "Sleeve"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute -top-6 left-0 font-mono text-[9px] uppercase tracking-widest text-silver/60", children: [
      subType,
      " · ",
      view
    ] }),
    viewLayers.map((layer, i) => {
      const top = 15 + i * 12;
      if (layer.type === "image") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: layer.value, alt: "", className: "absolute left-1/2 -translate-x-1/2 max-w-[80%] max-h-[40%] object-contain opacity-90 mix-blend-multiply", style: {
          top: `${top}%`
        } }, layer.id);
      }
      if (layer.type === "preset") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 -translate-x-1/2 px-3 py-1 font-mono text-[10px] uppercase tracking-widest border", style: {
          top: `${top}%`,
          color: isGrip ? "#fff" : "#111",
          borderColor: isGrip ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
        }, children: layer.value }, layer.id);
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 -translate-x-1/2 font-display font-black text-center px-2", style: {
        top: `${top}%`,
        color: isGrip ? "#fff" : contrastText(baseColor),
        fontSize: subType === "tee" ? "26px" : "20px",
        textShadow: isGrip ? "0 1px 2px rgba(0,0,0,0.6)" : "none"
      }, children: layer.value }, layer.id);
    }),
    viewLayers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest opacity-60", style: {
      color: isGrip ? "#fff" : contrastText(baseColor)
    }, children: "Add layers from the toolkit →" }) })
  ] }) });
}
function contrastText(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111" : "#fff";
}
function AccordionSection({
  icon,
  title,
  defaultOpen = false,
  children
}) {
  const [open, setOpen] = reactExports.useState(defaultOpen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((o) => !o), className: "w-full flex items-center justify-between px-4 py-3 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary", children: [
        icon,
        " ",
        title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 text-silver/50 transition-transform ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4", children })
  ] });
}
export {
  DesignStudioPage as component
};

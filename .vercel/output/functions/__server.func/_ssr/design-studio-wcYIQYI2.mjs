import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { l as useCart, N as Nav, F as Footer } from "./router-BZBp0UBL.mjs";
import { c as calculatePrice, p as priceBreakdown, v as validateTrackWidth, d as decodeDesignFromUrl, H as HARDWARE_VIEWS, A as APPAREL_VIEWS, S as SKATE_SPECS, a as SURF_SPECS, T as TEXTURES, b as STICKERS, B as BASE_COLORS, C as COLOR_PALETTES, P as PRICE_MODIFIERS, e as STICKER_CATEGORIES, f as PRESETS, h as defaultDesignState, i as encodeDesignToUrl, m as makeLayer, s as saveCustomDesign } from "./design-studio-DkvfFIKj.mjs";
import { a3 as Undo2, a4 as Redo2, a5 as Download, a6 as Link, a7 as MoveHorizontal, a8 as MoveVertical, a9 as Maximize2, aa as RotateCw, ab as FlipHorizontal2, ac as FlipVertical2, ad as Palette, ae as Grid3x3, z as Settings, d as Plus, af as Type, h as Upload, ag as Image, u as Search, ah as Sticker, b as Sparkles, ai as Eye, o as ShoppingCart, m as ChevronDown, aj as ArrowUp, ak as ArrowDown, L as Lock, al as LockOpen, am as Copy, an as Trash2 } from "../_libs/lucide-react.mjs";
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
function useHistory(initial) {
  const [present, setPresentState] = reactExports.useState(initial);
  const past = reactExports.useRef([]);
  const future = reactExports.useRef([]);
  const set = reactExports.useCallback((updater, record = true) => {
    setPresentState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (record && next !== prev) {
        past.current.push(prev);
        if (past.current.length > 50) past.current.shift();
        future.current = [];
      }
      return next;
    });
  }, []);
  const undo = reactExports.useCallback(() => {
    setPresentState((prev) => {
      if (past.current.length === 0) return prev;
      const previous = past.current.pop();
      future.current.push(prev);
      return previous;
    });
  }, []);
  const redo = reactExports.useCallback(() => {
    setPresentState((prev) => {
      if (future.current.length === 0) return prev;
      const next = future.current.pop();
      past.current.push(prev);
      return next;
    });
  }, []);
  const canUndo = past.current.length > 0;
  const canRedo = future.current.length > 0;
  return {
    state: present,
    set,
    undo,
    redo,
    canUndo,
    canRedo
  };
}
function DesignStudioPage() {
  const {
    state,
    set,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory(defaultDesignState());
  const [textDraft, setTextDraft] = reactExports.useState("");
  const [presetPanel, setPresetPanel] = reactExports.useState(null);
  const [selectedLayerId, setSelectedLayerId] = reactExports.useState(null);
  const [stickerSearch, setStickerSearch] = reactExports.useState("");
  const [stickerCategory, setStickerCategory] = reactExports.useState("all");
  const [paletteOpen, setPaletteOpen] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const {
    add: cartAdd
  } = useCart();
  const price = reactExports.useMemo(() => calculatePrice(state), [state]);
  const breakdown = reactExports.useMemo(() => priceBreakdown(state), [state]);
  const update = reactExports.useCallback((key, value) => set((s) => ({
    ...s,
    [key]: value
  }), true), [set]);
  const setCategory = (category) => {
    const subType = category === "hardware" ? state.subType === "surf" ? "surf" : "skate" : state.subType === "hoodie" ? "hoodie" : "tee";
    const view = category === "hardware" ? "top" : "front";
    set((s) => ({
      ...s,
      category,
      subType,
      view,
      specs: {},
      layers: []
    }), true);
    setSelectedLayerId(null);
  };
  const setSubType = (subType) => {
    set((s) => ({
      ...s,
      subType,
      specs: {},
      layers: []
    }), true);
    setSelectedLayerId(null);
  };
  const setView = (view) => update("view", view);
  const viewLayers = state.layers.filter((l) => l.view === state.view);
  const selectedLayer = state.layers.find((l) => l.id === selectedLayerId) ?? null;
  const nextZ = () => state.layers.length ? Math.max(...state.layers.map((l) => l.zIndex)) + 1 : 0;
  const addTextLayer = () => {
    const value = textDraft.trim();
    if (!value) return;
    const layer = makeLayer("text", value, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setSelectedLayerId(layer.id);
    setTextDraft("");
  };
  const addImageLayer = (dataUrl) => {
    const layer = makeLayer("image", dataUrl, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setSelectedLayerId(layer.id);
  };
  const addPresetLayer = (presetId) => {
    const layer = makeLayer("preset", presetId, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setPresetPanel(presetId);
    setSelectedLayerId(layer.id);
  };
  const addStickerLayer = (sticker) => {
    const layer = makeLayer("preset", sticker.glyph, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setSelectedLayerId(layer.id);
  };
  const updateLayer = (id, patch) => {
    set((s) => ({
      ...s,
      layers: s.layers.map((l) => l.id === id ? {
        ...l,
        ...patch
      } : l)
    }), true);
  };
  const removeLayer = (id) => {
    update("layers", state.layers.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };
  const duplicateLayer = (id) => {
    const layer = state.layers.find((l) => l.id === id);
    if (!layer) return;
    const copy = {
      ...layer,
      id: `dup-${Date.now()}`,
      x: layer.x + 5,
      y: layer.y + 5,
      zIndex: nextZ()
    };
    update("layers", [...state.layers, copy]);
    setSelectedLayerId(copy.id);
  };
  const moveLayerZ = (id, dir) => {
    set((s) => ({
      ...s,
      layers: s.layers.map((l) => {
        if (l.id !== id) return l;
        return {
          ...l,
          zIndex: l.zIndex + (dir === "up" ? 1 : -1)
        };
      })
    }), true);
  };
  const reorderLayers = (fromId, toId) => {
    set((s) => {
      const layers = [...s.layers];
      const fromIdx = layers.findIndex((l) => l.id === fromId);
      const toIdx = layers.findIndex((l) => l.id === toId);
      if (fromIdx === -1 || toIdx === -1) return s;
      const [moved] = layers.splice(fromIdx, 1);
      layers.splice(toIdx, 0, moved);
      return {
        ...s,
        layers
      };
    }, true);
  };
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
  const trackWarning = validateTrackWidth(state.specs["deck_width"], state.specs["track_width"]);
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
    set(defaultDesignState(), false);
    setTextDraft("");
    setPresetPanel(null);
    setSelectedLayerId(null);
  };
  const downloadPng = () => {
    const canvasEl = document.getElementById("ds-canvas-export");
    if (!canvasEl) {
      toast.error("Canvas not ready");
      return;
    }
    const url = canvasEl.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `liminal-${state.subType}-${Date.now()}.png`;
    a.click();
    toast.success("Print-ready PNG downloaded");
  };
  const copyShareLink = () => {
    const encoded = encodeDesignToUrl(state);
    const url = `${window.location.origin}${window.location.pathname}?d=${encoded}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Shareable design link copied")).catch(() => toast.error("Could not copy link"));
  };
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("d");
    if (encoded) {
      const decoded = decodeDesignFromUrl(encoded);
      if (decoded) {
        set((s) => ({
          ...s,
          ...decoded
        }), false);
        toast.success("Design loaded from link");
      }
    }
  }, []);
  const views = state.category === "hardware" ? HARDWARE_VIEWS : APPAREL_VIEWS;
  const specsList = state.subType === "skate" ? SKATE_SPECS : state.subType === "surf" ? SURF_SPECS : [];
  const availableTextures = TEXTURES.filter((t) => t.subTypes.includes(state.subType));
  const filteredStickers = STICKERS.filter((s) => {
    const matchesCategory = stickerCategory === "all" || s.category === stickerCategory;
    const matchesSearch = !stickerSearch || s.name.toLowerCase().includes(stickerSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: state.category === "hardware" ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: ["skate", "surf"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSubType(s), className: `px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border ${state.subType === s ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"}`, children: s === "skate" ? "Skate Deck" : "Surfboard" }, s)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: ["tee", "hoodie"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSubType(s), className: `px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border ${state.subType === s ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"}`, children: s === "tee" ? "T-Shirt" : "Hoodie" }, s)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarBtn, { onClick: undo, disabled: !canUndo, title: "Undo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarBtn, { onClick: redo, disabled: !canRedo, title: "Redo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Redo2, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-border/40 mx-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarBtn, { onClick: downloadPng, title: "Download PNG", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarBtn, { onClick: copyShareLink, title: "Copy share link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-4 w-4" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-full lg:w-[350px] shrink-0 space-y-3", children: [
          selectedLayer && /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MoveHorizontal, { className: "h-4 w-4" }), title: "Position & Transform", defaultOpen: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => updateLayer(selectedLayer.id, {
                x: 50
              }), className: QUICK_BTN, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MoveHorizontal, { className: "h-3 w-3" }),
                " Center H"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => updateLayer(selectedLayer.id, {
                y: 50
              }), className: QUICK_BTN, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MoveVertical, { className: "h-3 w-3" }),
                " Center V"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => updateLayer(selectedLayer.id, {
                x: 50,
                y: 50,
                scale: 1,
                rotation: 0
              }), className: QUICK_BTN, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-3 w-3" }),
                " Fit"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => updateLayer(selectedLayer.id, {
                rotation: (selectedLayer.rotation + 90) % 360
              }), className: QUICK_BTN, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "h-3 w-3" }),
                " Rotate 90°"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => updateLayer(selectedLayer.id, {
                scale: -selectedLayer.scale
              }), className: QUICK_BTN, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FlipHorizontal2, { className: "h-3 w-3" }),
                " Flip H"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => updateLayer(selectedLayer.id, {
                rotation: 180 - selectedLayer.rotation
              }), className: QUICK_BTN, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FlipVertical2, { className: "h-3 w-3" }),
                " Flip V"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: LABEL, children: "X (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: Math.round(selectedLayer.x), onChange: (e) => updateLayer(selectedLayer.id, {
                  x: Number(e.target.value)
                }), className: NUM_INPUT })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: LABEL, children: "Y (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: Math.round(selectedLayer.y), onChange: (e) => updateLayer(selectedLayer.id, {
                  y: Number(e.target.value)
                }), className: NUM_INPUT })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: LABEL, children: "Scale" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.1", value: selectedLayer.scale.toFixed(1), onChange: (e) => updateLayer(selectedLayer.id, {
                  scale: Number(e.target.value)
                }), className: NUM_INPUT })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: LABEL, children: "Rotation°" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: selectedLayer.rotation, onChange: (e) => updateLayer(selectedLayer.id, {
                  rotation: Number(e.target.value)
                }), className: NUM_INPUT })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: LABEL, children: [
                "Opacity: ",
                Math.round(selectedLayer.opacity * 100),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "0", max: "1", step: "0.05", value: selectedLayer.opacity, onChange: (e) => updateLayer(selectedLayer.id, {
                opacity: Number(e.target.value)
              }), className: "w-full accent-primary" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "h-4 w-4" }), title: "Base Colour", defaultOpen: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: BASE_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update("baseColor", c.value), title: c.name, className: `aspect-square border-2 transition-all ${state.baseColor === c.value ? "border-primary scale-105" : "border-border/40 hover:border-silver"}`, style: {
              backgroundColor: c.value
            }, "aria-label": c.name }, c.value)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-silver/50 mt-2", children: BASE_COLORS.find((c) => c.value === state.baseColor)?.name ?? "Custom" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPaletteOpen((o) => !o), className: "font-mono text-[10px] uppercase tracking-widest text-primary hover:underline", children: [
                paletteOpen ? "Hide" : "Show",
                " curated palettes"
              ] }),
              paletteOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2", children: COLOR_PALETTES.map((pal) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1", children: pal.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", children: pal.colors.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update("baseColor", c), className: "w-7 h-7 border border-border/40 hover:border-primary hover:scale-110 transition-all", style: {
                  backgroundColor: c
                }, "aria-label": c }, c)) })
              ] }, pal.name)) })
            ] })
          ] }),
          availableTextures.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "h-4 w-4" }), title: "Material Texture", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: availableTextures.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update("texture", t.id), className: `w-full text-left px-3 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${state.texture === t.id ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"}`, children: t.label }, t.id)) }) }),
          specsList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }), title: "Equipment Specs", defaultOpen: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            specsList.map((spec) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-1.5", children: spec.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: state.specs[spec.key] ?? "", onChange: (e) => setSpec(spec.key, e.target.value), className: "w-full px-3 py-2 bg-card border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select —" }),
                spec.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: opt }, opt))
              ] })
            ] }, spec.key)),
            trackWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-destructive bg-destructive/10 border border-destructive/30 px-2 py-1.5", children: [
              "⚠ ",
              trackWarning
            ] }),
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
            selectedLayer?.type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-silver/50", children: "Text FX" }),
              [{
                key: "curved",
                label: "Curved/Arched"
              }, {
                key: "outline",
                label: "Outline/Stroke"
              }, {
                key: "shadow",
                label: "Drop Shadow"
              }, {
                key: "distressed",
                label: "Vintage/Distressed"
              }].map(({
                key,
                label
              }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 font-mono text-[10px] text-silver/70 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedLayer.fx?.[key] ?? false, onChange: (e) => updateLayer(selectedLayer.id, {
                  fx: {
                    ...selectedLayer.fx,
                    [key]: e.target.checked
                  }
                }), className: "accent-primary" }),
                label
              ] }, key)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-primary", children: [
                "+$",
                PRICE_MODIFIERS.fx,
                " when FX active"
              ] })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml", hidden: true, onChange: (e) => onFile(e.target.files?.[0]) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-primary mt-2", children: [
              "+$",
              PRICE_MODIFIERS.image,
              " when image present"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionSection, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sticker, { className: "h-4 w-4" }), title: "Sticker Library", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-silver/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: stickerSearch, onChange: (e) => setStickerSearch(e.target.value), placeholder: "Search stickers…", className: "w-full pl-7 pr-3 py-1.5 bg-card border border-border/60 text-xs font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: STICKER_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStickerCategory(cat), className: `px-2 py-1 font-mono text-[9px] uppercase tracking-widest border ${stickerCategory === cat ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-silver/60 hover:border-primary"}`, children: cat }, cat)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 max-h-48 overflow-y-auto", children: filteredStickers.map((st) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addStickerLayer(st), title: st.name, className: "aspect-square border border-border/60 flex items-center justify-center text-lg hover:border-primary hover:bg-primary/10 transition-all", children: st.glyph }, st.id)) })
          ] }) }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: downloadPng, className: "flex-1 inline-flex items-center justify-center gap-1.5 border border-border/60 font-mono text-[10px] uppercase tracking-widest py-2 text-silver hover:border-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3" }),
                " PNG"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: copyShareLink, className: "flex-1 inline-flex items-center justify-center gap-1.5 border border-border/60 font-mono text-[10px] uppercase tracking-widest py-2 text-silver hover:border-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-3 w-3" }),
                " Share"
              ] })
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
            views.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView(v.id), className: `px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-colors ${state.view === v.id ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: v.label }, v.id)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-silver/60 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: state.showSafeArea, onChange: (e) => update("showSafeArea", e.target.checked), className: "accent-primary" }),
              "Safe Area"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative bg-silver/30 border border-border/60 overflow-hidden", style: {
            minHeight: "60vh"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCanvas, { state, selectedLayerId, onSelectLayer: setSelectedLayerId, onUpdateLayer: updateLayer }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayerPanel, { layers: state.layers, viewLayers, currentView: state.view, selectedLayerId, onSelect: setSelectedLayerId, onRemove: removeLayer, onDuplicate: duplicateLayer, onToggleLock: (id) => {
            const l = state.layers.find((x) => x.id === id);
            if (l) updateLayer(id, {
              locked: !l.locked
            });
          }, onMoveZ: moveLayerZ, onReorder: reorderLayers }),
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
  state,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer
}) {
  const {
    subType,
    view,
    baseColor,
    layers,
    texture,
    showSafeArea
  } = state;
  const isHardware = state.category === "hardware";
  const viewLayers = layers.filter((l) => l.view === view).sort((a, b) => a.zIndex - b.zIndex);
  const canvasRef = reactExports.useRef(null);
  const dragRef = reactExports.useRef(null);
  const [snapGuides, setSnapGuides] = reactExports.useState(null);
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
  const textureStyle = reactExports.useMemo(() => {
    switch (texture) {
      case "grip-tape":
        return "repeating-linear-gradient(45deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 4px)";
      case "maple-grain":
        return "repeating-linear-gradient(90deg, rgba(120,80,40,0.08) 0 3px, transparent 3px 12px)";
      case "fiberglass":
        return "linear-gradient(105deg, rgba(255,255,255,0.12) 0%, transparent 30%, rgba(255,255,255,0.08) 60%, transparent 90%)";
      case "cotton-weave":
        return "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px)";
      default:
        return "none";
    }
  }, [texture]);
  const onPointerDown = (e, layer) => {
    if (layer.locked) return;
    e.stopPropagation();
    onSelectLayer(layer.id);
    dragRef.current = {
      id: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: layer.x,
      origY: layer.y
    };
    e.target.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragRef.current.startX) / rect.width * 100;
    const dy = (e.clientY - dragRef.current.startY) / rect.height * 100;
    let newX = dragRef.current.origX + dx;
    let newY = dragRef.current.origY + dy;
    const snapV = Math.abs(newX - 50) < 3 ? 50 : null;
    const snapH = Math.abs(newY - 50) < 3 ? 50 : null;
    if (snapV !== null) newX = snapV;
    if (snapH !== null) newY = snapH;
    setSnapGuides(snapV !== null || snapH !== null ? {
      v: snapV ?? -1,
      h: snapH ?? -1
    } : null);
    onUpdateLayer(dragRef.current.id, {
      x: newX,
      y: newY
    });
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setSnapGuides(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center p-6", onPointerMove, onPointerUp, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: canvasRef, className: "relative shadow-2xl transition-colors", style: {
    ...shape,
    backgroundColor: baseColor,
    backgroundImage: textureStyle
  }, onClick: () => onSelectLayer(null), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { id: "ds-canvas-export", className: "hidden", width: 800, height: 800 }),
    showSafeArea && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute border-2 border-dashed border-primary/40 pointer-events-none", style: {
      inset: isHardware ? "8%" : "12%",
      borderRadius: isHardware ? "inherit" : "4px"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-5 left-0 font-mono text-[8px] uppercase tracking-widest text-primary/60", children: "Safe print zone" }) }),
    snapGuides && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      snapGuides.v >= 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 bottom-0 w-px bg-primary/50 pointer-events-none", style: {
        left: `${snapGuides.v}%`
      } }),
      snapGuides.h >= 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 h-px bg-primary/50 pointer-events-none", style: {
        top: `${snapGuides.h}%`
      } })
    ] }),
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
    viewLayers.map((layer) => {
      const isSelected = layer.id === selectedLayerId;
      const baseStyle = {
        left: `${layer.x}%`,
        top: `${layer.y}%`,
        transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
        opacity: layer.opacity,
        zIndex: layer.zIndex
      };
      let content;
      if (layer.type === "image") {
        content = /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: layer.value, alt: "", className: "max-w-[80%] max-h-[40%] object-contain mix-blend-multiply pointer-events-none" });
      } else if (layer.type === "preset") {
        content = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 font-mono text-2xl uppercase tracking-widest border", style: {
          color: isGrip ? "#fff" : "#111",
          borderColor: isGrip ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
        }, children: layer.value });
      } else {
        const fx = layer.fx;
        const textStyle = {
          color: isGrip ? "#fff" : contrastText(baseColor),
          fontSize: subType === "tee" ? "26px" : "20px",
          textShadow: isGrip ? "0 1px 2px rgba(0,0,0,0.6)" : fx?.shadow ? "2px 2px 4px rgba(0,0,0,0.5)" : "none",
          WebkitTextStroke: fx?.outline ? "1px rgba(0,0,0,0.6)" : "0",
          filter: fx?.distressed ? "contrast(1.4) brightness(0.8)" : "none"
        };
        content = fx?.curved ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 200 60", className: "w-32 h-10 pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { id: `curve-${layer.id}`, d: "M 10 50 Q 100 10 190 50", fill: "none" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { style: textStyle, className: "font-display font-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textPath", { href: `#curve-${layer.id}`, startOffset: "50%", textAnchor: "middle", children: layer.value }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-center px-2 pointer-events-none", style: textStyle, children: layer.value });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute cursor-move select-none ${isSelected ? "ring-2 ring-primary" : ""} ${layer.locked ? "cursor-not-allowed" : ""}`, style: baseStyle, onPointerDown: (e) => onPointerDown(e, layer), children: [
        content,
        isSelected && !layer.locked && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-[10px] font-bold touch-none", children: "↻" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-primary-foreground text-[10px] touch-none", children: "×" })
        ] })
      ] }, layer.id);
    }),
    viewLayers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest opacity-60", style: {
      color: isGrip ? "#fff" : contrastText(baseColor)
    }, children: "Add layers from the toolkit →" }) })
  ] }) });
}
function LayerPanel({
  layers,
  viewLayers,
  currentView,
  selectedLayerId,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleLock,
  onMoveZ,
  onReorder
}) {
  const [dragId, setDragId] = reactExports.useState(null);
  const sorted = [...viewLayers].sort((a, b) => b.zIndex - a.zIndex);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border border-border/60 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 border-b border-border/40 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: [
        "Layers (",
        viewLayers.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px] uppercase tracking-widest text-silver/40", children: [
        currentView,
        " view"
      ] })
    ] }),
    sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 py-3 font-mono text-[10px] text-silver/40", children: "No layers on this view" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-y-auto", children: sorted.map((l, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { draggable: true, onDragStart: () => setDragId(l.id), onDragOver: (e) => e.preventDefault(), onDrop: () => {
      if (dragId && dragId !== l.id) onReorder(dragId, l.id);
      setDragId(null);
    }, onClick: () => onSelect(l.id), className: `flex items-center gap-2 px-4 py-2 border-b border-border/30 cursor-pointer transition-colors ${selectedLayerId === l.id ? "bg-primary/10" : "hover:bg-silver/5"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-silver/30 font-mono text-[10px]", children: idx + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary uppercase font-mono text-[10px]", children: l.type === "text" ? "TXT" : l.type === "image" ? "IMG" : "STK" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-xs font-mono text-silver/80", children: l.type === "image" ? "Uploaded image" : l.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        onMoveZ(l.id, "up");
      }, className: "text-silver/50 hover:text-primary", "aria-label": "Bring forward", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        onMoveZ(l.id, "down");
      }, className: "text-silver/50 hover:text-primary", "aria-label": "Send backward", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        onToggleLock(l.id);
      }, className: "text-silver/50 hover:text-primary", "aria-label": "Toggle lock", children: l.locked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        onDuplicate(l.id);
      }, className: "text-silver/50 hover:text-primary", "aria-label": "Duplicate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        onRemove(l.id);
      }, className: "text-silver/50 hover:text-destructive", "aria-label": "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
    ] }, l.id)) })
  ] });
}
const QUICK_BTN = "inline-flex items-center justify-center gap-1.5 px-2 py-2 font-mono text-[10px] uppercase tracking-widest border border-border/60 text-silver hover:border-primary hover:text-primary transition-colors";
const LABEL = "block font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1";
const NUM_INPUT = "w-full px-2 py-1.5 bg-card border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary";
function ToolbarBtn({
  onClick,
  disabled,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, disabled, title, className: "p-2 border border-border/60 text-silver hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed", children });
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

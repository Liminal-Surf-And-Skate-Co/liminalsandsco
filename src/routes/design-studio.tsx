import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload, ShoppingCart, Palette, Settings, Type, Image as ImageIcon, Sparkles, Eye, RotateCw, ChevronDown, Undo2, Redo2, FlipHorizontal2, FlipVertical2, MoveHorizontal, MoveVertical, Maximize2, Lock, Clock as Unlock, ArrowUp, ArrowDown, Copy, Download, Link as LinkIcon, Search, Grid3x3, Sticker, Layers, Zap, User, Save, Send } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/main";
import {
  type ProductCategory, type ProductSubType, type ViewId,
  type DesignState, type DesignLayer, type TextureOverlay,
  type TextFX, type StickerPack, type BlendMode, type ConcaveProfile,
  type StarterTemplate,
  BASE_PRICES, PRICE_MODIFIERS, BASE_COLORS, COLOR_PALETTES,
  STICKERS, STICKER_CATEGORIES, TEXTURES, CONCAVE_PROFILES,
  WHEEL_HARDNESS, BOLT_COLORS, VENEER_COLORS, FIN_SYSTEMS,
  FIN_COLORS, RAIL_SPRAY_COLORS, STRINGER_COLORS,
  HARDWARE_VIEWS, APPAREL_VIEWS, BLEND_MODES,
  STARTER_TEMPLATES, defaultDesignState, makeLayer, applyTemplate,
  calculatePrice, priceBreakdown, validateTrackWidth, calcSurfVolume,
  encodeDesignToUrl, decodeDesignFromUrl, contrastText,
} from "@/lib/design-studio";

export default function DesignStudioPage() {
  const [state, setStateRaw] = useState<DesignState>(defaultDesignState());
  const [textDraft, setTextDraft] = useState("");
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [stickerSearch, setStickerSearch] = useState("");
  const [stickerCategory, setStickerCategory] = useState<(typeof STICKER_CATEGORIES)[number]>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"templates" | "design" | "hardware" | "stickers">("design");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // History
  const past = useRef<DesignState[]>([]);
  const future = useRef<DesignState[]>([]);

  const set = useCallback((updater: DesignState | ((prev: DesignState) => DesignState), record = true) => {
    setStateRaw((prev) => {
      const next = typeof updater === "function" ? (updater as (p: DesignState) => DesignState)(prev) : updater;
      if (record && next !== prev) {
        past.current.push(prev);
        if (past.current.length > 50) past.current.shift();
        future.current = [];
      }
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setStateRaw((prev) => {
      if (past.current.length === 0) return prev;
      const previous = past.current.pop()!;
      future.current.push(prev);
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setStateRaw((prev) => {
      if (future.current.length === 0) return prev;
      const next = future.current.pop()!;
      past.current.push(prev);
      return next;
    });
  }, []);

  const price = useMemo(() => calculatePrice(state), [state]);
  const breakdown = useMemo(() => priceBreakdown(state), [state]);

  const update = useCallback(
    <K extends keyof DesignState>(key: K, value: DesignState[K]) =>
      set((s) => ({ ...s, [key]: value }), true),
    [set],
  );

  const setCategory = (category: ProductCategory) => {
    const subType: ProductSubType = category === "hardware" ? "skate" : "tee";
    const view: ViewId = category === "hardware" ? "top" : "front";
    set((s) => ({ ...s, category, subType, view, specs: {}, layers: [], skateSpecs: {}, surfSpecs: {} }), true);
    setSelectedLayerId(null);
  };

  const setSubType = (subType: ProductSubType) => {
    set((s) => ({ ...s, subType, specs: {}, layers: [], skateSpecs: {}, surfSpecs: {} }), true);
    setSelectedLayerId(null);
  };

  const setView = (view: ViewId) => update("view", view);

  const viewLayers = state.layers.filter((l) => l.view === state.view);
  const selectedLayer = state.layers.find((l) => l.id === selectedLayerId) ?? null;

  const nextZ = () => (state.layers.length ? Math.max(...state.layers.map((l) => l.zIndex)) + 1 : 0);

  const addTextLayer = () => {
    const value = textDraft.trim();
    if (!value) return;
    const layer = makeLayer("text", value, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setSelectedLayerId(layer.id);
    setTextDraft("");
  };

  const addImageLayer = (dataUrl: string) => {
    const layer = makeLayer("image", dataUrl, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setSelectedLayerId(layer.id);
  };

  const addStickerLayer = (sticker: StickerPack) => {
    const layer = makeLayer("sticker", sticker.glyph, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setSelectedLayerId(layer.id);
  };

  const loadTemplate = (template: StarterTemplate) => {
    set(applyTemplate(template), true);
    setSelectedLayerId(null);
    toast.success(`Loaded "${template.name}" template`);
  };

  const updateLayer = (id: string, patch: Partial<DesignLayer>) => {
    set((s) => ({
      ...s,
      layers: s.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }), true);
  };

  const removeLayer = (id: string) => {
    update("layers", state.layers.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const duplicateLayer = (id: string) => {
    const layer = state.layers.find((l) => l.id === id);
    if (!layer) return;
    const copy = { ...layer, id: `dup-${Date.now()}`, x: layer.x + 5, y: layer.y + 5, zIndex: nextZ() };
    update("layers", [...state.layers, copy]);
    setSelectedLayerId(copy.id);
  };

  const moveLayerZ = (id: string, dir: "up" | "down") => {
    set((s) => ({
      ...s,
      layers: s.layers.map((l) => l.id !== id ? l : { ...l, zIndex: l.zIndex + (dir === "up" ? 1 : -1) }),
    }), true);
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        addImageLayer(reader.result);
        toast.success("Image added to current view");
      }
    };
    reader.readAsDataURL(file);
  };

  const setSpec = (key: string, value: string) =>
    update("specs", { ...state.specs, [key]: value });

  const setSkateSpec = (key: keyof typeof state.skateSpecs, value: string | boolean) =>
    set((s) => ({ ...s, skateSpecs: { ...s.skateSpecs, [key]: value } }), true);

  const setSurfSpec = (key: keyof typeof state.surfSpecs, value: string | number) =>
    set((s) => ({ ...s, surfSpecs: { ...s.surfSpecs, [key]: value } }), true);

  const trackWarning = validateTrackWidth(state.specs["deck_width"], state.specs["track_width"]);
  const surfVolume = state.subType === "surf"
    ? calcSurfVolume(state.surfSpecs.length ?? "", state.surfSpecs.width ?? "", state.surfSpecs.thickness ?? "")
    : 0;

  const downloadPng = () => {
    const canvasEl = document.getElementById("ds-canvas-export") as HTMLCanvasElement | null;
    if (!canvasEl) { toast.error("Canvas not ready"); return; }
    const url = canvasEl.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `liminal-${state.subType}-${Date.now()}.png`;
    a.click();
    toast.success("Print-ready PNG downloaded");
    return url;
  };

  const copyShareLink = () => {
    const encoded = encodeDesignToUrl(state);
    const url = `${window.location.origin}/design-studio?d=${encoded}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Shareable design link copied"))
      .catch(() => toast.error("Could not copy link"));
  };

  const saveToGarage = async () => {
    if (!supabase) { toast.error("Database not available"); return; }
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast.error("Please sign in to save to your garage");
      return;
    }
    const { error } = await supabase.from("custom_orders").insert({
      email: session.session.user.email ?? "",
      product_type: state.subType,
      product_name: `Custom ${state.subType}`,
      design_json: state,
      specs_json: { specs: state.specs, skateSpecs: state.skateSpecs, surfSpecs: state.surfSpecs },
      price,
      status: "pending",
      customer_note: "Saved to garage",
    });
    if (error) { toast.error(`Save failed: ${error.message}`); return; }
    toast.success("Saved to your garage");
  };

  const submitOrder = async () => {
    if (!supabase) { toast.error("Database not available"); return; }
    if (!customerEmail.trim()) { toast.error("Enter your email to submit"); return; }
    setSubmitting(true);

    // Export canvas to PNG data URL
    let imageDataUrl: string | null = null;
    const canvasEl = document.getElementById("ds-canvas-export") as HTMLCanvasElement | null;
    if (canvasEl) {
      try { imageDataUrl = canvasEl.toDataURL("image/png"); } catch { /* ignore */ }
    }

    const { data, error } = await supabase.from("custom_orders").insert({
      email: customerEmail,
      product_type: state.subType,
      product_name: `Custom ${state.subType}`,
      design_json: state,
      specs_json: { specs: state.specs, skateSpecs: state.skateSpecs, surfSpecs: state.surfSpecs },
      image_data_url: imageDataUrl,
      price,
      status: "pending",
      customer_note: customerNote,
    }).select("share_slug").single();

    if (error) {
      toast.error(`Submission failed: ${error.message}`);
      setSubmitting(false);
      return;
    }

    // Trigger email confirmation edge function
    try {
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/custom-order-email`;
      await fetch(fnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: customerEmail,
          productType: state.subType,
          price,
          shareSlug: data.share_slug,
          customerNote,
        }),
      });
    } catch {
      // Email is best-effort; don't block on it
    }

    toast.success("Custom order submitted! Check your email for confirmation.");
    setSubmitting(false);
  };

  const reset = () => {
    set(defaultDesignState(), false);
    setTextDraft("");
    setSelectedLayerId(null);
  };

  // Load from URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("d");
    if (encoded) {
      const decoded = decodeDesignFromUrl(encoded);
      if (decoded) {
        set((s) => ({ ...s, ...decoded }), false);
        toast.success("Design loaded from link");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const views = state.category === "hardware"
    ? (HARDWARE_VIEWS as { id: ViewId; label: string }[])
    : (APPAREL_VIEWS as { id: ViewId; label: string }[]);

  const availableTextures = TEXTURES.filter((t) => t.subTypes.includes(state.subType));
  const filteredStickers = STICKERS.filter((s) => {
    const matchesCategory = stickerCategory === "all" || s.category === stickerCategory;
    const matchesSearch = !stickerSearch || s.name.toLowerCase().includes(stickerSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        {/* Hero header */}
        <section className="border-b border-border/40 py-10 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Studio · Make it yours
            </p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="font-display font-black text-4xl lg:text-6xl leading-none">
                DESIGN STUDIO
              </h1>
              {/* Advanced Mode toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver">
                  {state.advancedMode ? "Pro Mode" : "Beginner"}
                </span>
                <button
                  onClick={() => update("advancedMode", !state.advancedMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${state.advancedMode ? "bg-accent" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${state.advancedMode ? "translate-x-6" : ""}`} />
                </button>
                <Zap className={`h-4 w-4 ${state.advancedMode ? "text-accent" : "text-silver/40"}`} />
              </label>
            </div>
            <p className="text-silver/70 max-w-2xl text-sm mt-3">
              Build a custom deck, surfboard, tee or hoodie. Load a template, flip between views,
              stack layers, lock your specs — price updates live.
            </p>
          </div>
        </section>

        {/* Product toggle + toolbar */}
        <div className="border-b border-border/40 bg-card/50 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2">
            {([
              { key: "hardware" as const, label: "Hardware" },
              { key: "apparel" as const, label: "Apparel" },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                  state.category === key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 text-silver hover:border-primary"
                }`}
              >
                {label}
              </button>
            ))}
            <div className="flex items-center gap-1.5">
              {state.category === "hardware" ? (
              (["skate", "surf"] as const).map((s) => (
                <button key={s} onClick={() => setSubType(s)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border ${
                    state.subType === s ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"
                  }`}>
                  {s === "skate" ? "Skate Deck" : "Surfboard"}
                </button>
              ))
            ) : (
              (["tee", "hoodie"] as const).map((s) => (
                <button key={s} onClick={() => setSubType(s)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border ${
                    state.subType === s ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"
                  }`}>
                  {s === "tee" ? "T-Shirt" : "Hoodie"}
                </button>
              ))
            )}
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <ToolbarBtn onClick={undo} disabled={past.current.length === 0} title="Undo">
                <Undo2 className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={redo} disabled={future.current.length === 0} title="Redo">
                <Redo2 className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border/40 mx-1" />
              <ToolbarBtn onClick={downloadPng} title="Download PNG">
                <Download className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={copyShareLink} title="Copy share link">
                <LinkIcon className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={saveToGarage} title="Save to Garage">
                <Save className="h-4 w-4" />
              </ToolbarBtn>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT: Tabbed Toolkit */}
          <aside className="w-full lg:w-[360px] shrink-0 space-y-3">
            {/* Tab bar */}
            <div className="flex gap-1 border-b border-border/40">
              {([
                { id: "templates" as const, label: "Templates", icon: <Sparkles className="h-3.5 w-3.5" /> },
                { id: "design" as const, label: "Design", icon: <Palette className="h-3.5 w-3.5" /> },
                { id: "hardware" as const, label: "Hardware", icon: <Settings className="h-3.5 w-3.5" /> },
                { id: "stickers" as const, label: "Stickers", icon: <Sticker className="h-3.5 w-3.5" /> },
              ]).map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest border-b-2 transition-colors ${
                    activeTab === id
                      ? "border-accent text-accent"
                      : "border-transparent text-silver/60 hover:text-silver"
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Templates tab */}
            {activeTab === "templates" && (
              <div className="space-y-2">
                {STARTER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => loadTemplate(tpl)}
                    className="w-full text-left border border-border/60 bg-card p-3 hover:border-accent transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-sm text-foreground">{tpl.name}</span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-silver/40">
                        {tpl.subType}
                      </span>
                    </div>
                    <p className="text-xs text-silver/60">{tpl.description}</p>
                    <div className="mt-2 flex gap-1">
                      {tpl.layers.slice(0, 4).map((l, i) => (
                        <span key={i} className="w-6 h-6 flex items-center justify-center text-sm border border-border/40">
                          {l.type === "text" ? "T" : l.value}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Design tab */}
            {activeTab === "design" && (
              <div className="space-y-3">
                {/* Quick positioning for selected layer */}
                {selectedLayer && (
                  <AccordionSection icon={<MoveHorizontal className="h-4 w-4" />} title="Position & Transform" defaultOpen>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => updateLayer(selectedLayer.id, { x: 50 })} className={QUICK_BTN}>
                        <MoveHorizontal className="h-3 w-3" /> Center X
                      </button>
                      <button onClick={() => updateLayer(selectedLayer.id, { y: 50 })} className={QUICK_BTN}>
                        <MoveVertical className="h-3 w-3" /> Center Y
                      </button>
                      <button onClick={() => updateLayer(selectedLayer.id, { x: 50, y: 50, scale: 1, rotation: 0 })} className={QUICK_BTN}>
                        <Maximize2 className="h-3 w-3" /> Fit
                      </button>
                      <button onClick={() => updateLayer(selectedLayer.id, { rotation: (selectedLayer.rotation + 90) % 360 })} className={QUICK_BTN}>
                        <RotateCw className="h-3 w-3" /> Rotate 90°
                      </button>
                      <button onClick={() => updateLayer(selectedLayer.id, { scale: -selectedLayer.scale })} className={QUICK_BTN}>
                        <FlipHorizontal2 className="h-3 w-3" /> Flip H
                      </button>
                      <button onClick={() => updateLayer(selectedLayer.id, { rotation: 180 - selectedLayer.rotation })} className={QUICK_BTN}>
                        <FlipVertical2 className="h-3 w-3" /> Flip V
                      </button>
                    </div>
                    {state.advancedMode && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <label className="block">
                          <span className={LABEL}>X (%)</span>
                          <input type="number" value={Math.round(selectedLayer.x)}
                            onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })}
                            className={NUM_INPUT} />
                        </label>
                        <label className="block">
                          <span className={LABEL}>Y (%)</span>
                          <input type="number" value={Math.round(selectedLayer.y)}
                            onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })}
                            className={NUM_INPUT} />
                        </label>
                        <label className="block">
                          <span className={LABEL}>Scale %</span>
                          <input type="number" step="0.1" value={selectedLayer.scale.toFixed(1)}
                            onChange={(e) => updateLayer(selectedLayer.id, { scale: Number(e.target.value) })}
                            className={NUM_INPUT} />
                        </label>
                        <label className="block">
                          <span className={LABEL}>Rotation°</span>
                          <input type="number" value={selectedLayer.rotation}
                            onChange={(e) => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                            className={NUM_INPUT} />
                        </label>
                        <label className="block col-span-2">
                          <span className={LABEL}>Opacity: {Math.round(selectedLayer.opacity * 100)}%</span>
                          <input type="range" min="0" max="1" step="0.05" value={selectedLayer.opacity}
                            onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) })}
                            className="w-full accent-accent" />
                        </label>
                        {/* Blend mode (Pro only) */}
                        <label className="block col-span-2">
                          <span className={LABEL}>Blend Mode</span>
                          <select
                            value={selectedLayer.blendMode}
                            onChange={(e) => updateLayer(selectedLayer.id, { blendMode: e.target.value as BlendMode })}
                            className={SELECT_INPUT}
                          >
                            {BLEND_MODES.map((m) => (
                              <option key={m.id} value={m.id}>{m.label}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    )}
                  </AccordionSection>
                )}

                <AccordionSection icon={<Palette className="h-4 w-4" />} title="Base Colour" defaultOpen>
                  <div className="grid grid-cols-4 gap-2">
                    {BASE_COLORS.map((c) => (
                      <button key={c.value} onClick={() => update("baseColor", c.value)} title={c.name}
                        className={`aspect-square border-2 transition-all ${state.baseColor === c.value ? "border-accent scale-105" : "border-border/40 hover:border-silver"}`}
                        style={{ backgroundColor: c.value }} aria-label={c.name} />
                    ))}
                  </div>
                  <p className="font-mono text-[10px] text-silver/50 mt-2">
                    {BASE_COLORS.find((c) => c.value === state.baseColor)?.name ?? "Custom"}
                  </p>
                  <div className="mt-3">
                    <button onClick={() => setPaletteOpen((o) => !o)}
                      className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
                      {paletteOpen ? "Hide" : "Show"} curated palettes
                    </button>
                    {paletteOpen && (
                      <div className="mt-2 space-y-2">
                        {COLOR_PALETTES.map((pal) => (
                          <div key={pal.name}>
                            <p className="font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1">{pal.name}</p>
                            <div className="flex gap-1.5">
                              {pal.colors.map((c) => (
                                <button key={c} onClick={() => update("baseColor", c)}
                                  className="w-7 h-7 border border-border/40 hover:border-accent hover:scale-110 transition-all"
                                  style={{ backgroundColor: c }} aria-label={c} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionSection>

                {availableTextures.length > 1 && (
                  <AccordionSection icon={<Grid3x3 className="h-4 w-4" />} title="Material Texture">
                    <div className="space-y-2">
                      {availableTextures.map((t) => (
                        <button key={t.id} onClick={() => update("texture", t.id as TextureOverlay)}
                          className={`w-full text-left px-3 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                            state.texture === t.id ? "border-accent bg-accent/10 text-accent" : "border-border/60 text-silver hover:border-accent"
                          }`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </AccordionSection>
                )}

                <AccordionSection icon={<Type className="h-4 w-4" />} title="Custom Text" defaultOpen>
                  <div className="space-y-2">
                    <input value={textDraft} onChange={(e) => setTextDraft(e.target.value.slice(0, 40))}
                      onKeyDown={(e) => e.key === "Enter" && addTextLayer()}
                      placeholder="Type your text (max 40)"
                      className="w-full px-3 py-2 bg-card border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-accent" />
                    <button onClick={addTextLayer} disabled={!textDraft.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] uppercase tracking-widest py-2 hover:bg-accent hover:text-white transition-colors disabled:opacity-40">
                      <Plus className="h-3.5 w-3.5" /> Add to {state.view}
                    </button>
                    {selectedLayer?.type === "text" && (
                      <div className="mt-2 space-y-1.5">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-silver/50">Text FX</p>
                        {([
                          { key: "curved", label: "Curved/Arched" },
                          { key: "outline", label: "Outline/Stroke" },
                          { key: "shadow", label: "Drop Shadow" },
                          { key: "distressed", label: "Vintage/Distressed" },
                        ] as { key: keyof TextFX; label: string }[]).map(({ key, label }) => (
                          <label key={key} className="flex items-center gap-2 font-mono text-[10px] text-silver/70 cursor-pointer">
                            <input type="checkbox" checked={selectedLayer.fx?.[key] ?? false}
                              onChange={(e) => updateLayer(selectedLayer.id, { fx: { ...selectedLayer.fx, [key]: e.target.checked } })}
                              className="accent-accent" />
                            {label}
                          </label>
                        ))}
                        <p className="font-mono text-[10px] text-accent">+${PRICE_MODIFIERS.fx} when FX active</p>
                      </div>
                    )}
                    <p className="font-mono text-[10px] text-accent">+${PRICE_MODIFIERS.text} when text present</p>
                  </div>
                </AccordionSection>

                <AccordionSection icon={<ImageIcon className="h-4 w-4" />} title="Image Upload">
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full border border-dashed border-border/60 py-8 flex flex-col items-center gap-2 text-silver/60 hover:border-accent hover:text-accent transition-colors">
                    <Upload className="h-6 w-6" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">Click to upload (5 MB)</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden
                    onChange={(e) => onFile(e.target.files?.[0])} />
                  <p className="font-mono text-[10px] text-accent mt-2">+${PRICE_MODIFIERS.image} when image present</p>
                </AccordionSection>
              </div>
            )}

            {/* Hardware tab */}
            {activeTab === "hardware" && (
              <div className="space-y-3">
                {state.subType === "skate" && (
                  <>
                    <AccordionSection icon={<Settings className="h-4 w-4" />} title="Deck Specs" defaultOpen>
                      <div className="space-y-3">
                        <div>
                          <label className={LABEL}>Deck Width</label>
                          <select value={state.specs["deck_width"] ?? ""} onChange={(e) => setSpec("deck_width", e.target.value)} className={SELECT_INPUT}>
                            <option value="">— Select —</option>
                            {['7.5"', '7.75"', '8.0"', '8.25"', '8.5"', '9.0"'].map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={LABEL}>Track Width</label>
                          <select value={state.specs["track_width"] ?? ""} onChange={(e) => setSpec("track_width", e.target.value)} className={SELECT_INPUT}>
                            <option value="">— Select —</option>
                            {['7.5"', '7.75"', '8.0"', '8.25"', '8.5"'].map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {trackWarning && (
                          <p className="font-mono text-[10px] text-destructive bg-destructive/10 border border-destructive/30 px-2 py-1.5">
                            ⚠ {trackWarning}
                          </p>
                        )}
                        <div>
                          <label className={LABEL}>Wheel Hardness</label>
                          <select value={state.specs["wheel_hardness"] ?? ""} onChange={(e) => setSpec("wheel_hardness", e.target.value)} className={SELECT_INPUT}>
                            <option value="">— Select —</option>
                            {WHEEL_HARDNESS.map((h) => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                      </div>
                    </AccordionSection>

                    <AccordionSection icon={<Grid3x3 className="h-4 w-4" />} title="Concave Profile">
                      <div className="space-y-2">
                        {CONCAVE_PROFILES.map((p) => (
                          <button key={p.id} onClick={() => setSkateSpec("concave", p.id)}
                            className={`w-full text-left px-3 py-2 border transition-colors ${state.skateSpecs.concave === p.id ? "border-accent bg-accent/10" : "border-border/60 hover:border-accent"}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">{p.label}</span>
                              {state.skateSpecs.concave === p.id && <span className="text-accent text-xs">✓</span>}
                            </div>
                            <p className="text-[10px] text-silver/60 mt-0.5">{p.description}</p>
                            {/* Cross-section preview */}
                            <svg viewBox="0 0 100 30" className="w-full h-6 mt-1">
                              <path
                                d={p.id === "mellow" ? "M5 20 Q50 12 95 20" : p.id === "medium" ? "M5 22 Q50 8 95 22" : "M5 25 Q50 4 95 25"}
                                fill="none" stroke="currentColor" strokeWidth="2"
                                className={state.skateSpecs.concave === p.id ? "text-accent" : "text-silver/40"}
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </AccordionSection>

                    <AccordionSection icon={<Palette className="h-4 w-4" />} title="Wheel Customizer">
                      <div className="space-y-3">
                        <div>
                          <label className={LABEL}>Core Color</label>
                          <div className="flex gap-1.5">
                            {BOLT_COLORS.map((c) => (
                              <button key={c} onClick={() => setSkateSpec("wheelCoreColor", c)}
                                className={`w-7 h-7 border-2 rounded-full ${state.skateSpecs.wheelCoreColor === c ? "border-accent scale-110" : "border-border/40"}`}
                                style={{ backgroundColor: c }} aria-label={c} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={LABEL}>Sidewall Graphic</label>
                          <input type="text" placeholder="Custom sidewall text"
                            value={state.skateSpecs.wheelSidewall ?? ""}
                            onChange={(e) => setSkateSpec("wheelSidewall", e.target.value)}
                            className="w-full px-2 py-1.5 bg-card border border-border/60 text-xs font-mono text-silver focus:outline-none focus:border-accent" />
                        </div>
                      </div>
                    </AccordionSection>

                    <AccordionSection icon={<Settings className="h-4 w-4" />} title="Hardware & Grip">
                      <div className="space-y-3">
                        <div>
                          <label className={LABEL}>Bolt Color</label>
                          <div className="flex gap-1.5">
                            {BOLT_COLORS.map((c) => (
                              <button key={c} onClick={() => setSkateSpec("boltColor", c)}
                                className={`w-7 h-7 border-2 ${state.skateSpecs.boltColor === c ? "border-accent scale-110" : "border-border/40"}`}
                                style={{ backgroundColor: c }} aria-label={c} />
                            ))}
                          </div>
                        </div>
                        <label className="flex items-center gap-2 font-mono text-[10px] text-silver/70 cursor-pointer">
                          <input type="checkbox" checked={state.skateSpecs.gripWindow ?? false}
                            onChange={(e) => setSkateSpec("gripWindow", e.target.checked)}
                            className="accent-accent" />
                          Grip tape window cutout
                        </label>
                      </div>
                    </AccordionSection>

                    <AccordionSection icon={<Grid3x3 className="h-4 w-4" />} title="Veneer Ply Colors">
                      <div className="space-y-3">
                        <div>
                          <label className={LABEL}>Top Ply Stain</label>
                          <div className="flex gap-1.5">
                            {VENEER_COLORS.map((c) => (
                              <button key={c} onClick={() => setSkateSpec("veneerTop", c)}
                                className={`w-7 h-7 border-2 ${state.skateSpecs.veneerTop === c ? "border-accent scale-110" : "border-border/40"}`}
                                style={{ backgroundColor: c }} aria-label={c} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={LABEL}>Middle Ply Stain</label>
                          <div className="flex gap-1.5">
                            {VENEER_COLORS.map((c) => (
                              <button key={c} onClick={() => setSkateSpec("veneerMid", c)}
                                className={`w-7 h-7 border-2 ${state.skateSpecs.veneerMid === c ? "border-accent scale-110" : "border-border/40"}`}
                                style={{ backgroundColor: c }} aria-label={c} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionSection>
                  </>
                )}

                {state.subType === "surf" && (
                  <>
                    <AccordionSection icon={<Settings className="h-4 w-4" />} title="Board Dimensions" defaultOpen>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <label className="block">
                            <span className={LABEL}>Length (in)</span>
                            <input type="number" value={state.surfSpecs.length ?? ""}
                              onChange={(e) => { setSurfSpec("length", e.target.value); setSurfSpec("volumeLiters", calcSurfVolume(e.target.value, state.surfSpecs.width ?? "", state.surfSpecs.thickness ?? "")); }}
                              className={NUM_INPUT} />
                          </label>
                          <label className="block">
                            <span className={LABEL}>Width (in)</span>
                            <input type="number" value={state.surfSpecs.width ?? ""}
                              onChange={(e) => { setSurfSpec("width", e.target.value); setSurfSpec("volumeLiters", calcSurfVolume(state.surfSpecs.length ?? "", e.target.value, state.surfSpecs.thickness ?? "")); }}
                              className={NUM_INPUT} />
                          </label>
                          <label className="block">
                            <span className={LABEL}>Thickness (in)</span>
                            <input type="number" step="0.1" value={state.surfSpecs.thickness ?? ""}
                              onChange={(e) => { setSurfSpec("thickness", e.target.value); setSurfSpec("volumeLiters", calcSurfVolume(state.surfSpecs.length ?? "", state.surfSpecs.width ?? "", e.target.value)); }}
                              className={NUM_INPUT} />
                          </label>
                        </div>
                        <div className="border border-accent/30 bg-accent/5 px-3 py-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-silver/60">Volume: </span>
                          <span className="font-display font-bold text-lg text-accent">{surfVolume} L</span>
                        </div>
                      </div>
                    </AccordionSection>

                    <AccordionSection icon={<Settings className="h-4 w-4" />} title="Fin Setup">
                      <div className="space-y-3">
                        <div>
                          <label className={LABEL}>Fin System</label>
                          <div className="space-y-1.5">
                            {FIN_SYSTEMS.map((f) => (
                              <button key={f.id} onClick={() => setSurfSpec("finSystem", f.id)}
                                className={`w-full text-left px-3 py-2 border ${state.surfSpecs.finSystem === f.id ? "border-accent bg-accent/10" : "border-border/60 hover:border-accent"}`}>
                                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">{f.label}</span>
                                <p className="text-[10px] text-silver/60">{f.description}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={LABEL}>Fin Color</label>
                          <div className="flex gap-1.5">
                            {FIN_COLORS.map((c) => (
                              <button key={c} onClick={() => setSurfSpec("finColor", c)}
                                className={`w-7 h-7 border-2 ${state.surfSpecs.finColor === c ? "border-accent scale-110" : "border-border/40"}`}
                                style={{ backgroundColor: c }} aria-label={c} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionSection>

                    <AccordionSection icon={<Palette className="h-4 w-4" />} title="Rail Spray & Stringer">
                      <div className="space-y-3">
                        <div>
                          <label className={LABEL}>Rail Spray Color</label>
                          <div className="flex gap-1.5 flex-wrap">
                            {RAIL_SPRAY_COLORS.map((c) => (
                              <button key={c} onClick={() => setSurfSpec("railSpray", c)}
                                className={`w-7 h-7 border-2 ${state.surfSpecs.railSpray === c ? "border-accent scale-110" : "border-border/40"}`}
                                style={{ backgroundColor: c === "none" ? "transparent" : c, borderStyle: c === "none" ? "dashed" : "solid" }}
                                aria-label={c} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={LABEL}>Stringer Accent</label>
                          <div className="flex gap-1.5 flex-wrap">
                            {STRINGER_COLORS.map((c) => (
                              <button key={c} onClick={() => setSurfSpec("stringerAccent", c)}
                                className={`w-7 h-7 border-2 ${state.surfSpecs.stringerAccent === c ? "border-accent scale-110" : "border-border/40"}`}
                                style={{ backgroundColor: c === "none" ? "transparent" : c, borderStyle: c === "none" ? "dashed" : "solid" }}
                                aria-label={c} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionSection>
                  </>
                )}

                {state.subType === "tee" || state.subType === "hoodie" ? (
                  <div className="border border-border/60 bg-card p-4 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-silver/40">
                      Hardware specs are for skate & surf only
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Stickers tab */}
            {activeTab === "stickers" && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-silver/40" />
                  <input value={stickerSearch} onChange={(e) => setStickerSearch(e.target.value)}
                    placeholder="Search stickers…"
                    className="w-full pl-7 pr-3 py-1.5 bg-card border border-border/60 text-xs font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-accent" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {STICKER_CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setStickerCategory(cat)}
                      className={`px-2 py-1 font-mono text-[9px] uppercase tracking-widest border ${
                        stickerCategory === cat ? "border-accent bg-accent/10 text-accent" : "border-border/40 text-silver/60 hover:border-accent"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {filteredStickers.map((st) => (
                    <button key={st.id} onClick={() => addStickerLayer(st)} title={st.name}
                      className="aspect-square border border-border/60 flex items-center justify-center text-lg hover:border-accent hover:bg-accent/10 transition-all">
                      {st.glyph}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price engine (always visible) */}
            <div className="border border-accent/40 bg-card p-4 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent flex items-center gap-2">
                <Eye className="h-3 w-3" /> Live Price
              </p>
              <ul className="space-y-1 font-mono text-xs">
                {breakdown.map((b) => (
                  <li key={b.label} className="flex justify-between text-silver/80">
                    <span>{b.label}</span><span>${b.amount}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border/40 pt-2 flex justify-between items-baseline">
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver/60">Total</span>
                <span className="font-display font-black text-2xl text-accent">${price.toFixed(2)}</span>
              </div>
              <button onClick={saveToGarage}
                className="w-full inline-flex items-center justify-center gap-2 border border-primary/40 text-primary font-mono text-xs uppercase tracking-widest py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Save className="h-4 w-4" /> Save to Garage
              </button>
            </div>
          </aside>

          {/* RIGHT: Canvas + Layers + Submit */}
          <section className="flex-1 w-full min-w-0">
            {/* View controllers + overlays */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-widest text-silver/60 mr-1">View:</span>
              {views.map((v) => (
                <button key={v.id} onClick={() => setView(v.id)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                    state.view === v.id ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"
                  }`}>
                  {v.label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-3">
                <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-silver/60 cursor-pointer">
                  <input type="checkbox" checked={state.showSafeArea} onChange={(e) => update("showSafeArea", e.target.checked)} className="accent-accent" />
                  Safe Area
                </label>
                <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-silver/60 cursor-pointer">
                  <input type="checkbox" checked={state.showScaleGuide} onChange={(e) => update("showScaleGuide", e.target.checked)} className="accent-accent" />
                  <User className="h-3 w-3" /> Scale Guide
                </label>
              </div>
            </div>

            {/* Canvas */}
            <div className="relative bg-secondary/30 border border-border/60 overflow-hidden" style={{ minHeight: "55vh" }}>
              <ProductCanvas state={state} selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId} onUpdateLayer={updateLayer} />
              {/* Scale guide silhouette */}
              {state.showScaleGuide && (
                <div className="absolute right-4 bottom-4 pointer-events-none opacity-40">
                  <svg viewBox="0 0 60 180" className="h-48 w-16">
                    <circle cx="30" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
                    <path d="M30 25 L30 90 M30 40 L15 55 M30 40 L45 55 M30 90 L20 140 M30 90 L40 140"
                      fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
                  </svg>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-primary/60 text-center mt-1">5'8" Reference</p>
                </div>
              )}
            </div>

            {/* Layers Panel */}
            <LayerPanel layers={state.layers} viewLayers={viewLayers} currentView={state.view}
              selectedLayerId={selectedLayerId} onSelect={setSelectedLayerId}
              onRemove={removeLayer} onDuplicate={duplicateLayer}
              onToggleLock={(id) => { const l = state.layers.find((x) => x.id === id); if (l) updateLayer(id, { locked: !l.locked }); }}
              onMoveZ={moveLayerZ} />

            {/* Submit Order */}
            <div className="mt-4 border border-accent/40 bg-card p-4 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent flex items-center gap-2">
                <Send className="h-3.5 w-3.5" /> Submit Custom Order
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Your email (for confirmation)"
                  className="px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-accent" />
                <input type="text" value={customerNote} onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Note for the team (optional)"
                  className="px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-accent" />
              </div>
              <div className="flex gap-2">
                <button onClick={submitOrder} disabled={submitting || !customerEmail.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-accent text-white font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity disabled:opacity-40">
                  <ShoppingCart className="h-4 w-4" /> {submitting ? "Submitting…" : `Submit — $${price.toFixed(2)}`}
                </button>
                <button onClick={downloadPng}
                  className="inline-flex items-center justify-center gap-1.5 border border-border/60 font-mono text-[10px] uppercase tracking-widest px-4 py-3 text-silver hover:border-accent">
                  <Download className="h-3.5 w-3.5" /> PNG
                </button>
                <button onClick={copyShareLink}
                  className="inline-flex items-center justify-center gap-1.5 border border-border/60 font-mono text-[10px] uppercase tracking-widest px-4 py-3 text-silver hover:border-accent">
                  <LinkIcon className="h-3.5 w-3.5" /> Share
                </button>
              </div>
              <button onClick={reset}
                className="w-full font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-accent py-1">
                <RotateCw className="h-3 w-3 inline mr-1" /> Reset studio
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ── Product Canvas ─────────────────────────────────────────────
function ProductCanvas({
  state, selectedLayerId, onSelectLayer, onUpdateLayer,
}: {
  state: DesignState;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, patch: Partial<DesignLayer>) => void;
}) {
  const { subType, view, baseColor, layers, texture, showSafeArea } = state;
  const isHardware = state.category === "hardware";
  const viewLayers = layers.filter((l) => l.view === view).sort((a, b) => a.zIndex - b.zIndex);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [snapGuides, setSnapGuides] = useState<{ v: number; h: number } | null>(null);

  const shape = isHardware
    ? subType === "skate" ? { width: "220px", height: "520px", borderRadius: "110px / 60px" }
    : { width: "180px", height: "560px", borderRadius: "90px / 40px" }
    : subType === "hoodie" ? { width: "420px", height: "440px", borderRadius: "8px" }
    : { width: "360px", height: "440px", borderRadius: "8px" };

  const isGrip = isHardware && view === "top";

  const textureStyle = useMemo(() => {
    switch (texture) {
      case "grip-tape": return "repeating-linear-gradient(45deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 4px)";
      case "maple-grain": return "repeating-linear-gradient(90deg, rgba(120,80,40,0.08) 0 3px, transparent 3px 12px)";
      case "fiberglass": return "linear-gradient(105deg, rgba(255,255,255,0.12) 0%, transparent 30%, rgba(255,255,255,0.08) 60%, transparent 90%)";
      case "cotton-weave": return "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px)";
      default: return "none";
    }
  }, [texture]);

  const onPointerDown = (e: React.PointerEvent, layer: DesignLayer) => {
    if (layer.locked) return;
    e.stopPropagation();
    onSelectLayer(layer.id);
    dragRef.current = { id: layer.id, startX: e.clientX, startY: e.clientY, origX: layer.x, origY: layer.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
    let newX = dragRef.current.origX + dx;
    let newY = dragRef.current.origY + dy;
    const snapV = Math.abs(newX - 50) < 3 ? 50 : null;
    const snapH = Math.abs(newY - 50) < 3 ? 50 : null;
    if (snapV !== null) newX = snapV;
    if (snapH !== null) newY = snapH;
    setSnapGuides(snapV !== null || snapH !== null ? { v: snapV ?? -1, h: snapH ?? -1 } : null);
    onUpdateLayer(dragRef.current.id, { x: newX, y: newY });
  };

  const onPointerUp = () => { dragRef.current = null; setSnapGuides(null); };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6"
      onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <div ref={canvasRef} className="relative shadow-2xl transition-colors"
        style={{ ...shape, backgroundColor: baseColor, backgroundImage: textureStyle }}
        onClick={() => onSelectLayer(null)}>
        <canvas id="ds-canvas-export" className="hidden" width={800} height={800} />

        {showSafeArea && (
          <div className="absolute border-2 border-dashed border-accent/40 pointer-events-none"
            style={{ inset: isHardware ? "8%" : "12%", borderRadius: isHardware ? "inherit" : "4px" }}>
            <span className="absolute -top-5 left-0 font-mono text-[8px] uppercase tracking-widest text-accent/60">Safe print zone</span>
          </div>
        )}

        {snapGuides && (
          <>
            {snapGuides.v >= 0 && <div className="absolute top-0 bottom-0 w-px bg-accent/50 pointer-events-none" style={{ left: `${snapGuides.v}%` }} />}
            {snapGuides.h >= 0 && <div className="absolute left-0 right-0 h-px bg-accent/50 pointer-events-none" style={{ top: `${snapGuides.h}%` }} />}
          </>
        )}

        {!isHardware && view === "sleeve" && (
          <div className="absolute -right-2 top-12 w-16 h-24 border-2 border-silver/40 rounded-sm bg-card/80 flex items-center justify-center">
            <span className="font-mono text-[8px] uppercase tracking-widest text-silver/60 text-center">Left<br />Sleeve</span>
          </div>
        )}

        <span className="absolute -top-6 left-0 font-mono text-[9px] uppercase tracking-widest text-silver/60">{subType} · {view}</span>

        {viewLayers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          const baseStyle: React.CSSProperties = {
            left: `${layer.x}%`, top: `${layer.y}%`,
            transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
            opacity: layer.opacity, zIndex: layer.zIndex,
            mixBlendMode: layer.blendMode !== "normal" ? layer.blendMode as React.CSSProperties["mixBlendMode"] : "normal",
          };

          let content: React.ReactNode;
          if (layer.type === "image") {
            content = <img src={layer.value} alt="" className="max-w-[80%] max-h-[40%] object-contain mix-blend-multiply pointer-events-none" />;
          } else if (layer.type === "sticker" || layer.type === "preset") {
            content = <div className="px-3 py-1 font-mono text-2xl" style={{ color: isGrip ? "#fff" : "#111" }}>{layer.value}</div>;
          } else {
            const fx = layer.fx;
            const textStyle: React.CSSProperties = {
              color: isGrip ? "#fff" : contrastText(baseColor),
              fontSize: subType === "tee" ? "26px" : "20px",
              textShadow: isGrip ? "0 1px 2px rgba(0,0,0,0.6)" : fx?.shadow ? "2px 2px 4px rgba(0,0,0,0.5)" : "none",
              WebkitTextStroke: fx?.outline ? "1px rgba(0,0,0,0.6)" : "0",
              filter: fx?.distressed ? "contrast(1.4) brightness(0.8)" : "none",
            };
            content = fx?.curved ? (
              <svg viewBox="0 0 200 60" className="w-32 h-10 pointer-events-none">
                <defs><path id={`curve-${layer.id}`} d="M 10 50 Q 100 10 190 50" fill="none" /></defs>
                <text style={textStyle} className="font-display font-black">
                  <textPath href={`#curve-${layer.id}`} startOffset="50%" textAnchor="middle">{layer.value}</textPath>
                </text>
              </svg>
            ) : (
              <span className="font-display font-black text-center px-2 pointer-events-none" style={textStyle}>{layer.value}</span>
            );
          }

          return (
            <div key={layer.id}
              className={`absolute cursor-move select-none ${isSelected ? "ring-2 ring-accent" : ""} ${layer.locked ? "cursor-not-allowed" : ""}`}
              style={baseStyle}
              onPointerDown={(e) => onPointerDown(e, layer)}>
              {content}
              {isSelected && !layer.locked && (
                <>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-[10px] font-bold touch-none">↻</div>
                  <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-white text-[10px] touch-none">×</div>
                </>
              )}
            </div>
          );
        })}

        {viewLayers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-60"
              style={{ color: isGrip ? "#fff" : contrastText(baseColor) }}>
              Add layers from the toolkit →
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Layer Panel ───────────────────────────────────────────────
function LayerPanel({
  layers, viewLayers, currentView, selectedLayerId, onSelect, onRemove, onDuplicate, onToggleLock, onMoveZ,
}: {
  layers: DesignLayer[];
  viewLayers: DesignLayer[];
  currentView: ViewId;
  selectedLayerId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleLock: (id: string) => void;
  onMoveZ: (id: string, dir: "up" | "down") => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const sorted = [...viewLayers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="mt-4 border border-border/60 bg-card">
      <div className="px-4 py-2.5 border-b border-border/40 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" /> Layers ({viewLayers.length})
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-silver/40">{currentView} view</span>
      </div>
      {sorted.length === 0 ? (
        <p className="px-4 py-3 font-mono text-[10px] text-silver/40">No layers on this view</p>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {sorted.map((l, idx) => (
            <div key={l.id} draggable onDragStart={() => setDragId(l.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId && dragId !== l.id) { /* reorder */ } setDragId(null); }}
              onClick={() => onSelect(l.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b border-border/30 cursor-pointer transition-colors ${selectedLayerId === l.id ? "bg-accent/10" : "hover:bg-secondary/50"}`}>
              <span className="text-silver/30 font-mono text-[10px]">{idx + 1}</span>
              <span className="text-primary uppercase font-mono text-[10px]">
                {l.type === "text" ? "TXT" : l.type === "image" ? "IMG" : "STK"}
              </span>
              <span className="flex-1 truncate text-xs font-mono text-silver/80">
                {l.type === "image" ? "Uploaded image" : l.value}
              </span>
              <button onClick={(e) => { e.stopPropagation(); onMoveZ(l.id, "up"); }} className="text-silver/50 hover:text-accent"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); onMoveZ(l.id, "down"); }} className="text-silver/50 hover:text-accent"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); onToggleLock(l.id); }} className="text-silver/50 hover:text-accent">
                {l.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDuplicate(l.id); }} className="text-silver/50 hover:text-accent"><Copy className="h-3.5 w-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); onRemove(l.id); }} className="text-silver/50 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────
const QUICK_BTN = "inline-flex items-center justify-center gap-1.5 px-2 py-2 font-mono text-[10px] uppercase tracking-widest border border-border/60 text-silver hover:border-accent hover:text-accent transition-colors";
const LABEL = "block font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1";
const NUM_INPUT = "w-full px-2 py-1.5 bg-card border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-accent";
const SELECT_INPUT = "w-full px-3 py-2 bg-card border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-accent";

function ToolbarBtn({ onClick, disabled, title, children }: {
  onClick: () => void; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className="p-2 border border-border/60 text-silver hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}

function AccordionSection({ icon, title, defaultOpen = false, children }: {
  icon: React.ReactNode; title: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border/60 bg-card">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
          {icon} {title}
        </span>
        <ChevronDown className={`h-4 w-4 text-silver/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Upload,
  ShoppingCart,
  Palette,
  Settings,
  Type,
  Image as ImageIcon,
  Sparkles,
  Eye,
  RotateCw,
  ChevronDown,
  Undo2,
  Redo2,
  FlipHorizontal2,
  FlipVertical2,
  MoveHorizontal,
  MoveVertical,
  Maximize2,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Copy,
  Download,
  Link as LinkIcon,
  Search,
  Grid3x3,
  Sticker,
} from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/hooks/use-cart";
import {
  type ProductCategory,
  type ProductSubType,
  type ViewId,
  type DesignState,
  type DesignLayer,
  type TextureOverlay,
  type TextFX,
  type StickerPack,
  BASE_PRICES,
  PRICE_MODIFIERS,
  BASE_COLORS,
  COLOR_PALETTES,
  STICKERS,
  STICKER_CATEGORIES,
  TEXTURES,
  SKATE_SPECS,
  SURF_SPECS,
  PRESETS,
  HARDWARE_VIEWS,
  APPAREL_VIEWS,
  defaultDesignState,
  makeLayer,
  calculatePrice,
  priceBreakdown,
  saveCustomDesign,
  validateTrackWidth,
  encodeDesignToUrl,
  decodeDesignFromUrl,
  type SavedDesign,
} from "@/lib/design-studio";

export const Route = createFileRoute("/design-studio")({
  head: () => ({
    meta: [
      { title: "Design Studio — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "Custom-build your own skate deck, surfboard, tee or hoodie. Live preview, real-time pricing, push to cart.",
      },
    ],
  }),
  component: DesignStudioPage,
});

// ── History hook ──────────────────────────────────────────────
function useHistory<T>(initial: T) {
  const [present, setPresentState] = useState<T>(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);

  const set = useCallback(
    (updater: T | ((prev: T) => T), record = true) => {
      setPresentState((prev) => {
        const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
        if (record && next !== prev) {
          past.current.push(prev);
          if (past.current.length > 50) past.current.shift();
          future.current = [];
        }
        return next;
      });
    },
    [],
  );

  const undo = useCallback(() => {
    setPresentState((prev) => {
      if (past.current.length === 0) return prev;
      const previous = past.current.pop()!;
      future.current.push(prev);
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setPresentState((prev) => {
      if (future.current.length === 0) return prev;
      const next = future.current.pop()!;
      past.current.push(prev);
      return next;
    });
  }, []);

  const canUndo = past.current.length > 0;
  const canRedo = future.current.length > 0;

  return { state: present, set, undo, redo, canUndo, canRedo };
}

// ── Page ───────────────────────────────────────────────────────
function DesignStudioPage() {
  const { state, set, undo, redo, canUndo, canRedo } = useHistory<DesignState>(defaultDesignState());
  const [textDraft, setTextDraft] = useState("");
  const [presetPanel, setPresetPanel] = useState<string | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [stickerSearch, setStickerSearch] = useState("");
  const [stickerCategory, setStickerCategory] = useState<(typeof STICKER_CATEGORIES)[number]>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { add: cartAdd } = useCart();

  const price = useMemo(() => calculatePrice(state), [state]);
  const breakdown = useMemo(() => priceBreakdown(state), [state]);

  const update = useCallback(
    <K extends keyof DesignState>(key: K, value: DesignState[K]) =>
      set((s) => ({ ...s, [key]: value }), true),
    [set],
  );

  const setCategory = (category: ProductCategory) => {
    const subType: ProductSubType =
      category === "hardware"
        ? state.subType === "surf"
          ? "surf"
          : "skate"
        : state.subType === "hoodie"
          ? "hoodie"
          : "tee";
    const view: ViewId = category === "hardware" ? "top" : "front";
    set((s) => ({ ...s, category, subType, view, specs: {}, layers: [] }), true);
    setSelectedLayerId(null);
  };

  const setSubType = (subType: ProductSubType) => {
    set((s) => ({ ...s, subType, specs: {}, layers: [] }), true);
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

  const addPresetLayer = (presetId: string) => {
    const layer = makeLayer("preset", presetId, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setPresetPanel(presetId);
    setSelectedLayerId(layer.id);
  };

  const addStickerLayer = (sticker: StickerPack) => {
    const layer = makeLayer("preset", sticker.glyph, state.view, nextZ());
    update("layers", [...state.layers, layer]);
    setSelectedLayerId(layer.id);
  };

  const updateLayer = (id: string, patch: Partial<DesignLayer>) => {
    set(
      (s) => ({
        ...s,
        layers: s.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      }),
      true,
    );
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
    set(
      (s) => ({
        ...s,
        layers: s.layers.map((l) => {
          if (l.id !== id) return l;
          return { ...l, zIndex: l.zIndex + (dir === "up" ? 1 : -1) };
        }),
      }),
      true,
    );
  };

  const reorderLayers = (fromId: string, toId: string) => {
    set(
      (s) => {
        const layers = [...s.layers];
        const fromIdx = layers.findIndex((l) => l.id === fromId);
        const toIdx = layers.findIndex((l) => l.id === toId);
        if (fromIdx === -1 || toIdx === -1) return s;
        const [moved] = layers.splice(fromIdx, 1);
        layers.splice(toIdx, 0, moved);
        return { ...s, layers };
      },
      true,
    );
  };

  const onFile = (file: File | undefined) => {
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

  const setSpec = (key: string, value: string) =>
    update("specs", { ...state.specs, [key]: value });

  const trackWarning = validateTrackWidth(state.specs["deck_width"], state.specs["track_width"]);

  const pushToCart = () => {
    const slug = `custom-${state.subType}-${Date.now()}`;
    const saved: SavedDesign = {
      id: slug,
      slug,
      subType: state.subType,
      price,
      baseColor: state.baseColor,
      text: state.layers.find((l) => l.type === "text")?.value ?? "",
      image: state.layers.find((l) => l.type === "image")?.value ?? null,
      preset: state.layers.find((l) => l.type === "preset")?.value ?? null,
      specs: state.specs,
      createdAt: new Date().toISOString(),
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
    const canvasEl = document.getElementById("ds-canvas-export") as HTMLCanvasElement | null;
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
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Shareable design link copied"))
      .catch(() => toast.error("Could not copy link"));
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

  const views =
    state.category === "hardware"
      ? (HARDWARE_VIEWS as { id: ViewId; label: string }[])
      : (APPAREL_VIEWS as { id: ViewId; label: string }[]);

  const specsList = state.subType === "skate" ? SKATE_SPECS : state.subType === "surf" ? SURF_SPECS : [];

  const availableTextures = TEXTURES.filter((t) => t.subTypes.includes(state.subType));

  const filteredStickers = STICKERS.filter((s) => {
    const matchesCategory = stickerCategory === "all" || s.category === stickerCategory;
    const matchesSearch =
      !stickerSearch || s.name.toLowerCase().includes(stickerSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        {/* Hero / header */}
        <section className="border-b border-border/40 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Studio · Make it yours
            </p>
            <h1 className="font-display font-black text-4xl lg:text-6xl leading-none mb-3">
              DESIGN STUDIO
            </h1>
            <p className="text-silver/70 max-w-2xl text-sm">
              Build a custom deck, surfboard, tee or hoodie. Flip between views, stack layers, lock
              your specs — price updates live as you go.
            </p>
          </div>
        </section>

        {/* Product toggle + toolbar */}
        <div className="border-b border-border/40 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2">
            {(
              [
                { key: "hardware" as const, label: "Hardware (Skate/Surf)" },
                { key: "apparel" as const, label: "Apparel (Hoodie/Tee)" },
              ] as const
            ).map(({ key, label }) => (
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

            {/* Sub-type */}
            <div className="flex items-center gap-2">
              {state.category === "hardware" ? (
                <>
                  {(["skate", "surf"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubType(s)}
                      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border ${
                        state.subType === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 text-silver hover:border-primary"
                      }`}
                    >
                      {s === "skate" ? "Skate Deck" : "Surfboard"}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {(["tee", "hoodie"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubType(s)}
                      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border ${
                        state.subType === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 text-silver hover:border-primary"
                      }`}
                    >
                      {s === "tee" ? "T-Shirt" : "Hoodie"}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* History + export toolbar */}
            <div className="ml-auto flex items-center gap-1.5">
              <ToolbarBtn onClick={undo} disabled={!canUndo} title="Undo">
                <Undo2 className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={redo} disabled={!canRedo} title="Redo">
                <Redo2 className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border/40 mx-1" />
              <ToolbarBtn onClick={downloadPng} title="Download PNG">
                <Download className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={copyShareLink} title="Copy share link">
                <LinkIcon className="h-4 w-4" />
              </ToolbarBtn>
            </div>
          </div>
        </div>

        {/* Dual-column layout */}
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT: Creator Toolkit (350px) */}
          <aside className="w-full lg:w-[350px] shrink-0 space-y-3">
            {/* Quick Positioning Controls */}
            {selectedLayer && (
              <AccordionSection icon={<MoveHorizontal className="h-4 w-4" />} title="Position & Transform" defaultOpen>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateLayer(selectedLayer.id, { x: 50 })} className={QUICK_BTN}>
                      <MoveHorizontal className="h-3 w-3" /> Center H
                    </button>
                    <button onClick={() => updateLayer(selectedLayer.id, { y: 50 })} className={QUICK_BTN}>
                      <MoveVertical className="h-3 w-3" /> Center V
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
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className={LABEL}>X (%)</span>
                      <input
                        type="number"
                        value={Math.round(selectedLayer.x)}
                        onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })}
                        className={NUM_INPUT}
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL}>Y (%)</span>
                      <input
                        type="number"
                        value={Math.round(selectedLayer.y)}
                        onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })}
                        className={NUM_INPUT}
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL}>Scale</span>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedLayer.scale.toFixed(1)}
                        onChange={(e) => updateLayer(selectedLayer.id, { scale: Number(e.target.value) })}
                        className={NUM_INPUT}
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL}>Rotation°</span>
                      <input
                        type="number"
                        value={selectedLayer.rotation}
                        onChange={(e) => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                        className={NUM_INPUT}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className={LABEL}>Opacity: {Math.round(selectedLayer.opacity * 100)}%</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={selectedLayer.opacity}
                      onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </label>
                </div>
              </AccordionSection>
            )}

            <AccordionSection icon={<Palette className="h-4 w-4" />} title="Base Colour" defaultOpen>
              <div className="grid grid-cols-4 gap-2">
                {BASE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => update("baseColor", c.value)}
                    title={c.name}
                    className={`aspect-square border-2 transition-all ${
                      state.baseColor === c.value
                        ? "border-primary scale-105"
                        : "border-border/40 hover:border-silver"
                    }`}
                    style={{ backgroundColor: c.value }}
                    aria-label={c.name}
                  />
                ))}
              </div>
              <p className="font-mono text-[10px] text-silver/50 mt-2">
                {BASE_COLORS.find((c) => c.value === state.baseColor)?.name ?? "Custom"}
              </p>
              {/* Curated palettes */}
              <div className="mt-3">
                <button
                  onClick={() => setPaletteOpen((o) => !o)}
                  className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
                >
                  {paletteOpen ? "Hide" : "Show"} curated palettes
                </button>
                {paletteOpen && (
                  <div className="mt-2 space-y-2">
                    {COLOR_PALETTES.map((pal) => (
                      <div key={pal.name}>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1">{pal.name}</p>
                        <div className="flex gap-1.5">
                          {pal.colors.map((c) => (
                            <button
                              key={c}
                              onClick={() => update("baseColor", c)}
                              className="w-7 h-7 border border-border/40 hover:border-primary hover:scale-110 transition-all"
                              style={{ backgroundColor: c }}
                              aria-label={c}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AccordionSection>

            {/* Texture Overlays */}
            {availableTextures.length > 1 && (
              <AccordionSection icon={<Grid3x3 className="h-4 w-4" />} title="Material Texture">
                <div className="space-y-2">
                  {availableTextures.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => update("texture", t.id as TextureOverlay)}
                      className={`w-full text-left px-3 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                        state.texture === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 text-silver hover:border-primary"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </AccordionSection>
            )}

            {specsList.length > 0 && (
              <AccordionSection icon={<Settings className="h-4 w-4" />} title="Equipment Specs" defaultOpen>
                <div className="space-y-3">
                  {specsList.map((spec) => (
                    <div key={spec.key}>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-1.5">
                        {spec.label}
                      </label>
                      <select
                        value={state.specs[spec.key] ?? ""}
                        onChange={(e) => setSpec(spec.key, e.target.value)}
                        className="w-full px-3 py-2 bg-card border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary"
                      >
                        <option value="">— Select —</option>
                        {spec.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {trackWarning && (
                    <p className="font-mono text-[10px] text-destructive bg-destructive/10 border border-destructive/30 px-2 py-1.5">
                      ⚠ {trackWarning}
                    </p>
                  )}
                  <p className="font-mono text-[10px] text-primary">
                    +${PRICE_MODIFIERS.specs} when specs locked
                  </p>
                </div>
              </AccordionSection>
            )}

            <AccordionSection icon={<Type className="h-4 w-4" />} title="Custom Text" defaultOpen>
              <div className="space-y-2">
                <input
                  value={textDraft}
                  onChange={(e) => setTextDraft(e.target.value.slice(0, 40))}
                  onKeyDown={(e) => e.key === "Enter" && addTextLayer()}
                  placeholder="Type your text (max 40)"
                  className="w-full px-3 py-2 bg-card border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                />
                <button
                  onClick={addTextLayer}
                  disabled={!textDraft.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary/10 border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-widest py-2 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" /> Add to {state.view}
                </button>
                {/* Text FX toggles */}
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
                        <input
                          type="checkbox"
                          checked={selectedLayer.fx?.[key] ?? false}
                          onChange={(e) =>
                            updateLayer(selectedLayer.id, {
                              fx: { ...selectedLayer.fx, [key]: e.target.checked },
                            })
                          }
                          className="accent-primary"
                        />
                        {label}
                      </label>
                    ))}
                    <p className="font-mono text-[10px] text-primary">+${PRICE_MODIFIERS.fx} when FX active</p>
                  </div>
                )}
                <p className="font-mono text-[10px] text-primary">
                  +${PRICE_MODIFIERS.text} when text present
                </p>
              </div>
            </AccordionSection>

            <AccordionSection icon={<ImageIcon className="h-4 w-4" />} title="Image Upload">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-border/60 py-8 flex flex-col items-center gap-2 text-silver/60 hover:border-primary hover:text-primary transition-colors"
              >
                <Upload className="h-6 w-6" />
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  Drop / click to upload (5 MB)
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                hidden
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <p className="font-mono text-[10px] text-primary mt-2">
                +${PRICE_MODIFIERS.image} when image present
              </p>
            </AccordionSection>

            {/* Sticker Library */}
            <AccordionSection icon={<Sticker className="h-4 w-4" />} title="Sticker Library">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-silver/40" />
                  <input
                    value={stickerSearch}
                    onChange={(e) => setStickerSearch(e.target.value)}
                    placeholder="Search stickers…"
                    className="w-full pl-7 pr-3 py-1.5 bg-card border border-border/60 text-xs font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {STICKER_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setStickerCategory(cat)}
                      className={`px-2 py-1 font-mono text-[9px] uppercase tracking-widest border ${
                        stickerCategory === cat
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/40 text-silver/60 hover:border-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {filteredStickers.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => addStickerLayer(st)}
                      title={st.name}
                      className="aspect-square border border-border/60 flex items-center justify-center text-lg hover:border-primary hover:bg-primary/10 transition-all"
                    >
                      {st.glyph}
                    </button>
                  ))}
                </div>
              </div>
            </AccordionSection>

            <AccordionSection icon={<Sparkles className="h-4 w-4" />} title="Preset Gallery">
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => addPresetLayer(preset.id)}
                    className={`aspect-square border flex items-center justify-center text-center p-1 font-mono text-[9px] uppercase tracking-widest transition-all ${
                      presetPanel === preset.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-silver/70 hover:border-primary"
                    }`}
                    title={preset.name}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </AccordionSection>

            {/* Price engine */}
            <div className="border border-primary/40 bg-card p-4 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-2">
                <Eye className="h-3 w-3" /> Live Price
              </p>
              <ul className="space-y-1 font-mono text-xs">
                {breakdown.map((b) => (
                  <li key={b.label} className="flex justify-between text-silver/80">
                    <span>{b.label}</span>
                    <span>${b.amount}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border/40 pt-2 flex justify-between items-baseline">
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver/60">
                  Total
                </span>
                <span className="font-display font-black text-2xl text-primary">
                  ${price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={pushToCart}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </button>
              <div className="flex gap-2">
                <button
                  onClick={downloadPng}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 border border-border/60 font-mono text-[10px] uppercase tracking-widest py-2 text-silver hover:border-primary"
                >
                  <Download className="h-3 w-3" /> PNG
                </button>
                <button
                  onClick={copyShareLink}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 border border-border/60 font-mono text-[10px] uppercase tracking-widest py-2 text-silver hover:border-primary"
                >
                  <LinkIcon className="h-3 w-3" /> Share
                </button>
              </div>
              <button
                onClick={reset}
                className="w-full font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary py-1"
              >
                <RotateCw className="h-3 w-3 inline mr-1" /> Reset studio
              </button>
            </div>
          </aside>

          {/* RIGHT: Canvas + Layers Panel */}
          <section className="flex-1 w-full min-w-0">
            {/* View flip controllers + safe area toggle */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-widest text-silver/60 mr-1">
                View:
              </span>
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                    state.view === v.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-silver hover:border-primary"
                  }`}
                >
                  {v.label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-silver/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.showSafeArea}
                    onChange={(e) => update("showSafeArea", e.target.checked)}
                    className="accent-primary"
                  />
                  Safe Area
                </label>
              </div>
            </div>

            {/* Canvas viewport */}
            <div
              className="relative bg-silver/30 border border-border/60 overflow-hidden"
              style={{ minHeight: "60vh" }}
            >
              <ProductCanvas
                state={state}
                selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId}
                onUpdateLayer={updateLayer}
              />
            </div>

            {/* Layers Panel */}
            <LayerPanel
              layers={state.layers}
              viewLayers={viewLayers}
              currentView={state.view}
              selectedLayerId={selectedLayerId}
              onSelect={setSelectedLayerId}
              onRemove={removeLayer}
              onDuplicate={duplicateLayer}
              onToggleLock={(id) => {
                const l = state.layers.find((x) => x.id === id);
                if (l) updateLayer(id, { locked: !l.locked });
              }}
              onMoveZ={moveLayerZ}
              onReorder={reorderLayers}
            />

            {/* Layer isolation legend */}
            <div className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-silver/50">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" /> Current view isolated
              </span>
              <span>·</span>
              <span>
                {state.category === "hardware" ? "Grip / Graphic" : "Front / Back / Sleeve"} — layers stay per view
              </span>
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
  state,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
}: {
  state: DesignState;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, patch: Partial<DesignLayer>) => void;
}) {
  const { subType, view, baseColor, layers, texture, showSafeArea } = state;
  const isHardware = state.category === "hardware";
  const viewLayers = layers
    .filter((l) => l.view === view)
    .sort((a, b) => a.zIndex - b.zIndex);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [snapGuides, setSnapGuides] = useState<{ v: number; h: number } | null>(null);

  const shape = isHardware
    ? subType === "skate"
      ? { width: "220px", height: "520px", borderRadius: "110px / 60px" }
      : { width: "180px", height: "560px", borderRadius: "90px / 40px" }
    : subType === "hoodie"
      ? { width: "420px", height: "440px", borderRadius: "8px" }
      : { width: "360px", height: "440px", borderRadius: "8px" };

  const isGrip = isHardware && view === "top";

  const textureStyle = useMemo(() => {
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

  const onPointerDown = (e: React.PointerEvent, layer: DesignLayer) => {
    if (layer.locked) return;
    e.stopPropagation();
    onSelectLayer(layer.id);
    dragRef.current = {
      id: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: layer.x,
      origY: layer.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
    let newX = dragRef.current.origX + dx;
    let newY = dragRef.current.origY + dy;
    // Snap guides
    const snapV = Math.abs(newX - 50) < 3 ? 50 : null;
    const snapH = Math.abs(newY - 50) < 3 ? 50 : null;
    if (snapV !== null) newX = snapV;
    if (snapH !== null) newY = snapH;
    setSnapGuides(snapV !== null || snapH !== null ? { v: snapV ?? -1, h: snapH ?? -1 } : null);
    onUpdateLayer(dragRef.current.id, { x: newX, y: newY });
  };

  const onPointerUp = () => {
    dragRef.current = null;
    setSnapGuides(null);
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-6"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        ref={canvasRef}
        className="relative shadow-2xl transition-colors"
        style={{
          ...shape,
          backgroundColor: baseColor,
          backgroundImage: textureStyle,
        }}
        onClick={() => onSelectLayer(null)}
      >
        {/* Hidden export canvas */}
        <canvas id="ds-canvas-export" className="hidden" width={800} height={800} />

        {/* Safe area overlay */}
        {showSafeArea && (
          <div
            className="absolute border-2 border-dashed border-primary/40 pointer-events-none"
            style={{
              inset: isHardware ? "8%" : "12%",
              borderRadius: isHardware ? "inherit" : "4px",
            }}
          >
            <span className="absolute -top-5 left-0 font-mono text-[8px] uppercase tracking-widest text-primary/60">
              Safe print zone
            </span>
          </div>
        )}

        {/* Snap guides */}
        {snapGuides && (
          <>
            {snapGuides.v >= 0 && (
              <div
                className="absolute top-0 bottom-0 w-px bg-primary/50 pointer-events-none"
                style={{ left: `${snapGuides.v}%` }}
              />
            )}
            {snapGuides.h >= 0 && (
              <div
                className="absolute left-0 right-0 h-px bg-primary/50 pointer-events-none"
                style={{ top: `${snapGuides.h}%` }}
              />
            )}
          </>
        )}

        {/* Apparel sleeve badge */}
        {!isHardware && view === "sleeve" && (
          <div className="absolute -right-2 top-12 w-16 h-24 border-2 border-silver/40 rounded-sm bg-card/80 flex items-center justify-center">
            <span className="font-mono text-[8px] uppercase tracking-widest text-silver/60 text-center">
              Left<br />Sleeve
            </span>
          </div>
        )}

        {/* View label */}
        <span className="absolute -top-6 left-0 font-mono text-[9px] uppercase tracking-widest text-silver/60">
          {subType} · {view}
        </span>

        {/* Layers rendered on canvas */}
        {viewLayers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          const baseStyle: React.CSSProperties = {
            left: `${layer.x}%`,
            top: `${layer.y}%`,
            transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
            opacity: layer.opacity,
            zIndex: layer.zIndex,
          };

          let content: React.ReactNode;
          if (layer.type === "image") {
            content = (
              <img
                src={layer.value}
                alt=""
                className="max-w-[80%] max-h-[40%] object-contain mix-blend-multiply pointer-events-none"
              />
            );
          } else if (layer.type === "preset") {
            content = (
              <div
                className="px-3 py-1 font-mono text-2xl uppercase tracking-widest border"
                style={{
                  color: isGrip ? "#fff" : "#111",
                  borderColor: isGrip ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                }}
              >
                {layer.value}
              </div>
            );
          } else {
            // text
            const fx = layer.fx;
            const textStyle: React.CSSProperties = {
              color: isGrip ? "#fff" : contrastText(baseColor),
              fontSize: subType === "tee" ? "26px" : "20px",
              textShadow: isGrip
                ? "0 1px 2px rgba(0,0,0,0.6)"
                : fx?.shadow
                  ? "2px 2px 4px rgba(0,0,0,0.5)"
                  : "none",
              WebkitTextStroke: fx?.outline ? "1px rgba(0,0,0,0.6)" : "0",
              filter: fx?.distressed ? "contrast(1.4) brightness(0.8)" : "none",
            };
            content = fx?.curved ? (
              <svg viewBox="0 0 200 60" className="w-32 h-10 pointer-events-none">
                <defs>
                  <path id={`curve-${layer.id}`} d="M 10 50 Q 100 10 190 50" fill="none" />
                </defs>
                <text style={textStyle} className="font-display font-black">
                  <textPath href={`#curve-${layer.id}`} startOffset="50%" textAnchor="middle">
                    {layer.value}
                  </textPath>
                </text>
              </svg>
            ) : (
              <span className="font-display font-black text-center px-2 pointer-events-none" style={textStyle}>
                {layer.value}
              </span>
            );
          }

          return (
            <div
              key={layer.id}
              className={`absolute cursor-move select-none ${isSelected ? "ring-2 ring-primary" : ""} ${layer.locked ? "cursor-not-allowed" : ""}`}
              style={baseStyle}
              onPointerDown={(e) => onPointerDown(e, layer)}
            >
              {content}
              {/* Touch-optimized handles */}
              {isSelected && !layer.locked && (
                <>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-[10px] font-bold touch-none">
                    ↻
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-primary-foreground text-[10px] touch-none">
                    ×
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Empty hint */}
        {viewLayers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <p
              className="font-mono text-[10px] uppercase tracking-widest opacity-60"
              style={{ color: isGrip ? "#fff" : contrastText(baseColor) }}
            >
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
  layers,
  viewLayers,
  currentView,
  selectedLayerId,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleLock,
  onMoveZ,
  onReorder,
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
  onReorder: (fromId: string, toId: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const sorted = [...viewLayers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="mt-4 border border-border/60 bg-card">
      <div className="px-4 py-2.5 border-b border-border/40 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Layers ({viewLayers.length})
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-silver/40">
          {currentView} view
        </span>
      </div>
      {sorted.length === 0 ? (
        <p className="px-4 py-3 font-mono text-[10px] text-silver/40">No layers on this view</p>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {sorted.map((l, idx) => (
            <div
              key={l.id}
              draggable
              onDragStart={() => setDragId(l.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId && dragId !== l.id) onReorder(dragId, l.id);
                setDragId(null);
              }}
              onClick={() => onSelect(l.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b border-border/30 cursor-pointer transition-colors ${
                selectedLayerId === l.id ? "bg-primary/10" : "hover:bg-silver/5"
              }`}
            >
              <span className="text-silver/30 font-mono text-[10px]">{idx + 1}</span>
              <span className="text-primary uppercase font-mono text-[10px]">
                {l.type === "text" ? "TXT" : l.type === "image" ? "IMG" : "STK"}
              </span>
              <span className="flex-1 truncate text-xs font-mono text-silver/80">
                {l.type === "image" ? "Uploaded image" : l.value}
              </span>
              <button onClick={(e) => { e.stopPropagation(); onMoveZ(l.id, "up"); }} className="text-silver/50 hover:text-primary" aria-label="Bring forward">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onMoveZ(l.id, "down"); }} className="text-silver/50 hover:text-primary" aria-label="Send backward">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onToggleLock(l.id); }} className="text-silver/50 hover:text-primary" aria-label="Toggle lock">
                {l.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDuplicate(l.id); }} className="text-silver/50 hover:text-primary" aria-label="Duplicate">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onRemove(l.id); }} className="text-silver/50 hover:text-destructive" aria-label="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shared UI bits ────────────────────────────────────────────
const QUICK_BTN =
  "inline-flex items-center justify-center gap-1.5 px-2 py-2 font-mono text-[10px] uppercase tracking-widest border border-border/60 text-silver hover:border-primary hover:text-primary transition-colors";

const LABEL =
  "block font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1";

const NUM_INPUT =
  "w-full px-2 py-1.5 bg-card border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary";

function ToolbarBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-2 border border-border/60 text-silver hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function contrastText(hex: string): string {
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
  children,
}: {
  icon: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border/60 bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
          {icon} {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-silver/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

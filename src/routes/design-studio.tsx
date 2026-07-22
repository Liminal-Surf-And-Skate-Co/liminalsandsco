import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
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
} from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/hooks/use-cart";
import {
  type ProductCategory,
  type ProductSubType,
  type ViewId,
  type HardwareView,
  type ApparelView,
  type DesignState,
  type DesignLayer,
  BASE_PRICES,
  PRICE_MODIFIERS,
  BASE_COLORS,
  SKATE_SPECS,
  SURF_SPECS,
  PRESETS,
  HARDWARE_VIEWS,
  APPAREL_VIEWS,
  defaultDesignState,
  calculatePrice,
  priceBreakdown,
  saveCustomDesign,
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

function DesignStudioPage() {
  const [state, setState] = useState<DesignState>(defaultDesignState());
  const [textDraft, setTextDraft] = useState("");
  const [presetPanel, setPresetPanel] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { add: cartAdd } = useCart();

  const price = useMemo(() => calculatePrice(state), [state]);
  const breakdown = useMemo(() => priceBreakdown(state), [state]);

  const update = <K extends keyof DesignState>(key: K, value: DesignState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const setCategory = (category: ProductCategory) => {
    const subType: ProductSubType =
      category === "hardware" ? (state.subType === "surf" ? "surf" : "skate") : (state.subType === "hoodie" ? "hoodie" : "tee");
    const view: ViewId = category === "hardware" ? "top" : "front";
    setState((s) => ({ ...s, category, subType, view, specs: {} }));
  };

  const setSubType = (subType: ProductSubType) => {
    setState((s) => ({ ...s, subType, specs: {}, layers: [] }));
  };

  const setView = (view: ViewId) => update("view", view);

  const viewLayers = state.layers.filter((l) => l.view === state.view);

  const addTextLayer = () => {
    const value = textDraft.trim();
    if (!value) return;
    const layer: DesignLayer = {
      id: `txt-${Date.now()}`,
      type: "text",
      value,
      view: state.view,
    };
    update("layers", [...state.layers, layer]);
    setTextDraft("");
  };

  const addImageLayer = (dataUrl: string) => {
    const layer: DesignLayer = {
      id: `img-${Date.now()}`,
      type: "image",
      value: dataUrl,
      view: state.view,
    };
    update("layers", [...state.layers, layer]);
  };

  const addPresetLayer = (presetId: string) => {
    const layer: DesignLayer = {
      id: `pre-${Date.now()}`,
      type: "preset",
      value: presetId,
      view: state.view,
    };
    update("layers", [...state.layers, layer]);
    setPresetPanel(presetId);
  };

  const removeLayer = (id: string) =>
    update(
      "layers",
      state.layers.filter((l) => l.id !== id),
    );

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
    setState(defaultDesignState());
    setTextDraft("");
    setPresetPanel(null);
  };

  const views =
    state.category === "hardware"
      ? (HARDWARE_VIEWS as { id: ViewId; label: string }[])
      : (APPAREL_VIEWS as { id: ViewId; label: string }[]);

  const specsList = state.subType === "skate" ? SKATE_SPECS : state.subType === "surf" ? SURF_SPECS : [];

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

        {/* Product toggle */}
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
            <div className="ml-auto flex items-center gap-2">
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
          </div>
        </div>

        {/* Dual-column layout */}
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT: Creator Toolkit (350px) */}
          <aside className="w-full lg:w-[350px] shrink-0 space-y-3">
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
            </AccordionSection>

            {specsList.length > 0 && (
              <AccordionSection
                icon={<Settings className="h-4 w-4" />}
                title="Equipment Specs"
                defaultOpen
              >
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
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <p className="font-mono text-[10px] text-primary mt-2">
                +${PRICE_MODIFIERS.image} when image present
              </p>
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
              <button
                onClick={reset}
                className="w-full font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary py-1"
              >
                <RotateCw className="h-3 w-3 inline mr-1" /> Reset studio
              </button>
            </div>
          </aside>

          {/* RIGHT: Canvas */}
          <section className="flex-1 w-full min-w-0">
            {/* View flip controllers */}
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
            </div>

            {/* Canvas viewport (light silver) */}
            <div className="relative bg-silver/30 border border-border/60 overflow-hidden" style={{ minHeight: "60vh" }}>
              <ProductCanvas state={state} />

              {/* Layers overlay list */}
              {viewLayers.length > 0 && (
                <div className="absolute bottom-3 left-3 right-3 max-h-40 overflow-y-auto bg-background/90 backdrop-blur border border-border/60 p-3 space-y-2">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-silver/60">
                    Layers on this view ({viewLayers.length})
                  </p>
                  {viewLayers.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-2 text-xs font-mono text-silver border-b border-border/40 pb-1.5 last:border-0"
                    >
                      <span className="text-primary uppercase">
                        {l.type === "text" ? "TXT" : l.type === "image" ? "IMG" : "PRE"}
                      </span>
                      <span className="flex-1 truncate text-silver/80">
                        {l.type === "image" ? "Uploaded image" : l.value}
                      </span>
                      <button
                        onClick={() => removeLayer(l.id)}
                        className="text-silver/50 hover:text-destructive"
                        aria-label="Remove layer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

function ProductCanvas({ state }: { state: DesignState }) {
  const { subType, view, baseColor, layers } = state;
  const isHardware = state.category === "hardware";
  const viewLayers = layers.filter((l) => l.view === view);

  // Shape the canvas per product
  const shape = isHardware
    ? subType === "skate"
      ? { width: "220px", height: "520px", borderRadius: "110px / 60px" }
      : { width: "180px", height: "560px", borderRadius: "90px / 40px" }
    : subType === "hoodie"
      ? { width: "420px", height: "440px", borderRadius: "8px" }
      : { width: "360px", height: "440px", borderRadius: "8px" };

  const isGrip = isHardware && view === "top";
  const gripTexture = isGrip
    ? "repeating-linear-gradient(45deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 4px)"
    : "none";

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div
        className="relative shadow-2xl transition-colors"
        style={{
          ...shape,
          backgroundColor: baseColor,
          backgroundImage: gripTexture,
        }}
      >
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
        {viewLayers.map((layer, i) => {
          const top = 15 + i * 12;
          if (layer.type === "image") {
            return (
              <img
                key={layer.id}
                src={layer.value}
                alt=""
                className="absolute left-1/2 -translate-x-1/2 max-w-[80%] max-h-[40%] object-contain opacity-90 mix-blend-multiply"
                style={{ top: `${top}%` }}
              />
            );
          }
          if (layer.type === "preset") {
            return (
              <div
                key={layer.id}
                className="absolute left-1/2 -translate-x-1/2 px-3 py-1 font-mono text-[10px] uppercase tracking-widest border"
                style={{
                  top: `${top}%`,
                  color: isGrip ? "#fff" : "#111",
                  borderColor: isGrip ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                }}
              >
                {layer.value}
              </div>
            );
          }
          // text
          return (
            <div
              key={layer.id}
              className="absolute left-1/2 -translate-x-1/2 font-display font-black text-center px-2"
              style={{
                top: `${top}%`,
                color: isGrip ? "#fff" : contrastText(baseColor),
                fontSize: subType === "tee" ? "26px" : "20px",
                textShadow: isGrip ? "0 1px 2px rgba(0,0,0,0.6)" : "none",
              }}
            >
              {layer.value}
            </div>
          );
        })}

        {/* Empty hint */}
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

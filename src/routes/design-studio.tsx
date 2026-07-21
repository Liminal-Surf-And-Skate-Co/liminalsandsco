import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Sparkles, Layers, Palette, Type, Download, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/design-studio")({
  head: () => ({
    meta: [
      { title: "Design Studio — Customize Your Gear | Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "Design your own skateboard, surfboard, or apparel. Choose colors, add text, and preview every side before you order.",
      },
      { property: "og:title", content: "Design Studio — Liminal Surf & Skate Co" },
      {
        property: "og:description",
        content: "Custom hardware and apparel — designed by you, crafted by us.",
      },
    ],
  }),
  component: DesignStudioPage,
});

type ProductKind = "hardware" | "apparel";

type ProductDef = {
  id: string;
  kind: ProductKind;
  label: string;
  faces: FaceKey[];
  basePrice: number;
};

type FaceKey = "top" | "bottom" | "front" | "back" | "left-sleeve";

const FACE_LABEL: Record<FaceKey, string> = {
  top: "Top",
  bottom: "Bottom",
  front: "Front",
  back: "Back",
  "left-sleeve": "Left Sleeve",
};

const PRODUCTS: ProductDef[] = [
  { id: "skateboard", kind: "hardware", label: "Skateboard Deck", faces: ["top", "bottom"], basePrice: 180 },
  { id: "surfboard", kind: "hardware", label: "Surfboard", faces: ["top", "bottom"], basePrice: 890 },
  { id: "tshirt", kind: "apparel", label: "T-Shirt", faces: ["front", "back", "left-sleeve"], basePrice: 55 },
  { id: "hoodie", kind: "apparel", label: "Hoodie", faces: ["front", "back", "left-sleeve"], basePrice: 120 },
  { id: "hat", kind: "apparel", label: "Cap", faces: ["front", "back"], basePrice: 45 },
];

const PRESET_COLORS = [
  "#0a0a0a",
  "#ffffff",
  "#f5f0e6",
  "#c8a45e",
  "#3a5f4a",
  "#8b3a2a",
  "#1e3a5f",
  "#d84a3a",
];

type FaceDesign = {
  bg: string;
  ink: string;
  text: string;
  fontStyle: "display" | "mono" | "serif";
  align: "left" | "center" | "right";
  scale: number;
};

const defaultFace = (): FaceDesign => ({
  bg: "#0a0a0a",
  ink: "#f5f0e6",
  text: "LIMINAL",
  fontStyle: "display",
  align: "center",
  scale: 1,
});

function DesignStudioPage() {
  const [kind, setKind] = useState<ProductKind>("hardware");
  const products = useMemo(() => PRODUCTS.filter((p) => p.kind === kind), [kind]);
  const [productId, setProductId] = useState(products[0].id);
  const product = PRODUCTS.find((p) => p.id === productId) ?? products[0];

  const [face, setFace] = useState<FaceKey>(product.faces[0]);
  const [designs, setDesigns] = useState<Record<string, Partial<Record<FaceKey, FaceDesign>>>>({});

  const current = designs[product.id]?.[face] ?? defaultFace();

  const updateFace = (patch: Partial<FaceDesign>) => {
    setDesigns((d) => ({
      ...d,
      [product.id]: {
        ...(d[product.id] ?? {}),
        [face]: { ...current, ...patch },
      },
    }));
  };

  const switchProduct = (id: string) => {
    setProductId(id);
    const p = PRODUCTS.find((x) => x.id === id)!;
    if (!p.faces.includes(face)) setFace(p.faces[0]);
  };

  const switchKind = (k: ProductKind) => {
    setKind(k);
    const first = PRODUCTS.find((p) => p.kind === k)!;
    setProductId(first.id);
    setFace(first.faces[0]);
  };

  const submitOrder = () => {
    toast.success("Custom order submitted", {
      description: `We'll reach out about your ${product.label.toLowerCase()} build within 24 hours.`,
    });
  };

  const exportDesign = () => {
    const blob = new Blob([JSON.stringify({ product: product.id, designs: designs[product.id] ?? {} }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `liminal-${product.id}-design.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
            (Studio) Custom Build
          </p>
          <h1 className="font-display font-black text-4xl sm:text-6xl mb-3">Design Studio</h1>
          <p className="text-silver/70 max-w-2xl">
            Sketch it, colour it, name it. Every board and thread is built to order by our crew in
            Byron.
          </p>
        </header>

        {/* Category toggle */}
        <div className="inline-flex border border-border/60 mb-6">
          {(["hardware", "apparel"] as ProductKind[]).map((k) => (
            <button
              key={k}
              onClick={() => switchKind(k)}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
                kind === k
                  ? "bg-primary text-primary-foreground"
                  : "text-silver/70 hover:text-primary"
              }`}
            >
              {k === "hardware" ? "Hardware" : "Apparel"}
            </button>
          ))}
        </div>

        {/* Product selector */}
        <div className="flex flex-wrap gap-2 mb-10">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => switchProduct(p.id)}
              className={`px-4 py-2 border font-mono text-[11px] uppercase tracking-widest transition-colors ${
                productId === p.id
                  ? "border-primary text-primary"
                  : "border-border/60 text-silver/70 hover:border-primary/60"
              }`}
            >
              {p.label} · ${p.basePrice}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Preview */}
          <div className="border border-border/60 bg-card p-6">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Layers className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-silver/70 mr-2">
                Face
              </span>
              {product.faces.map((f) => (
                <button
                  key={f}
                  onClick={() => setFace(f)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                    face === f
                      ? "border-primary text-primary bg-primary/5"
                      : "border-border/60 text-silver/70 hover:border-primary/60"
                  }`}
                >
                  {FACE_LABEL[f]}
                </button>
              ))}
            </div>

            <FacePreview product={product} face={face} design={current} />

            <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-4">
              Preview — {product.label} / {FACE_LABEL[face]}
            </p>
          </div>

          {/* Controls */}
          <aside className="border border-border/60 bg-card p-6 space-y-6 self-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type className="h-4 w-4 text-primary" />
                <h3 className="font-mono text-xs uppercase tracking-widest">Text</h3>
              </div>
              <input
                value={current.text}
                onChange={(e) => updateFace({ text: e.target.value })}
                maxLength={24}
                className="w-full bg-background border border-border/60 px-3 py-2 font-mono text-sm focus:border-primary outline-none"
                placeholder="Your text"
              />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {(["display", "serif", "mono"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => updateFace({ fontStyle: f })}
                    className={`py-2 text-[10px] uppercase tracking-widest border ${
                      current.fontStyle === f
                        ? "border-primary text-primary"
                        : "border-border/60 text-silver/70"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => updateFace({ align: a })}
                    className={`py-2 text-[10px] uppercase tracking-widest border ${
                      current.align === a
                        ? "border-primary text-primary"
                        : "border-border/60 text-silver/70"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1">
                  Scale · {current.scale.toFixed(1)}×
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={current.scale}
                  onChange={(e) => updateFace({ scale: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4 text-primary" />
                <h3 className="font-mono text-xs uppercase tracking-widest">Colours</h3>
              </div>
              <ColorRow
                label="Background"
                value={current.bg}
                onChange={(v) => updateFace({ bg: v })}
              />
              <ColorRow label="Ink" value={current.ink} onChange={(v) => updateFace({ ink: v })} />
            </div>

            <div className="border-t border-border/40 pt-4 space-y-2">
              <button
                onClick={submitOrder}
                className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Submit custom order · ${product.basePrice}
              </button>
              <button
                onClick={exportDesign}
                className="w-full border border-border/60 font-mono text-xs uppercase tracking-widest py-3 hover:border-primary flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export design
              </button>
              <p className="font-mono text-[10px] text-silver/50 text-center pt-2 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" /> Every build handmade in Byron
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 border border-border/60 bg-transparent cursor-pointer"
        />
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            aria-label={c}
            className={`h-6 w-6 border ${
              value.toLowerCase() === c.toLowerCase() ? "border-primary" : "border-border/60"
            }`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

function FacePreview({
  product,
  face,
  design,
}: {
  product: ProductDef;
  face: FaceKey;
  design: FaceDesign;
}) {
  const fontClass =
    design.fontStyle === "display"
      ? "font-display font-black"
      : design.fontStyle === "serif"
        ? "font-serif italic"
        : "font-mono";
  const alignClass =
    design.align === "left" ? "items-start" : design.align === "right" ? "items-end" : "items-center";

  const shape = shapeFor(product.id, face);

  return (
    <div className="w-full aspect-[4/3] bg-background flex items-center justify-center overflow-hidden">
      <div
        className={`relative flex justify-center ${alignClass} ${shape.wrap} shadow-2xl`}
        style={{ background: design.bg }}
      >
        <div className={`w-full h-full flex ${alignClass} justify-center px-6`}>
          <span
            className={`${fontClass} uppercase tracking-tight leading-none text-center break-words`}
            style={{
              color: design.ink,
              fontSize: `${design.scale * (shape.baseFont)}px`,
            }}
          >
            {design.text || "\u00A0"}
          </span>
        </div>
      </div>
    </div>
  );
}

function shapeFor(productId: string, face: FaceKey): { wrap: string; baseFont: number } {
  if (productId === "skateboard") {
    return { wrap: "w-[130px] h-[440px] rounded-[70px] flex-col justify-center", baseFont: 22 };
  }
  if (productId === "surfboard") {
    return { wrap: "w-[110px] h-[500px] rounded-t-[55px] rounded-b-[30px] flex-col justify-center", baseFont: 20 };
  }
  if (productId === "hat") {
    return { wrap: "w-[320px] h-[180px] rounded-t-full flex-col justify-center", baseFont: 34 };
  }
  if (face === "left-sleeve") {
    return { wrap: "w-[120px] h-[300px] flex-col justify-center", baseFont: 18 };
  }
  // t-shirt / hoodie front/back
  return { wrap: "w-[340px] h-[400px] flex-col justify-center", baseFont: 40 };
}

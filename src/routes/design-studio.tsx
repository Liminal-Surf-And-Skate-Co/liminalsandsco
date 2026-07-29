/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Undo2,
  Redo2,
  Type as TypeIcon,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Trash2,
  Lock,
  Clock as Unlock,
  ArrowUp,
  ArrowDown,
  Crosshair,
  Maximize2,
  RotateCw,
  Download,
  Link2,
  Save,
  Upload,
  Palette,
  Brush,
  Pipette,
  Droplet,
  Sun,
  Contrast,
  ZoomIn,
  ZoomOut,
  FlipHorizontal2,
  FlipVertical2,
  Eye,
  Group,
  Square,
  Circle as CircleIcon,
  Hexagon,
  Triangle,
  Grid3x3,
  Files,
  Frame,
  Shapes,
  ChevronsLeftRight,
  ChartPie,
  ChartBar,
  Activity,
  Layers3,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { ErrorBoundary } from "@/components/site/ErrorBoundary";
import { METALLIC_PALETTES, findSticker, ALL_STICKERS } from "@/lib/sticker-library";
import {
  DECAL_CATEGORIES,
  ALL_DECALS,
  findDecal,
  searchDecals,
  type Decal,
  type DecalCategory,
} from "@/lib/studio/decals";
import { STUDIO_THEMES, type StudioTheme } from "@/lib/studio/themes";
import {
  SOFT_PALETTES,
  HOT_PALETTES,
  type PaletteGroup,
  type PaletteSwatch,
} from "@/lib/studio/palettes";

const OFFLINE = !isSupabaseConfigured();

export const Route = createFileRoute("/design-studio")({
  head: () => ({
    meta: [
      { title: "Design Studio — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "Customize skateboards, surfboards and apparel. Add graphics, pick specs and materials, save to your Garage.",
      },
      { property: "og:title", content: "Design Studio — Liminal" },
      { property: "og:description", content: "Craft one-off boards and apparel in the browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DesignStudioPageWithBoundary,
});

function DesignStudioPageWithBoundary() {
  return (
    <ErrorBoundary name="DesignStudio">
      <DesignStudioPage />
    </ErrorBoundary>
  );
}

// ---------- Types ----------
type ProductKey = "skateboard" | "surfboard" | "tshirt" | "hoodie" | "cap";
type FaceKey = string;
type LayerKind = "text" | "image" | "sticker";
/** Lightweight optional group container id; layers sharing the same groupId
 *  are treated as a single groupable unit (group / ungroup). */
type TextEffect = "shadow" | "neon" | "hollow" | "retro-wave" | "arch" | "3d-block";
interface Layer {
  id: string;
  kind: LayerKind;
  face: FaceKey;
  x: number; // 0-100 %
  y: number; // 0-100 %
  scale: number;
  rotation: number;
  locked?: boolean;
  // visual extras
  opacity?: number; // 0-100 (defaults to 100)
  flipX?: boolean;
  flipY?: boolean;
  groupId?: string;
  // text extras
  text?: string;
  font?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  letterSpacing?: number; // multiplier, 0.5 .. 4
  lineHeight?: number; // multiplier, 0.8 .. 2.5
  effect?: TextEffect;
  arched?: boolean;
  // image / sticker extras
  src?: string;
  /**
   * Optional per-decals recolor override. When set, renders this color instead
   * of `state.ink` for the stroke / fill matching `currentColor`. Lets you mix
   * colors per layer on a single canvas (multi-path recoloring).
   */
  recolor?: string;
}
interface DesignState {
  product: ProductKey;
  face: FaceKey;
  bg: string;
  ink: string;
  texture: string;
  concave?: "mellow" | "medium" | "steep";
  hardness?: "78a" | "99a" | "101a";
  bolts?: string;
  tail?: "squash" | "swallow" | "pin";
  fins?: "single" | "twin" | "thruster" | "quad";
  layers: Layer[];
  /** Optional multi-page index — when set, this is the active page slot. */
  page?: number;
  /** Canvas dimensions metadata for export pipelines (300 DPI etc.). */
  canvasWidth?: number;
  canvasHeight?: number;
  canvasUnit?: "px" | "in" | "mm";
  /** CMYK preview mock flag — does not transform color, just sets a visual marker. */
  cmykPreview?: boolean;
}

// ---------- Tool: Font definitions ----------
/** Categorised Google Fonts so the typography panel can filter by mood. */
const FONT_GROUPS: { id: string; label: string; fonts: string[] }[] = [
  {
    id: "display",
    label: "Display / Retro",
    fonts: [
      "'Bungee', sans-serif",
      "'Monoton', sans-serif",
      "'Audiowide', cursive",
      "'Press Start 2P', monospace",
      "'Bebas Neue', sans-serif",
      "'Rubik Mono One', monospace",
      "'Major Mono Display', monospace",
      "'Russo One', sans-serif",
    ],
  },
  {
    id: "serif",
    label: "Serif",
    fonts: [
      "'Playfair Display', serif",
      "'Cormorant Garamond', serif",
      "'EB Garamond', serif",
      "'Lora', serif",
      "'Crimson Pro', serif",
      "'Merriweather', serif",
    ],
  },
  {
    id: "sans",
    label: "Sans Serif",
    fonts: [
      "Inter, sans-serif",
      "'IBM Plex Sans', sans-serif",
      "'Manrope', sans-serif",
      "'Outfit', sans-serif",
      "'Space Grotesk', sans-serif",
    ],
  },
  {
    id: "script",
    label: "Script",
    fonts: [
      "'Caveat', cursive",
      "'Permanent Marker', cursive",
      "'Pacifico', cursive",
      "'Dancing Script', cursive",
      "'Sacramento', cursive",
    ],
  },
  {
    id: "mono",
    label: "Monospace",
    fonts: [
      "'JetBrains Mono', monospace",
      "'IBM Plex Mono', monospace",
      "'Fira Code', monospace",
      "'Space Mono', monospace",
    ],
  },
];

const ALL_FONTS_LIST: string[] = FONT_GROUPS.flatMap((g) => g.fonts);

/** Pre-made pairing templates so users can apply balanced typographic styles in one click. */
const FONT_PAIRINGS: { id: string; label: string; headline: string; body: string }[] = [
  {
    id: "y2k-display",
    label: "Y2K Display + Mono",
    headline: "'Bungee', sans-serif",
    body: "'JetBrains Mono', monospace",
  },
  {
    id: "editorial-serif",
    label: "Editorial Serif",
    headline: "'Playfair Display', serif",
    body: "'Lora', serif",
  },
  {
    id: "swiss-tech",
    label: "Swiss Tech",
    headline: "'Space Grotesk', sans-serif",
    body: "'IBM Plex Mono', monospace",
  },
  {
    id: "surf-script",
    label: "Sun-bleached Script",
    headline: "'Permanent Marker', cursive",
    body: "'Inter', sans-serif",
  },
  {
    id: "hippie-script",
    label: "Hippie Script",
    headline: "'Caveat', cursive",
    body: "'Space Grotesk', sans-serif",
  },
];

// ---------- Tool: Photo filters / adjustments ----------
type FilterName = "none" | "vivid" | "warm" | "cool" | "vintage" | "duotone";
const PHOTO_FILTERS: Record<FilterName, { label: string; css: string }> = {
  none: { label: "Original", css: "none" },
  vivid: { label: "Vivid", css: "saturate(1.4) contrast(1.1)" },
  warm: { label: "Warm", css: "sepia(0.25) saturate(1.2)" },
  cool: { label: "Cool", css: "hue-rotate(195deg) saturate(0.9)" },
  vintage: { label: "Vintage", css: "sepia(0.5) contrast(0.95) brightness(0.95)" },
  duotone: { label: "Duotone", css: "grayscale(1) contrast(1.5)" },
};

type AdjustmentKey = "brightness" | "contrast" | "saturation" | "tint" | "vignette" | "blur";
type Adjustments = Record<AdjustmentKey, number>;
const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  tint: 0,
  vignette: 0,
  blur: 0,
};
function adjustmentsToCss(a: Adjustments): string {
  const parts: string[] = [];
  if (a.brightness !== 100) parts.push(`brightness(${a.brightness}%)`);
  if (a.contrast !== 100) parts.push(`contrast(${a.contrast}%)`);
  if (a.saturation !== 100) parts.push(`saturate(${a.saturation}%)`);
  if (a.tint !== 0) parts.push(`hue-rotate(${a.tint}deg)`);
  if (a.blur !== 0) parts.push(`blur(${a.blur}px)`);
  return parts.length ? parts.join(" ") : "none";
}

// ---------- Tool: Paint brushes ----------
type BrushKind = "watercolor" | "spray" | "highlighter" | "chalk" | "pencil" | "eraser";
const BRUSH_LIBRARY: { id: BrushKind; label: string; blurb: string }[] = [
  { id: "watercolor", label: "Watercolor", blurb: "Soft, low-opacity filled strokes" },
  { id: "spray", label: "Spray / Graffiti", blurb: "Splatter + density control" },
  { id: "highlighter", label: "Highlighter", blurb: "Transparent flat pass" },
  { id: "chalk", label: "Chalk / Crayon", blurb: "Gritty, broken edges" },
  { id: "pencil", label: "Pencil / Fine Pen", blurb: "1px hairline + smooth" },
  { id: "eraser", label: "Eraser", blurb: "Non-destructive paint removal" },
];

// ---------- Tool: Clip frame shapes ----------
const CLIP_FRAME_SHAPES: { id: string; label: string; clipPath: string }[] = [
  { id: "none", label: "None", clipPath: "none" },
  { id: "circle", label: "Circle", clipPath: "circle(50% at 50% 50%)" },
  {
    id: "badge",
    label: "Badge",
    clipPath: "polygon(50% 0,90% 30%,90% 70%,50% 100%,10% 70%,10% 30%)",
  },
  {
    id: "hex",
    label: "Hexagon",
    clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)",
  },
  {
    id: "torn",
    label: "Torn Paper",
    clipPath:
      "polygon(0 8%, 12% 2%, 24% 6%, 36% 1%, 50% 7%, 64% 0, 78% 5%, 90% 0, 100% 6%, 98% 18%, 100% 36%, 96% 56%, 100% 76%, 97% 92%, 88% 98%, 74% 95%, 60% 99%, 46% 96%, 32% 100%, 18% 97%, 6% 100%, 0 90%, 3% 72%, 0 54%, 4% 32%, 0 16%)",
  },
];

// ---------- 50-Decal ON-SURFACE Palette & Theme quick states ----------
const PAGE_SIZES: {
  id: string;
  label: string;
  width: number;
  height: number;
  unit: "px" | "in" | "mm";
}[] = [
  { id: "std-a4", label: "A4", width: 2480, height: 3508, unit: "px" },
  { id: "std-square", label: "Square 1080", width: 1080, height: 1080, unit: "px" },
  { id: "print-deck", label: "Skate Deck 32×8", width: 3200, height: 800, unit: "px" },
  { id: "tall-story", label: "Story 1080×1920", width: 1080, height: 1920, unit: "px" },
  { id: "browser-banner", label: "Web Banner 1920×540", width: 1920, height: 540, unit: "px" },
  { id: "sublimation-tshirt", label: "T-Shirt 12×16", width: 3600, height: 4800, unit: "px" },
];

// ---------- Constants ----------
const PRODUCTS: Record<
  ProductKey,
  {
    label: string;
    family: "hardware" | "apparel";
    faces: FaceKey[];
    basePrice: number;
    ratio: number;
  }
> = {
  skateboard: {
    label: "Skateboard",
    family: "hardware",
    faces: ["top", "bottom"],
    basePrice: 120,
    ratio: 0.28,
  },
  surfboard: {
    label: "Surfboard",
    family: "hardware",
    faces: ["top", "bottom"],
    basePrice: 780,
    ratio: 0.22,
  },
  tshirt: {
    label: "T-Shirt",
    family: "apparel",
    faces: ["front", "back", "left-sleeve"],
    basePrice: 55,
    ratio: 0.85,
  },
  hoodie: {
    label: "Hoodie",
    family: "apparel",
    faces: ["front", "back", "left-sleeve"],
    basePrice: 110,
    ratio: 0.9,
  },
  cap: { label: "Cap", family: "apparel", faces: ["front", "back"], basePrice: 40, ratio: 0.75 },
};

const BRAND_COLORS = ["#0b0b0f", "#f4f1ea", "#ff5b1f", "#1f6feb", "#3ea770", "#e2b23a", "#d43f5b"];
/** Backwards-compatible legacy fonts array — kept so existing templates keep
 *  rendering correctly. New typography panel reads from FONT_GROUPS. */
const FONTS = [
  "Inter, sans-serif",
  "Georgia, serif",
  "'Courier New', monospace",
  "Impact, sans-serif",
];
const TEXTURES = [
  { key: "none", label: "None" },
  { key: "grip", label: "Grip Tape" },
  { key: "wood", label: "Stained Wood" },
  { key: "gloss", label: "High-Gloss Fiberglass" },
  { key: "cotton", label: "Heavy Cotton" },
];

// Legacy alias — the real library still lives in @/lib/sticker-library for
// backwards compatibility with any persisted designs that reference sticker ids.
const STICKERS = ALL_STICKERS;

/**
 * Look up a sticker/decals by id from EITHER library. The new decals.ts file
 * is the preferred source for any new placements; stickers remain resolvable so
 * Garage-saved designs still render.
 */
function resolveDecalSvg(id: string): string | undefined {
  return findDecal(id)?.svg ?? findSticker(id)?.svg;
}

// ---------- Templates ----------
const TEMPLATES: {
  id: string;
  label: string;
  blurb: string;
  build: (product: ProductKey) => Partial<DesignState>;
}[] = [
  {
    id: "cyber-y2k",
    label: "Cyber Y2K",
    blurb: "Chrome stars, magenta hue, bold sans.",
    build: (product) => ({
      bg: "#0b0b18",
      ink: "#ff3fa4",
      texture: "gloss",
      layers: [
        stickerLayer("chrome", "top-face", 30, 30, 1.4),
        stickerLayer("chrome", "top-face", 72, 66, 0.9),
        textLayer("CYBER//WAVE", "top-face", 50, 78, "Impact, sans-serif", "#e8f0ff", 1.4, true),
      ].map((l) => ({ ...l, face: primaryFace(product) })),
    }),
  },
  {
    id: "surf-70s",
    label: "70s Surf Wave",
    blurb: "Sun-bleached palette and rolling waves.",
    build: (product) => ({
      bg: "#f2c46a",
      ink: "#7a2f14",
      texture: "wood",
      layers: [
        stickerLayer("sun", "x", 50, 32, 1.2),
        stickerLayer("wave", "x", 50, 62, 1.6),
        textLayer("ENDLESS SUMMER", "x", 50, 84, "Georgia, serif", "#7a2f14", 1.1, false, true),
      ].map((l) => ({ ...l, face: primaryFace(product) })),
    }),
  },
  {
    id: "min-street",
    label: "Minimalist Street",
    blurb: "One word. One line. Zero noise.",
    build: (product) => ({
      bg: "#f4f1ea",
      ink: "#0b0b0f",
      texture: "none",
      layers: [
        textLayer("LIMINAL", "x", 50, 48, "Inter, sans-serif", "#0b0b0f", 1.8, true),
        textLayer("— est. present tense —", "x", 50, 58, "Inter, sans-serif", "#0b0b0f", 0.7),
      ].map((l) => ({ ...l, face: primaryFace(product) })),
    }),
  },
];

function primaryFace(product: ProductKey): FaceKey {
  return PRODUCTS[product].faces[0];
}
function textLayer(
  text: string,
  face: FaceKey,
  x: number,
  y: number,
  font: string,
  color: string,
  scale = 1,
  bold = false,
  italic = false,
): Layer {
  return {
    id: cryptoId(),
    kind: "text",
    face,
    x,
    y,
    scale,
    rotation: 0,
    text,
    font,
    color,
    bold,
    italic,
  };
}
function stickerLayer(id: string, face: FaceKey, x: number, y: number, scale = 1): Layer {
  return { id: cryptoId(), kind: "sticker", face, x, y, scale, rotation: 0, src: id };
}
function cryptoId() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------- Component ----------
function DesignStudioPage() {
  const [product, setProduct] = useState<ProductKey>("skateboard");
  const [state, setState] = useState<DesignState>(() => initialState("skateboard"));
  const [history, setHistory] = useState<DesignState[]>([]);
  const [future, setFuture] = useState<DesignState[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snapLines, setSnapLines] = useState<{ x?: boolean; y?: boolean }>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null);

  // ---------- New-tool UI state (does NOT affect undo/redo doc history) ----------
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showRulers, setShowRulers] = useState<boolean>(false);
  const [showCenterLines, setShowCenterLines] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterName>("none");
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULT_ADJUSTMENTS);
  const [brushKind, setBrushKind] = useState<BrushKind>("pencil");
  const [brushSize, setBrushSize] = useState<number>(6);
  const [brushOpacity, setBrushOpacity] = useState<number>(80);
  const [clipFrame, setClipFrame] = useState<string>("none");
  const [aspectLocked, setAspectLocked] = useState<boolean>(false);
  const [decalSearch, setDecalSearch] = useState<string>("");
  const [selectedFontGroup, setSelectedFontGroup] = useState<string>("display");

  // ---------- Read hydrate from autosave on mount / per-product ----------
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`liminal:studio:save:${product}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<DesignState>;
      if (parsed?.layers && Array.isArray(parsed.layers)) {
        setState((s) => ({
          ...s,
          ...parsed,
          product,
          face: parsed?.face ?? s.face,
          layers: parsed.layers as Layer[],
        }));
        toast.success(`Restored autosave for ${PRODUCTS[product].label}`);
      }
    } catch {
      /* ignore parse errors */
    }
  }, [product]);

  // ---------- Debounced autosave to localStorage ----------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(`liminal:studio:save:${product}`, JSON.stringify(state));
      } catch {
        /* quota / serialization failure — silent */
      }
    }, 1200);
    return () => window.clearTimeout(t);
  }, [state, product]);

  const meta = PRODUCTS[product];
  const activeFace = state.face;

  // ---------- Filter single selector for layer style ----------
  const layerCssFilter = useMemo(() => {
    if (activeFilter === "none" && adjustments === DEFAULT_ADJUSTMENTS) return "none";
    return `${PHOTO_FILTERS[activeFilter].css === "none" ? "" : PHOTO_FILTERS[activeFilter].css} ${adjustmentsToCss(adjustments)}`.trim();
  }, [activeFilter, adjustments]);

  // pushHistory before mutating
  const commit = useCallback((updater: (s: DesignState) => DesignState) => {
    setState((prev) => {
      setHistory((h) => [...h.slice(-49), prev]);
      setFuture([]);
      return updater(prev);
    });
  }, []);
  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [state, ...f].slice(0, 50));
      setState(prev);
      return h.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[0];
      setHistory((h) => [...h, state].slice(-50));
      setState(next);
      return f.slice(1);
    });
  };
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        mod &&
        (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, history, future]);

  // Switch product
  const switchProduct = (p: ProductKey) => {
    if (p === product) return;
    setProduct(p);
    commit(() => initialState(p));
    setSelectedId(null);
  };

  const setFace = (f: FaceKey) => commit((s) => ({ ...s, face: f }));

  // Layer helpers
  const facedLayers = state.layers.filter((l) => l.face === activeFace);
  const selected = state.layers.find((l) => l.id === selectedId) || null;
  const patchLayer = (id: string, patch: Partial<Layer>) =>
    commit((s) => ({ ...s, layers: s.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  const deleteLayer = (id: string) =>
    commit((s) => ({ ...s, layers: s.layers.filter((l) => l.id !== id) }));
  const addLayer = (l: Layer) => commit((s) => ({ ...s, layers: [...s.layers, l] }));
  const reorderLayer = (id: string, dir: 1 | -1) =>
    commit((s) => {
      const idx = s.layers.findIndex((l) => l.id === id);
      if (idx < 0) return s;
      const target = idx + dir;
      if (target < 0 || target >= s.layers.length) return s;
      const next = s.layers.slice();
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return { ...s, layers: next };
    });

  // Group / Ungroup selected layers (uses optional groupId)
  const groupSelected = () => {
    if (facedLayers.length < 2) {
      toast.info("Select 2+ layers to group");
      return;
    }
    const gid = cryptoId();
    const ids = new Set(facedLayers.map((l) => l.id));
    commit((s) => ({
      ...s,
      layers: s.layers.map((l) => (ids.has(l.id) ? { ...l, groupId: gid } : l)),
    }));
    toast.success(`Grouped ${ids.size} layers`);
  };
  const ungroupSelected = () => {
    if (!selected?.groupId) {
      toast.info("Pick a grouped layer first");
      return;
    }
    const gid = selected.groupId;
    commit((s) => ({
      ...s,
      layers: s.layers.map((l) => (l.groupId === gid ? { ...l, groupId: undefined } : l)),
    }));
    toast.success("Group dissolved");
  };

  // Equal spacing distribution (horizontal) for selected-faced layers
  const distributeHorizontally = () => {
    if (facedLayers.length < 3) {
      toast.info("Need at least 3 layers to distribute");
      return;
    }
    const sorted = [...facedLayers].sort((a, b) => a.x - b.x);
    const minX = sorted[0].x;
    const maxX = sorted[sorted.length - 1].x;
    const span = maxX - minX;
    if (span <= 0) {
      toast.info("Items already aligned");
      return;
    }
    const step = span / (sorted.length - 1);
    commit((s) => ({
      ...s,
      layers: s.layers.map((l) => {
        const idx = sorted.findIndex((x) => x.id === l.id);
        if (idx < 0) return l;
        return { ...l, x: minX + step * idx };
      }),
    }));
    toast.success("Distributed evenly");
  };

  // Format painter — copy style from selected layer to the next-added layer
  const formatPainter = useRef<Layer | null>(null);
  const copyStyle = () => {
    if (!selected) {
      toast.info("Select a layer to copy its style from");
      return;
    }
    formatPainter.current = { ...selected };
    toast.success("Style copied — add a new layer to paste");
  };
  const pasteStyle = (l: Layer): Layer => {
    if (!formatPainter.current) return l;
    return {
      ...l,
      ...formatPainter.current,
      id: l.id,
      src: l.src,
      text: l.text,
      kind: l.kind,
      face: l.face,
    };
  };

  // Custom font uploader (browser native — no new dep)
  const onFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.(ttf|otf)$/i.test(file.name)) {
      toast.error("Only .ttf or .otf uploads are supported");
      return;
    }
    const buffer = await file.arrayBuffer().catch(() => null);
    if (!buffer) return;
    const fontName = `custom-${cryptoId()}`;
    try {
      // @ts-expect-error — TS lib.dom doesn't know about FontFace across all configs
      const font: FontFace = new FontFace(fontName, buffer);
      await font.load();
      // @ts-expect-error
      document.fonts.add(font);
      if (selected?.kind === "text") {
        patchLayer(selected.id, { font: fontName });
        toast.success(`Font uploaded — applied to "${selected.text?.slice(0, 10)}"`);
      } else {
        toast.success(`Font uploaded — pick a text layer to apply`);
      }
    } catch (err) {
      toast.error("Could not load that font file");
    }
  };

  // Duplicate the entire project — clone state into a new localStorage slot
  const duplicateProject = () => {
    const key = `liminal:studio:project:${cryptoId()}`;
    try {
      window.localStorage.setItem(key, JSON.stringify({ ...state, product }));
      toast.success(`Project duplicated → ${key.slice(-8)}`);
    } catch {
      toast.error("Duplicate failed — storage unavailable");
    }
  };

  // Eyedropper — uses browser API when supported, falls back to toast tip
  const eyedropper = async () => {
    // @ts-expect-error
    if (typeof window !== "undefined" && window.EyeDropper) {
      try {
        // @ts-expect-error
        const ed = new window.EyeDropper();
        const result = await ed.open();
        commit((s) => ({ ...s, ink: result.sRGBHex }));
        toast.success(`Picked ${result.sRGBHex}`);
      } catch {
        /* user cancelled */
      }
    } else {
      toast.info("Eyedropper not available — use the color row to pick manually");
    }
  };

  // Random palette shuffle over the SOFT_PALETTES swatches
  const shufflePalette = () => {
    const allSwatches = ALL_PALETTES.flatMap((g) => g.swatches);
    const pick = allSwatches[Math.floor(Math.random() * allSwatches.length)];
    commit((s) => ({ ...s, ink: pick.hex }));
    toast.success(`Shuffled → ${pick.label}`);
  };

  // Drag
  const onPointerDown = (e: React.PointerEvent, id: string) => {
    const l = state.layers.find((x) => x.id === id);
    if (!l || l.locked) return;
    setSelectedId(id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (l.x / 100) * rect.width;
    const py = (l.y / 100) * rect.height;
    dragRef.current = { id, ox: e.clientX - (rect.left + px), oy: e.clientY - (rect.top + py) };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!d || !rect) return;
    let x = ((e.clientX - rect.left - d.ox) / rect.width) * 100;
    let y = ((e.clientY - rect.top - d.oy) / rect.height) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    // magnetic snap to centerlines (50% ± 2%)
    const snapX = Math.abs(x - 50) < 2.5;
    const snapY = Math.abs(y - 50) < 2.5;
    if (snapX) x = 50;
    if (snapY) y = 50;
    setSnapLines({ x: snapX, y: snapY });
    patchLayer(d.id, { x, y });
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setSnapLines({});
  };

  // File drop
  const onDropFile = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      if (!/^image\/(png|svg\+xml|jpe?g|webp)$/.test(f.type)) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = String(reader.result);
        addLayer({
          id: cryptoId(),
          kind: "image",
          face: activeFace,
          x: 50,
          y: 50,
          scale: 1,
          rotation: 0,
          src,
        });
      };
      reader.readAsDataURL(f);
    });
  };

  // Positioning
  const centerX = () => selected && patchLayer(selected.id, { x: 50 });
  const centerY = () => selected && patchLayer(selected.id, { y: 50 });
  const fitCanvas = () => selected && patchLayer(selected.id, { scale: 2, x: 50, y: 50 });
  const rot90 = () =>
    selected && patchLayer(selected.id, { rotation: (selected.rotation + 90) % 360 });

  // Templates
  const applyTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    const patch = t.build(product);
    const layers = (patch.layers ?? []).map((l) => ({ ...l, face: primaryFace(product) }));
    commit((s) => ({ ...s, ...patch, layers: [...layers], face: primaryFace(product) }));
    toast.success(`${t.label} template loaded`);
  };

  // Price breakdown
  const priceBreakdown = useMemo(() => {
    const items: { label: string; amount: number }[] = [];
    let total = meta.basePrice;
    items.push({ label: `Base ${meta.label}`, amount: meta.basePrice });

    const uploads = state.layers.filter((l) => l.kind === "image").length;
    if (uploads > 0) {
      const cost = uploads * 8;
      total += cost;
      items.push({ label: `Custom image upload (${uploads})`, amount: cost });
    }
    const stickers = state.layers.filter((l) => l.kind === "sticker").length;
    if (stickers > 0) {
      const cost = stickers * 3;
      total += cost;
      items.push({ label: `Sticker layers (${stickers})`, amount: cost });
    }
    if (state.texture === "gloss") {
      total += 25;
      items.push({ label: "High-Gloss Fiberglass", amount: 25 });
    }
    if (state.texture === "grip") {
      total += 12;
      items.push({ label: "Grip Tape", amount: 12 });
    }
    if (state.texture === "wood") {
      total += 18;
      items.push({ label: "Stained Wood Grain", amount: 18 });
    }
    if (state.texture === "cotton") {
      total += 10;
      items.push({ label: "Heavy Cotton", amount: 10 });
    }
    if (state.concave === "steep") {
      total += 15;
      items.push({ label: "Steep Concave", amount: 15 });
    } else if (state.concave === "medium") {
      total += 8;
      items.push({ label: "Medium Concave", amount: 8 });
    }
    if (state.hardness === "101a") {
      total += 12;
      items.push({ label: "101a Wheels", amount: 12 });
    } else if (state.hardness === "99a") {
      total += 8;
      items.push({ label: "99a Wheels", amount: 8 });
    }
    if (state.tail === "swallow" || state.tail === "pin") {
      total += 20;
      items.push({ label: `${state.tail} tail`, amount: 20 });
    }
    if (state.fins === "quad" || state.fins === "thruster") {
      total += 25;
      items.push({ label: `${state.fins} fin setup`, amount: 25 });
    }
    return { items, total };
  }, [state, meta]);

  const price = priceBreakdown.total;

  // Save / export / share
  const saveToGarage = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast.error("Sign in to save to your Garage");
      return;
    }
    try {
      // Best-effort save; table may not exist yet.
      const { error } = await supabase.from("saved_designs" as any).insert({
        user_id: data.user.id,
        product,
        design: state as any,
        price,
      });
      if (error) throw error;
      toast.success("Saved to your Garage");
    } catch {
      const key = `liminal:garage:${data.user.id}`;
      const cur = JSON.parse(localStorage.getItem(key) || "[]");
      cur.unshift({ id: cryptoId(), product, state, price, at: Date.now() });
      localStorage.setItem(key, JSON.stringify(cur.slice(0, 50)));
      toast.success("Saved locally to your Garage");
    }
  };
  const exportPNG = async () => {
    const node = canvasRef.current;
    if (!node) return;
    // Rasterize via foreignObject + SVG
    const rect = node.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    const clone = node.cloneNode(true) as HTMLElement;
    clone.style.margin = "0";
    const xml = new XMLSerializer().serializeToString(clone);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><foreignObject width='100%' height='100%'>${xml.replace(
      /^<div /,
      "<div xmlns='http://www.w3.org/1999/xhtml' ",
    )}</foreignObject></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0);
      c.toBlob((b) => {
        if (!b) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `liminal-${product}-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      toast.error("Export failed — try again");
    };
    img.src = url;
  };
  const copyShareLink = async () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify({ product, state }))));
      const url = `${window.location.origin}/design-studio?d=${encoded}`;
      await navigator.clipboard.writeText(url);
      toast.success("Shareable link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  // Load from ?d= on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("d");
    if (!d) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(escape(atob(d))));
      if (parsed?.product && parsed?.state) {
        setProduct(parsed.product);
        setState(parsed.state);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio</p>
            <h1 className="text-3xl font-semibold md:text-4xl">Design Studio</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Load a template, drop your own graphics, dial in the specs — then save it to your
              Garage.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={!history.length}
                  aria-label="Undo"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Cmd/Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={!future.length}
                  aria-label="Redo"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Cmd/Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
            <div className="mx-1 h-6 w-px bg-border" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom((z) => Math.min(4, z + 0.1))}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  aria-label="Fit"
                >
                  Fit
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit to screen</TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Product picker */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(Object.keys(PRODUCTS) as ProductKey[]).map((k) => (
            <button
              key={k}
              onClick={() => switchProduct(k)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                product === k
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              {PRODUCTS[k].label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
          {/* LEFT: Tabs */}
          <aside className="rounded-lg border border-border bg-card p-3">
            <Tabs defaultValue="templates">
              <TabsList className="grid w-full grid-cols-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="templates" title="Templates">
                      <Sparkles className="h-3.5 w-3.5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Templates</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="text" title="Text">
                      <TypeIcon className="h-3.5 w-3.5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Text &amp; Typography</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="graphics" title="Decals">
                      <ImageIcon className="h-3.5 w-3.5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Decals ({ALL_DECALS.length})</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="adjust" title="Adjust">
                      <Contrast className="h-3.5 w-3.5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Photo Adjust</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="layout" title="Layout">
                      <Grid3x3 className="h-3.5 w-3.5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Layout</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="specs" title="Specs">
                      <Palette className="h-3.5 w-3.5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Specs</TooltipContent>
                </Tooltip>
              </TabsList>

              <TabsContent value="templates" className="mt-3 space-y-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.id)}
                    className="w-full rounded-md border border-border p-3 text-left transition hover:border-foreground"
                  >
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.blurb}</div>
                  </button>
                ))}
              </TabsContent>

              <TabsContent value="text" className="mt-3 space-y-3">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    addLayer(textLayer("YOUR TEXT", activeFace, 50, 50, FONTS[0], state.ink, 1))
                  }
                >
                  <TypeIcon className="mr-1 h-4 w-4" /> Add text
                </Button>
                {selected?.kind === "text" && (
                  <div className="space-y-2">
                    <Input
                      value={selected.text || ""}
                      onChange={(e) => patchLayer(selected.id, { text: e.target.value })}
                    />
                    <select
                      className="w-full rounded-md border border-border bg-background p-2 text-sm"
                      value={selected.font}
                      onChange={(e) => patchLayer(selected.id, { font: e.target.value })}
                    >
                      {FONTS.map((f) => (
                        <option key={f} value={f} style={{ fontFamily: f }}>
                          {f.split(",")[0]}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <Button
                        variant={selected.bold ? "default" : "outline"}
                        size="sm"
                        onClick={() => patchLayer(selected.id, { bold: !selected.bold })}
                      >
                        B
                      </Button>
                      <Button
                        variant={selected.italic ? "default" : "outline"}
                        size="sm"
                        onClick={() => patchLayer(selected.id, { italic: !selected.italic })}
                      >
                        <span className="italic">I</span>
                      </Button>
                      <Input
                        type="color"
                        className="h-9 w-14 p-1"
                        value={selected.color || "#000"}
                        onChange={(e) => patchLayer(selected.id, { color: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="graphics" className="mt-3 space-y-3">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground hover:border-foreground">
                  <Upload className="mb-1 h-4 w-4" />
                  Drop PNG/SVG or click
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/svg+xml,image/jpeg,image/webp"
                    multiple
                    onChange={(e) => onDropFile(e.target.files)}
                  />
                </label>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Canvas Decal Library
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/70">
                      {ALL_DECALS.length} decals
                    </span>
                  </div>
                  <div className="relative mb-2">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search stars, palm, gear…"
                      className="h-8 pl-7 text-xs"
                      value={decalSearch}
                      onChange={(e) => setDecalSearch(e.target.value)}
                    />
                  </div>
                  <Tabs defaultValue={DECAL_CATEGORIES[0].id}>
                    <TabsList className="grid h-auto w-full grid-cols-5">
                      {DECAL_CATEGORIES.slice(0, 10).map((cat) => (
                        <TabsTrigger key={cat.id} value={cat.id} className="px-1 py-1 text-[9px]">
                          {cat.label.split(" & ")[0].split(" ")[0]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {DECAL_CATEGORIES.map((cat) => {
                      const list = decalSearch.trim()
                        ? searchDecals(decalSearch, cat.decals)
                        : cat.decals;
                      return (
                        <TabsContent key={cat.id} value={cat.id} className="mt-2">
                          {list.length === 0 ? (
                            <p className="px-1 py-3 text-center text-[11px] text-muted-foreground">
                              No matches for “{decalSearch}”
                            </p>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {list.map((d) => (
                                <button
                                  key={d.id}
                                  title={d.label}
                                  onClick={() =>
                                    addLayer(
                                      formatPainter.current
                                        ? pasteStyle(stickerLayer(d.id, activeFace, 50, 50, 1))
                                        : stickerLayer(d.id, activeFace, 50, 50, 1),
                                    )
                                  }
                                  className="aspect-square rounded-md border border-border p-2 transition hover:border-foreground hover:bg-muted/50"
                                  style={{ color: state.ink }}
                                  dangerouslySetInnerHTML={{ __html: d.svg }}
                                />
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </div>
                {/* Metallic quick presets */}
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Metallic Finishes
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {METALLIC_PALETTES.map((p) => (
                      <button
                        key={p.id}
                        title={p.label}
                        onClick={() =>
                          commit((s) => ({ ...s, bg: p.bg, ink: p.ink, texture: "gloss" }))
                        }
                        className="aspect-video overflow-hidden rounded-md border border-border hover:border-foreground"
                        style={{ background: p.bg }}
                        aria-label={p.label}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adjust" className="mt-3 space-y-4">
                <Field label="Photo Filters">
                  <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(PHOTO_FILTERS) as FilterName[]).map((id) => (
                      <button
                        key={id}
                        onClick={() => setActiveFilter(id)}
                        className={`rounded-md border px-2 py-1.5 text-[10px] uppercase tracking-wider transition ${
                          activeFilter === id
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                        title={PHOTO_FILTERS[id].css}
                      >
                        {PHOTO_FILTERS[id].label}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label={`Brightness · ${adjustments.brightness}%`}>
                  <Slider
                    min={50}
                    max={150}
                    step={1}
                    value={[adjustments.brightness]}
                    onValueChange={([v]) => setAdjustments((a) => ({ ...a, brightness: v }))}
                  />
                </Field>
                <Field label={`Contrast · ${adjustments.contrast}%`}>
                  <Slider
                    min={50}
                    max={150}
                    step={1}
                    value={[adjustments.contrast]}
                    onValueChange={([v]) => setAdjustments((a) => ({ ...a, contrast: v }))}
                  />
                </Field>
                <Field label={`Saturation · ${adjustments.saturation}%`}>
                  <Slider
                    min={0}
                    max={200}
                    step={1}
                    value={[adjustments.saturation]}
                    onValueChange={([v]) => setAdjustments((a) => ({ ...a, saturation: v }))}
                  />
                </Field>
                <Field label={`Tint · ${adjustments.tint}°`}>
                  <Slider
                    min={-180}
                    max={180}
                    step={1}
                    value={[adjustments.tint]}
                    onValueChange={([v]) => setAdjustments((a) => ({ ...a, tint: v }))}
                  />
                </Field>{" "}
                <Field label={`Blur · ${adjustments.blur}px`}>
                  <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={[adjustments.blur]}
                    onValueChange={([v]) => setAdjustments((a) => ({ ...a, blur: v }))}
                  />
                </Field>
                <Field label="Paint Brushes">
                  <div className="grid grid-cols-2 gap-1.5">
                    {BRUSH_LIBRARY.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setBrushKind(b.id);
                          toast.info(`Brush: ${b.label} — preview only in v2`);
                        }}
                        className={`rounded-md border px-2 py-1.5 text-left text-[11px] transition ${
                          brushKind === b.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        <span className="block font-medium">{b.label}</span>
                        <span className="block text-[9px] opacity-70">{b.blurb}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Field label={`Size · ${brushSize}px`}>
                      <Slider
                        min={1}
                        max={64}
                        step={1}
                        value={[brushSize]}
                        onValueChange={([v]) => setBrushSize(v)}
                      />
                    </Field>
                    <Field label={`Opacity · ${brushOpacity}%`}>
                      <Slider
                        min={5}
                        max={100}
                        step={1}
                        value={[brushOpacity]}
                        onValueChange={([v]) => setBrushOpacity(v)}
                      />
                    </Field>
                  </div>
                </Field>
                <Field label="Clip Frame (image layers)">
                  <div className="grid grid-cols-3 gap-1.5">
                    {CLIP_FRAME_SHAPES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setClipFrame(c.id)}
                        className={`rounded-md border px-2 py-1.5 text-[10px] uppercase tracking-wider transition ${
                          clipFrame === c.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Tools">
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button variant="outline" size="sm" onClick={eyedropper}>
                      <Pipette className="mr-1 h-3.5 w-3.5" /> Eyedropper
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyStyle}>
                      <Brush className="mr-1 h-3.5 w-3.5" /> Format Painter
                    </Button>
                    <Button variant="outline" size="sm" onClick={shufflePalette}>
                      <Droplet className="mr-1 h-3.5 w-3.5" /> Shuffle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={distributeHorizontally}
                      disabled={facedLayers.length < 3}
                    >
                      <ChevronsLeftRight className="mr-1 h-3.5 w-3.5" /> Distribute
                    </Button>
                  </div>
                </Field>
              </TabsContent>

              <TabsContent value="layout" className="mt-3 space-y-4">
                <Field label="Canvas Dimensions">
                  <div className="grid grid-cols-2 gap-1.5">
                    {PAGE_SIZES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() =>
                          commit((s) => ({
                            ...s,
                            canvasWidth: p.width,
                            canvasHeight: p.height,
                            canvasUnit: p.unit,
                          }))
                        }
                        className={`rounded-md border px-2 py-2 text-left text-[11px] transition ${
                          state.canvasWidth === p.width
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        <span className="block font-display text-[12px] font-semibold">
                          {p.label}
                        </span>
                        <span className="block font-mono text-[9px] opacity-70">
                          {p.width}×{p.height} {p.unit}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Collage Grids">
                  <div className="grid grid-cols-3 gap-1.5">
                    {[2, 3, 4, 6, 9].map((n) => (
                      <button
                        key={n}
                        onClick={() => toast.info(`Collage grid ${n}×${n} — preview only in v2`)}
                        className="flex aspect-video items-center justify-center rounded-md border border-border hover:border-foreground"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-widest">
                          {n}×{n}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Charts (preview)">
                  <div className="grid grid-cols-3 gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info("Bar chart — preview only in v2")}
                    >
                      <ChartBar className="mr-1 h-3.5 w-3.5" /> Bar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info("Pie chart — preview only in v2")}
                    >
                      <ChartPie className="mr-1 h-3.5 w-3.5" /> Pie
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info("Progress ring — preview only in v2")}
                    >
                      <Activity className="mr-1 h-3.5 w-3.5" /> Ring
                    </Button>
                  </div>
                </Field>
                <Field label="Color Mode">
                  <div className="flex items-center justify-between rounded-md border border-border p-2 text-xs">
                    <span className="uppercase tracking-wider text-muted-foreground">
                      CMYK preview
                    </span>
                    <Switch
                      checked={!!state.cmykPreview}
                      onCheckedChange={(v) => commit((s) => ({ ...s, cmykPreview: v }))}
                    />
                  </div>
                </Field>
                <Field label="Canvas Guidelines">
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between rounded-md border border-border p-2 text-xs">
                      <span>Show rulers</span>
                      <Switch checked={showRulers} onCheckedChange={setShowRulers} />
                    </label>
                    <label className="flex items-center justify-between rounded-md border border-border p-2 text-xs">
                      <span>Snap to center</span>
                      <Switch checked={showCenterLines} onCheckedChange={setShowCenterLines} />
                    </label>
                  </div>
                </Field>
                <Field label="Project">
                  <Button variant="outline" size="sm" className="w-full" onClick={duplicateProject}>
                    <Files className="mr-1 h-3.5 w-3.5" /> Duplicate project
                  </Button>
                </Field>
              </TabsContent>

              <TabsContent value="specs" className="mt-3 space-y-4">
                <ColorRow
                  label="Background"
                  value={state.bg}
                  onChange={(bg) => commit((s) => ({ ...s, bg }))}
                />
                <ColorRow
                  label="Ink"
                  value={state.ink}
                  onChange={(ink) => commit((s) => ({ ...s, ink }))}
                />
                <Field label="Texture">
                  <select
                    className="w-full rounded-md border border-border bg-background p-2 text-sm"
                    value={state.texture}
                    onChange={(e) => commit((s) => ({ ...s, texture: e.target.value }))}
                  >
                    {TEXTURES.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>

                {product === "skateboard" && (
                  <>
                    <Field label="Concave">
                      <Segmented
                        options={["mellow", "medium", "steep"]}
                        value={state.concave || "medium"}
                        onChange={(v) => commit((s) => ({ ...s, concave: v as any }))}
                      />
                    </Field>
                    <Field label="Wheel hardness">
                      <Segmented
                        options={["78a", "99a", "101a"]}
                        value={state.hardness || "99a"}
                        onChange={(v) => commit((s) => ({ ...s, hardness: v as any }))}
                      />
                    </Field>
                    <Field label="Mounting bolts">
                      <div className="flex flex-wrap gap-2">
                        {BRAND_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => commit((s) => ({ ...s, bolts: c }))}
                            className={`h-7 w-7 rounded-full border-2 ${
                              state.bolts === c ? "border-foreground" : "border-transparent"
                            }`}
                            style={{ background: c }}
                            aria-label={`Bolt ${c}`}
                          />
                        ))}
                      </div>
                    </Field>
                  </>
                )}
                {product === "surfboard" && (
                  <>
                    <Field label="Tail shape">
                      <Segmented
                        options={["squash", "swallow", "pin"]}
                        value={state.tail || "squash"}
                        onChange={(v) => commit((s) => ({ ...s, tail: v as any }))}
                      />
                    </Field>
                    <Field label="Fin setup">
                      <Segmented
                        options={["single", "twin", "thruster", "quad"]}
                        value={state.fins || "thruster"}
                        onChange={(v) => commit((s) => ({ ...s, fins: v as any }))}
                      />
                    </Field>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </aside>

          {/* CENTER: Canvas */}
          <section>
            {/* Face tabs */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {meta.faces.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFace(f)}
                    className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${
                      activeFace === f
                        ? "border-foreground bg-foreground text-background"
                        : "border-border"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                <Button variant="outline" size="sm" onClick={centerX} disabled={!selected}>
                  <Crosshair className="mr-1 h-3.5 w-3.5" /> Center X
                </Button>
                <Button variant="outline" size="sm" onClick={centerY} disabled={!selected}>
                  <Crosshair className="mr-1 h-3.5 w-3.5 rotate-90" /> Center Y
                </Button>
                <Button variant="outline" size="sm" onClick={fitCanvas} disabled={!selected}>
                  <Maximize2 className="mr-1 h-3.5 w-3.5" /> Fit
                </Button>
                <Button variant="outline" size="sm" onClick={rot90} disabled={!selected}>
                  <RotateCw className="mr-1 h-3.5 w-3.5" /> 90°
                </Button>
              </div>
            </div>

            <div
              className="relative mx-auto flex items-center justify-center rounded-lg border border-border bg-muted/30 p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onDropFile(e.dataTransfer.files);
              }}
            >
              <div
                ref={canvasRef}
                className="relative overflow-hidden shadow-lg"
                style={{
                  width: "min(560px, 100%)",
                  aspectRatio: `${meta.ratio}`,
                  background: textureBackground(state.bg, state.texture),
                  borderRadius: shapeRadius(product),
                  clipPath: shapeClip(product, state),
                }}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedId(null);
                }}
              >
                {/* Snap guides */}
                {snapLines.x && (
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary/70" />
                )}
                {snapLines.y && (
                  <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary/70" />
                )}

                {facedLayers.map((l) => (
                  <div
                    key={l.id}
                    onPointerDown={(e) => onPointerDown(e, l.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(l.id);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 select-none ${
                      selectedId === l.id ? "outline outline-2 outline-primary" : ""
                    } ${l.locked ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}`}
                    style={{
                      left: `${l.x}%`,
                      top: `${l.y}%`,
                      transform: `translate(-50%,-50%) rotate(${l.rotation}deg) scale(${l.scale})`,
                    }}
                  >
                    {l.kind === "text" && (
                      <div
                        style={{
                          fontFamily: l.font,
                          color: l.recolor || l.color,
                          fontWeight: l.bold ? 700 : 400,
                          fontStyle: l.italic ? "italic" : "normal",
                          fontSize: 24,
                          whiteSpace: "nowrap",
                          opacity: (l.opacity ?? 100) / 100,
                          letterSpacing: l.letterSpacing ? `${l.letterSpacing}px` : undefined,
                          lineHeight: l.lineHeight || undefined,
                          transform: `scale(${l.flipX ? -1 : 1}, ${l.flipY ? -1 : 1})`,
                          textShadow:
                            l.effect === "shadow"
                              ? "2px 2px 4px rgba(0,0,0,0.5)"
                              : l.effect === "neon"
                                ? "0 0 6px currentColor, 0 0 12px currentColor"
                                : l.effect === "hollow"
                                  ? "0 0 1px #fff, 0 0 1px #fff"
                                  : l.effect === "3d-block"
                                    ? "3px 3px 0 rgba(0,0,0,0.4)"
                                    : "none",
                          WebkitTextStroke: l.effect === "hollow" ? "1px currentColor" : undefined,
                          color: l.effect === "retro-wave" ? "transparent" : l.recolor || l.color,
                          backgroundImage:
                            l.effect === "retro-wave"
                              ? "linear-gradient(180deg, currentColor 0%, currentColor 60%, transparent 60%)"
                              : undefined,
                          WebkitBackgroundClip: l.effect === "retro-wave" ? "text" : undefined,
                          display: l.arched ? "inline-block" : undefined,
                        }}
                      >
                        {l.text}
                      </div>
                    )}
                    {l.kind === "image" && l.src && (
                      <img
                        src={l.src}
                        alt=""
                        draggable={false}
                        style={{
                          width: 140,
                          height: "auto",
                          pointerEvents: "none",
                          opacity: (l.opacity ?? 100) / 100,
                          filter: layerCssFilter !== "none" ? layerCssFilter : undefined,
                          clipPath:
                            CLIP_FRAME_SHAPES.find((c) => c.id === clipFrame)?.clipPath ||
                            undefined,
                          transform: `scale(${l.flipX ? -1 : 1}, ${l.flipY ? -1 : 1})`,
                        }}
                      />
                    )}
                    {l.kind === "sticker" && l.src && (
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          color: l.recolor || l.color || state.ink,
                          opacity: (l.opacity ?? 100) / 100,
                          transform: `scale(${l.flipX ? -1 : 1}, ${l.flipY ? -1 : 1})`,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: resolveDecalSvg(l.src) || "",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown + actions */}
            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              <div className="mb-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Price Breakdown
                </div>
                <div className="space-y-1.5">
                  {priceBreakdown.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono">${item.amount.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider">Subtotal</span>
                  <span className="text-2xl font-bold font-display">
                    ${priceBreakdown.total.toFixed(0)} AUD
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={copyShareLink}>
                  <Link2 className="mr-1 h-4 w-4" /> Copy link
                </Button>
                <Button variant="outline" onClick={exportPNG}>
                  <Download className="mr-1 h-4 w-4" /> Export PNG
                </Button>
                <Button onClick={saveToGarage}>
                  <Save className="mr-1 h-4 w-4" /> Save to Garage
                </Button>
              </div>
            </div>
          </section>

          {/* RIGHT: Layers + selected controls */}
          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Layers className="h-4 w-4" /> Layers
              </div>
              {facedLayers.length === 0 && (
                <p className="text-xs text-muted-foreground">Nothing on this face yet.</p>
              )}
              <ul className="space-y-1">
                {facedLayers
                  .slice()
                  .reverse()
                  .map((l) => (
                    <li
                      key={l.id}
                      className={`flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs ${
                        selectedId === l.id ? "border-foreground" : "border-border"
                      }`}
                    >
                      <button
                        className="flex-1 truncate text-left"
                        onClick={() => setSelectedId(l.id)}
                      >
                        {l.kind === "text"
                          ? `T · ${l.text}`
                          : l.kind === "sticker"
                            ? `★ ${l.src}`
                            : `🖼 image`}
                      </button>
                      <button title="Up" onClick={() => reorderLayer(l.id, 1)}>
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button title="Down" onClick={() => reorderLayer(l.id, -1)}>
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title={l.locked ? "Unlock" : "Lock"}
                        onClick={() => patchLayer(l.id, { locked: !l.locked })}
                      >
                        {l.locked ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : (
                          <Unlock className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button title="Delete" onClick={() => deleteLayer(l.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            {selected && (
              <div className="space-y-3 rounded-lg border border-border bg-card p-3">
                <div className="text-sm font-medium">Selected</div>
                <div>
                  <Label className="text-xs">Scale</Label>
                  <Slider
                    min={0.2}
                    max={3}
                    step={0.05}
                    value={[selected.scale]}
                    onValueChange={([v]) => patchLayer(selected.id, { scale: v })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Rotation</Label>
                  <Slider
                    min={-180}
                    max={180}
                    step={1}
                    value={[selected.rotation]}
                    onValueChange={([v]) => patchLayer(selected.id, { rotation: v })}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ---------- Small components ----------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
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
  // If the value is a gradient, we can't feed it to <input type=color>; store a solid fallback.
  const isGradient = /gradient\(/i.test(value);
  const solid = isGradient ? "#888888" : value;
  const [h, s, l] = useMemo(() => hexToHsl(solid), [solid]);
  const setHsl = (nh: number, ns: number, nl: number) => onChange(hslToHex(nh, ns, nl));
  return (
    <Field label={label}>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="color"
            className="h-9 w-14 p-1"
            value={solid}
            onChange={(e) => onChange(e.target.value)}
          />
          <div
            className="h-9 flex-1 min-w-[80px] rounded-md border border-border"
            style={{ background: value }}
            aria-label="Current color"
          />
          {BRAND_COLORS.map((c) => (
            <button
              key={c}
              className={`h-6 w-6 rounded-full border-2 ${value === c ? "border-foreground" : "border-transparent"}`}
              style={{ background: c }}
              onClick={() => onChange(c)}
              aria-label={c}
            />
          ))}
        </div>
        {/* HSL wheel-style sliders */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <label className="space-y-1">
            <span>Hue</span>
            <input
              type="range"
              min={0}
              max={360}
              value={h}
              onChange={(e) => setHsl(Number(e.target.value), s, l)}
              className="w-full accent-primary"
              style={{ background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }}
            />
          </label>
          <label className="space-y-1">
            <span>Sat</span>
            <input
              type="range"
              min={0}
              max={100}
              value={s}
              onChange={(e) => setHsl(h, Number(e.target.value), l)}
              className="w-full accent-primary"
            />
          </label>
          <label className="space-y-1">
            <span>Lum</span>
            <input
              type="range"
              min={0}
              max={100}
              value={l}
              onChange={(e) => setHsl(h, s, Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>
        </div>
        {/* Metallic preset chips */}
        <div className="flex flex-wrap gap-1.5">
          {METALLIC_PALETTES.map((p) => (
            <button
              key={p.id}
              title={p.label}
              onClick={() => onChange(p.bg)}
              className="h-6 w-10 rounded-md border border-border hover:border-foreground"
              style={{ background: p.bg }}
              aria-label={p.label}
            />
          ))}
        </div>
      </div>
    </Field>
  );
}

function hexToHsl(hex: string): [number, number, number] {
  const m = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i.exec(hex || "");
  if (!m) return [0, 0, 50];
  let raw = m[1];
  if (raw.length === 3)
    raw = raw
      .split("")
      .map((c) => c + c)
      .join("");
  const r = parseInt(raw.slice(0, 2), 16) / 255;
  const g = parseInt(raw.slice(2, 4), 16) / 255;
  const b = parseInt(raw.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}
function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`flex-1 rounded px-2 py-1 text-xs uppercase tracking-wider ${
            value === o ? "bg-foreground text-background" : "hover:bg-muted"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ---------- Helpers ----------
function StudioSpecsExtra({
  onApply,
}: {
  onApply: (updater: (s: DesignState) => DesignState) => void;
}) {
  const applyTheme = (t: StudioTheme) => {
    onApply((s) => ({ ...s, bg: t.palette.bg, ink: t.palette.ink }));
  };
  const applySwatch = (sw: PaletteSwatch) => {
    onApply((s) => ({ ...s, ink: sw.hex }));
  };
  return (
    <div className="space-y-4 border-t border-border/40 pt-4">
      <Field label="Studio Theme & Mood — 50 presets">
        <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto pr-1 rounded-sm border border-border/40 bg-background/30 p-1.5">
          {STUDIO_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              title={`${t.label} — ${t.mood}`}
              onClick={() => applyTheme(t)}
              className="aspect-square rounded-sm border border-border/60 hover:border-primary relative overflow-hidden group transition-colors"
              style={{ background: t.palette.bg }}
            >
              <span
                className="absolute inset-x-0 bottom-0 text-[7px] font-mono uppercase tracking-widest truncate text-center px-0.5 py-0.5"
                style={{ color: t.palette.ink }}
              >
                {t.label.slice(0, 8)}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Click a preset to apply scoped palette to the studio canvas. The outer website theme is
          NOT touched.
        </p>
      </Field>

      <Field label="Soft & Hot Color Palettes">
        <div className="space-y-2.5">
          {[...SOFT_PALETTES, ...HOT_PALETTES].map((g) => (
            <div key={g.id} className="border border-border/40 rounded-sm p-2 bg-background/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono uppercase tracking-widest">
                  {g.label}
                  <span
                    className={`ml-1.5 ${
                      g.mood === "hot"
                        ? "text-primary"
                        : g.mood === "soft"
                          ? "text-amber-300"
                          : "text-muted-foreground"
                    }`}
                  >
                    · {g.mood.toUpperCase()}
                  </span>
                </span>
                <span className="text-[8px] text-muted-foreground font-mono">
                  {g.swatches.length} hues
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {g.swatches.map((sw) => (
                  <button
                    key={sw.hex}
                    type="button"
                    title={`${sw.label} — ${sw.hex}`}
                    onClick={() => applySwatch(sw)}
                    className="h-8 rounded-sm border border-border/60 hover:border-primary relative group transition-colors"
                    style={{ background: sw.hex }}
                  >
                    <span className="sr-only">{sw.label}</span>
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest bg-background/95 border border-border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                      {sw.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Hover for name. Click to apply ink color to current layer.
        </p>
      </Field>
    </div>
  );
}

function initialState(product: ProductKey): DesignState {
  return {
    product,
    face: PRODUCTS[product].faces[0],
    bg: "#f4f1ea",
    ink: "#0b0b0f",
    texture: product === "surfboard" ? "gloss" : product === "skateboard" ? "wood" : "cotton",
    concave: "medium",
    hardness: "99a",
    bolts: "#0b0b0f",
    tail: "squash",
    fins: "thruster",
    layers: [],
  };
}
function textureBackground(bg: string, tex: string) {
  switch (tex) {
    case "grip":
      return `radial-gradient(rgba(0,0,0,0.5) 1px, transparent 1px) 0 0/6px 6px, ${bg}`;
    case "wood":
      return `repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 2px, transparent 2px 8px), ${bg}`;
    case "gloss":
      return `linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%), ${bg}`;
    case "cotton":
      return `repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px), ${bg}`;
    default:
      return bg;
  }
}
function shapeRadius(product: ProductKey) {
  if (product === "skateboard") return "9999px";
  if (product === "surfboard") return "9999px";
  if (product === "cap") return "40% 40% 20% 20%";
  return "12px";
}
function shapeClip(product: ProductKey, s: DesignState) {
  if (product === "surfboard") {
    if (s.tail === "pin") return "polygon(50% 0, 100% 20%, 50% 100%, 0 20%)";
    if (s.tail === "swallow") return "polygon(50% 0, 100% 20%, 85% 100%, 50% 90%, 15% 100%, 0 20%)";
    return "polygon(50% 0, 100% 20%, 90% 100%, 10% 100%, 0 20%)";
  }
  return "none";
}

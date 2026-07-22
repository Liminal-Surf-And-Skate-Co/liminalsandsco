// ── Design Studio Types ──────────────────────────────────────

export type ProductCategory = "hardware" | "apparel";
export type ProductSubType = "skate" | "surf" | "tee" | "hoodie";
export type HardwareView = "top" | "bottom";
export type ApparelView = "front" | "back" | "sleeve";
export type ViewId = HardwareView | ApparelView;

export type LayerType = "text" | "image" | "preset" | "sticker";
export type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten";

export type TextFX = {
  curved?: boolean;
  outline?: boolean;
  shadow?: boolean;
  distressed?: boolean;
};

export type DesignLayer = {
  id: string;
  type: LayerType;
  value: string;
  view: ViewId;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  blendMode: BlendMode;
  fx?: TextFX;
  zIndex: number;
};

export type TextureOverlay = "none" | "grip-tape" | "maple-grain" | "fiberglass" | "cotton-weave";

export type ConcaveProfile = "mellow" | "medium" | "steep";

export type SkateSpecs = {
  trackWidth: string;
  wheelHardness: string;
  deckWidth: string;
  concave: ConcaveProfile;
  boltColor: string;
  gripWindow: boolean;
  veneerTop: string;
  veneerMid: string;
  wheelCoreColor: string;
  wheelSidewall: string;
};

export type SurfSpecs = {
  length: string;
  width: string;
  thickness: string;
  volumeLiters: number;
  tailType: string;
  finSystem: "futures" | "fcs2";
  finColor: string;
  railSpray: string;
  stringerAccent: string;
};

export type DesignState = {
  category: ProductCategory;
  subType: ProductSubType;
  view: ViewId;
  baseColor: string;
  layers: DesignLayer[];
  specs: Record<string, string>;
  skateSpecs: Partial<SkateSpecs>;
  surfSpecs: Partial<SurfSpecs>;
  texture: TextureOverlay;
  showSafeArea: boolean;
  showScaleGuide: boolean;
  advancedMode: boolean;
};

// ── Constants ────────────────────────────────────────────────

export const BASE_PRICES: Record<ProductSubType, number> = {
  skate: 60,
  surf: 120,
  tee: 35,
  hoodie: 45,
};

export const PRICE_MODIFIERS = {
  text: 5,
  image: 10,
  specs: 15,
  fx: 5,
  concave: 8,
  gripWindow: 5,
  coloredBolts: 3,
  veneerStain: 7,
  wheelCore: 4,
  finColor: 6,
  railSpray: 8,
  stringerAccent: 5,
} as const;

export const BASE_COLORS = [
  { name: "Natural", value: "#d4c5a0" },
  { name: "Black", value: "#1a1a1a" },
  { name: "White", value: "#f5f5f5" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Forest", value: "#2d5a3d" },
  { name: "Crimson", value: "#8b1a1a" },
  { name: "Sunset", value: "#e85d04" },
  { name: "Ocean", value: "#0077b6" },
] as const;

export type ColorPalette = { name: string; colors: string[] };

export const COLOR_PALETTES: ColorPalette[] = [
  { name: "Venice 70s", colors: ["#e85d04", "#d4c5a0", "#8b1a1a", "#2d5a3d", "#f5f5f5"] },
  { name: "Cyber Neon", colors: ["#ff00ff", "#00ffff", "#1a1a1a", "#0077b6", "#e85d04"] },
  { name: "Street Mono", colors: ["#1a1a1a", "#3a3a3a", "#6a6a6a", "#9a9a9a", "#f5f5f5"] },
  { name: "Earthy Skate", colors: ["#2d5a3d", "#d4c5a0", "#8b6914", "#5a3a1a", "#1a1a1a"] },
];

export type StickerPack = {
  id: string;
  name: string;
  category: "y2k" | "retro" | "street" | "mascot" | "flames";
  glyph: string;
};

export const STICKERS: StickerPack[] = [
  { id: "y2k-chrome", name: "Y2K Chrome", category: "y2k", glyph: "✦" },
  { id: "y2k-cross", name: "Y2K Cross", category: "y2k", glyph: "✠" },
  { id: "y2k-star", name: "Y2K Star", category: "y2k", glyph: "★" },
  { id: "retro-wave", name: "Retro Wave", category: "retro", glyph: "≋" },
  { id: "retro-sun", name: "Retro Sun", category: "retro", glyph: "☀" },
  { id: "retro-palm", name: "Retro Palm", category: "retro", glyph: "🌴" },
  { id: "spray-stencil", name: "Spray Stencil", category: "street", glyph: "▓" },
  { id: "spray-drip", name: "Spray Drip", category: "street", glyph: "↓" },
  { id: "street-tag", name: "Street Tag", category: "street", glyph: "@" },
  { id: "flame-classic", name: "Classic Flame", category: "flames", glyph: "🔥" },
  { id: "flame-skull", name: "Skull Flame", category: "flames", glyph: "☠" },
  { id: "liam-mascot", name: "Liam Llama", category: "mascot", glyph: "🦙" },
  { id: "liam-badge", name: "Liam Badge", category: "mascot", glyph: "★" },
  { id: "liam-crown", name: "Liam Crown", category: "mascot", glyph: "♛" },
];

export const STICKER_CATEGORIES = ["all", "y2k", "retro", "street", "mascot", "flames"] as const;

export const TEXTURES: { id: TextureOverlay; label: string; subTypes: ProductSubType[] }[] = [
  { id: "none", label: "None", subTypes: ["skate", "surf", "tee", "hoodie"] },
  { id: "grip-tape", label: "Grip Tape Grit", subTypes: ["skate"] },
  { id: "maple-grain", label: "Stained Maple Grain", subTypes: ["skate", "surf"] },
  { id: "fiberglass", label: "High-Gloss Fiberglass", subTypes: ["surf"] },
  { id: "cotton-weave", label: "Heavy Cotton Weave", subTypes: ["tee", "hoodie"] },
];

export const CONCAVE_PROFILES: { id: ConcaveProfile; label: string; description: string }[] = [
  { id: "mellow", label: "Mellow", description: "Gentle U-shape — stable for cruising" },
  { id: "medium", label: "Medium", description: "Balanced pop and control" },
  { id: "steep", label: "Steep", description: "Deep concave — locked-in for tech" },
];

export const WHEEL_HARDNESS = ["78a", "92a", "95a", "99a", "101a"] as const;
export const BOLT_COLORS = ["#1a1a1a", "#f5f5f5", "#e85d04", "#0077b6", "#8b1a1a", "#2d5a3d"] as const;
export const VENEER_COLORS = ["#d4c5a0", "#8b6914", "#5a3a1a", "#2d5a3d", "#1a1a1a", "#1e3a5f"] as const;

export const FIN_SYSTEMS = [
  { id: "futures", label: "Futures", description: "Single-tab, strong hold" },
  { id: "fcs2", label: "FCS II", description: "Quick-release, toolless" },
] as const;

export const FIN_COLORS = ["#1a1a1a", "#f5f5f5", "#e85d04", "#0077b6", "#8b1a1a"] as const;
export const RAIL_SPRAY_COLORS = ["none", "#e85d04", "#0077b6", "#8b1a1a", "#2d5a3d", "#ff00ff"] as const;
export const STRINGER_COLORS = ["none", "#1a1a1a", "#e85d04", "#0077b6", "#8b1a1a"] as const;

export const HARDWARE_VIEWS: { id: HardwareView; label: string }[] = [
  { id: "top", label: "Top (Grip)" },
  { id: "bottom", label: "Bottom (Graphic)" },
];

export const APPAREL_VIEWS: { id: ApparelView; label: string }[] = [
  { id: "front", label: "Front Chest" },
  { id: "back", label: "Back Layout" },
  { id: "sleeve", label: "Left Sleeve" },
];

export const BLEND_MODES: { id: BlendMode; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "multiply", label: "Multiply" },
  { id: "screen", label: "Screen" },
  { id: "overlay", label: "Overlay" },
  { id: "darken", label: "Darken" },
  { id: "lighten", label: "Lighten" },
];

// ── Starter Templates ───────────────────────────────────────

export type StarterTemplate = {
  id: string;
  name: string;
  description: string;
  subType: ProductSubType;
  baseColor: string;
  layers: Omit<DesignLayer, "id" | "zIndex">[];
  texture: TextureOverlay;
};

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "cyber-y2k",
    name: "Cyber Y2K",
    description: "Chrome crosses, neon stars, high-contrast",
    subType: "skate",
    baseColor: "#1a1a1a",
    texture: "grip-tape",
    layers: [
      { type: "text", value: "CYBER", view: "bottom", x: 50, y: 30, scale: 1.2, rotation: 0, opacity: 1, locked: false, blendMode: "normal", fx: { outline: true, shadow: true } },
      { type: "sticker", value: "✦", view: "bottom", x: 25, y: 60, scale: 1.5, rotation: 15, opacity: 0.9, locked: false, blendMode: "screen" },
      { type: "sticker", value: "✠", view: "bottom", x: 75, y: 60, scale: 1.5, rotation: -10, opacity: 0.9, locked: false, blendMode: "screen" },
    ],
  },
  {
    id: "70s-surf-wave",
    name: "70s Surf Wave",
    description: "Retro sun, palm, warm earth tones",
    subType: "surf",
    baseColor: "#d4c5a0",
    texture: "fiberglass",
    layers: [
      { type: "sticker", value: "☀", view: "bottom", x: 50, y: 25, scale: 2, rotation: 0, opacity: 1, locked: false, blendMode: "normal" },
      { type: "text", value: "ENDLESS", view: "bottom", x: 50, y: 65, scale: 1, rotation: 0, opacity: 1, locked: false, blendMode: "normal", fx: { curved: true } },
      { type: "sticker", value: "🌴", view: "bottom", x: 20, y: 75, scale: 1.2, rotation: 0, opacity: 0.8, locked: false, blendMode: "normal" },
    ],
  },
  {
    id: "minimalist-street",
    name: "Minimalist Street",
    description: "Clean type, monochrome, no clutter",
    subType: "skate",
    baseColor: "#f5f5f5",
    texture: "none",
    layers: [
      { type: "text", value: "STREET", view: "bottom", x: 50, y: 50, scale: 1.5, rotation: 0, opacity: 1, locked: false, blendMode: "normal", fx: { outline: true } },
    ],
  },
  {
    id: "neon-flame",
    name: "Neon Flame",
    description: "Skull flames, bold sunset gradient",
    subType: "skate",
    baseColor: "#8b1a1a",
    texture: "maple-grain",
    layers: [
      { type: "sticker", value: "☠", view: "bottom", x: 50, y: 35, scale: 2.5, rotation: 0, opacity: 1, locked: false, blendMode: "normal" },
      { type: "sticker", value: "🔥", view: "bottom", x: 30, y: 65, scale: 1.5, rotation: -15, opacity: 0.9, locked: false, blendMode: "overlay" },
      { type: "sticker", value: "🔥", view: "bottom", x: 70, y: 65, scale: 1.5, rotation: 15, opacity: 0.9, locked: false, blendMode: "overlay" },
      { type: "text", value: "BURN", view: "bottom", x: 50, y: 80, scale: 1, rotation: 0, opacity: 1, locked: false, blendMode: "normal", fx: { shadow: true } },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────

export function defaultDesignState(): DesignState {
  return {
    category: "hardware",
    subType: "skate",
    view: "top",
    baseColor: BASE_COLORS[0].value,
    layers: [],
    specs: {},
    skateSpecs: {},
    surfSpecs: {},
    texture: "none",
    showSafeArea: false,
    showScaleGuide: false,
    advancedMode: false,
  };
}

export function makeLayer(
  type: LayerType,
  value: string,
  view: ViewId,
  zIndex: number,
  fx?: TextFX,
): DesignLayer {
  return {
    id: `${type === "text" ? "txt" : type === "image" ? "img" : "stk"}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    value,
    view,
    x: 50,
    y: 50,
    scale: 1,
    rotation: 0,
    opacity: 1,
    locked: false,
    blendMode: "normal",
    fx,
    zIndex,
  };
}

export function applyTemplate(template: StarterTemplate): DesignState {
  const base = defaultDesignState();
  const layers: DesignLayer[] = template.layers.map((l, i) => ({
    ...l,
    id: `tpl-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
    zIndex: i,
  }));
  return {
    ...base,
    subType: template.subType,
    category: template.subType === "skate" || template.subType === "surf" ? "hardware" : "apparel",
    view: template.subType === "skate" || template.subType === "surf" ? "bottom" : "front",
    baseColor: template.baseColor,
    texture: template.texture,
    layers,
  };
}

export function calculatePrice(state: DesignState): number {
  let price = BASE_PRICES[state.subType];

  const hasText = state.layers.some((l) => l.type === "text" && l.value.trim());
  const hasImage = state.layers.some((l) => l.type === "image" && l.value);
  const hasSpecs = Object.values(state.specs).some((v) => v);
  const hasFX = state.layers.some(
    (l) => l.fx && (l.fx.curved || l.fx.outline || l.fx.shadow || l.fx.distressed),
  );

  if (hasText) price += PRICE_MODIFIERS.text;
  if (hasImage) price += PRICE_MODIFIERS.image;
  if (hasSpecs) price += PRICE_MODIFIERS.specs;
  if (hasFX) price += PRICE_MODIFIERS.fx;

  // Skate hardware add-ons
  if (state.subType === "skate") {
    const ss = state.skateSpecs;
    if (ss.concave && ss.concave !== "mellow") price += PRICE_MODIFIERS.concave;
    if (ss.gripWindow) price += PRICE_MODIFIERS.gripWindow;
    if (ss.boltColor && ss.boltColor !== "#1a1a1a") price += PRICE_MODIFIERS.coloredBolts;
    if (ss.veneerTop && ss.veneerTop !== "#d4c5a0") price += PRICE_MODIFIERS.veneerStain;
    if (ss.wheelCoreColor && ss.wheelCoreColor !== "#1a1a1a") price += PRICE_MODIFIERS.wheelCore;
  }

  // Surf hardware add-ons
  if (state.subType === "surf") {
    const sf = state.surfSpecs;
    if (sf.finColor && sf.finColor !== "#1a1a1a") price += PRICE_MODIFIERS.finColor;
    if (sf.railSpray && sf.railSpray !== "none") price += PRICE_MODIFIERS.railSpray;
    if (sf.stringerAccent && sf.stringerAccent !== "none") price += PRICE_MODIFIERS.stringerAccent;
  }

  return price;
}

export function priceBreakdown(state: DesignState): { label: string; amount: number }[] {
  const items: { label: string; amount: number }[] = [
    { label: `Base (${state.subType})`, amount: BASE_PRICES[state.subType] },
  ];
  if (state.layers.some((l) => l.type === "text" && l.value.trim()))
    items.push({ label: "Custom text", amount: PRICE_MODIFIERS.text });
  if (state.layers.some((l) => l.type === "image" && l.value))
    items.push({ label: "Image upload", amount: PRICE_MODIFIERS.image });
  if (Object.values(state.specs).some((v) => v))
    items.push({ label: "Equipment specs", amount: PRICE_MODIFIERS.specs });
  if (state.layers.some((l) => l.fx && (l.fx.curved || l.fx.outline || l.fx.shadow || l.fx.distressed)))
    items.push({ label: "Text FX", amount: PRICE_MODIFIERS.fx });

  if (state.subType === "skate") {
    const ss = state.skateSpecs;
    if (ss.concave && ss.concave !== "mellow") items.push({ label: "Concave profile", amount: PRICE_MODIFIERS.concave });
    if (ss.gripWindow) items.push({ label: "Grip tape window", amount: PRICE_MODIFIERS.gripWindow });
    if (ss.boltColor && ss.boltColor !== "#1a1a1a") items.push({ label: "Colored bolts", amount: PRICE_MODIFIERS.coloredBolts });
    if (ss.veneerTop && ss.veneerTop !== "#d4c5a0") items.push({ label: "Veneer stain", amount: PRICE_MODIFIERS.veneerStain });
    if (ss.wheelCoreColor && ss.wheelCoreColor !== "#1a1a1a") items.push({ label: "Wheel core color", amount: PRICE_MODIFIERS.wheelCore });
  }
  if (state.subType === "surf") {
    const sf = state.surfSpecs;
    if (sf.finColor && sf.finColor !== "#1a1a1a") items.push({ label: "Fin color", amount: PRICE_MODIFIERS.finColor });
    if (sf.railSpray && sf.railSpray !== "none") items.push({ label: "Rail spray", amount: PRICE_MODIFIERS.railSpray });
    if (sf.stringerAccent && sf.stringerAccent !== "none") items.push({ label: "Stringer accent", amount: PRICE_MODIFIERS.stringerAccent });
  }

  return items;
}

export function validateTrackWidth(deckWidth: string | undefined, trackWidth: string | undefined): string | null {
  if (!deckWidth || !trackWidth) return null;
  const dw = parseFloat(deckWidth);
  const tw = parseFloat(trackWidth);
  if (isNaN(dw) || isNaN(tw)) return null;
  if (tw > dw) return `Track width (${tw}") exceeds deck width (${dw}")`;
  if (tw < dw - 0.75) return `Track width (${tw}") is too narrow for deck (${dw}")`;
  return null;
}

export function calcSurfVolume(lengthIn: string, widthIn: string, thicknessIn: string): number {
  const l = parseFloat(lengthIn) || 0;
  const w = parseFloat(widthIn) || 0;
  const t = parseFloat(thicknessIn) || 0;
  if (!l || !w || !t) return 0;
  // Simplified: volume in liters ≈ (L * W * T * 0.54) / 61.02 (cubic inches to liters with shape factor)
  const cubicInches = l * w * t * 0.54;
  return Math.round((cubicInches / 61.02) * 10) / 10;
}

export function encodeDesignToUrl(state: DesignState): string {
  const compact = {
    c: state.category,
    s: state.subType,
    v: state.view,
    b: state.baseColor,
    t: state.texture,
    sp: state.specs,
    ss: state.skateSpecs,
    sf: state.surfSpecs,
    l: state.layers.map((l) => ({
      t: l.type,
      v: l.type === "image" ? "" : l.value,
      vw: l.view,
      x: l.x,
      y: l.y,
      sc: l.scale,
      r: l.rotation,
      o: l.opacity,
      bm: l.blendMode,
      f: l.fx,
      z: l.zIndex,
    })),
  };
  return btoa(JSON.stringify(compact)).replace(/=/g, "");
}

export function decodeDesignFromUrl(encoded: string): Partial<DesignState> | null {
  try {
    const padded = encoded + "===".slice(0, (4 - (encoded.length % 4)) % 4);
    const json = atob(padded);
    const data = JSON.parse(json);
    return {
      category: data.c,
      subType: data.s,
      view: data.v,
      baseColor: data.b,
      texture: data.t,
      specs: data.sp,
      skateSpecs: data.ss,
      surfSpecs: data.sf,
      layers: (data.l || []).map((l: Record<string, unknown>, i: number) => ({
        id: `url-${i}`,
        type: l.t as LayerType,
        value: l.v as string,
        view: l.vw as ViewId,
        x: l.x as number,
        y: l.y as number,
        scale: l.sc as number,
        rotation: l.r as number,
        opacity: l.o as number,
        locked: false,
        blendMode: (l.bm as BlendMode) ?? "normal",
        fx: l.f as TextFX | undefined,
        zIndex: l.z as number,
      })),
    };
  } catch {
    return null;
  }
}

export function contrastText(hex: string): string {
  const c = hex.replace("#", "");
  if (c.length < 6) return "#111";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111" : "#fff";
}

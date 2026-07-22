export type ProductCategory = "hardware" | "apparel";
export type ProductSubType = "skate" | "surf" | "tee" | "hoodie";
export type HardwareView = "top" | "bottom";
export type ApparelView = "front" | "back" | "sleeve";
export type ViewId = HardwareView | ApparelView;

export type LayerType = "text" | "image" | "preset";

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
  fx?: TextFX;
  zIndex: number;
};

export type TextFX = {
  curved?: boolean;
  outline?: boolean;
  shadow?: boolean;
  distressed?: boolean;
};

export type TextureOverlay = "none" | "grip-tape" | "maple-grain" | "fiberglass" | "cotton-weave";

export type DesignState = {
  category: ProductCategory;
  subType: ProductSubType;
  view: ViewId;
  baseColor: string;
  layers: DesignLayer[];
  specs: Record<string, string>;
  texture: TextureOverlay;
  showSafeArea: boolean;
};

export const BASE_PRICES: Record<ProductSubType, number> = {
  skate: 60,
  surf: 60,
  tee: 35,
  hoodie: 45,
};

export const PRICE_MODIFIERS = {
  text: 5,
  image: 10,
  specs: 15,
  fx: 5,
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

export type ColorPalette = {
  name: string;
  colors: string[];
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: "Venice 70s",
    colors: ["#e85d04", "#d4c5a0", "#8b1a1a", "#2d5a3d", "#f5f5f5"],
  },
  {
    name: "Cyber Neon",
    colors: ["#ff00ff", "#00ffff", "#1a1a1a", "#0077b6", "#e85d04"],
  },
  {
    name: "Street Monochrome",
    colors: ["#1a1a1a", "#3a3a3a", "#6a6a6a", "#9a9a9a", "#f5f5f5"],
  },
  {
    name: "Earthy Skate",
    colors: ["#2d5a3d", "#d4c5a0", "#8b6914", "#5a3a1a", "#1a1a1a"],
  },
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

export const SKATE_SPECS = [
  {
    key: "track_width",
    label: "Track Width",
    options: ['7.5"', '7.75"', '8.0"', '8.25"', '8.5"'],
  },
  {
    key: "wheel_hardness",
    label: "Wheel Hardness",
    options: ["52mm 99A", "54mm 99A", "54mm 101A", "56mm 97A"],
  },
  {
    key: "deck_width",
    label: "Deck Width",
    options: ['7.5"', '7.75"', '8.0"', '8.25"', '8.5"', '9.0"'],
  },
] as const;

export const SURF_SPECS = [
  {
    key: "tail_type",
    label: "Tail Shape",
    options: ["Squash", "Swallow", "Pin", "Round", "Bat"],
  },
  {
    key: "fin_config",
    label: "Fin Setup",
    options: ["Single", "Thruster (3)", "Quad (4)", "Twin", "5-Fin"],
  },
] as const;

export const PRESETS = [
  { id: "abstract", name: "Abstract" },
  { id: "retro-wave", name: "Retro Wave" },
  { id: "minimalist", name: "Minimalist" },
  { id: "y2k-crosses", name: "Y2K Crosses" },
  { id: "cyberpunk", name: "Cyberpunk Frames" },
] as const;

export const HARDWARE_VIEWS: { id: HardwareView; label: string }[] = [
  { id: "top", label: "Top (Grip)" },
  { id: "bottom", label: "Bottom (Graphic)" },
];

export const APPAREL_VIEWS: { id: ApparelView; label: string }[] = [
  { id: "front", label: "Front Chest" },
  { id: "back", label: "Back Layout" },
  { id: "sleeve", label: "Left Sleeve" },
];

export function defaultDesignState(): DesignState {
  return {
    category: "hardware",
    subType: "skate",
    view: "top",
    baseColor: BASE_COLORS[0].value,
    layers: [],
    specs: {},
    texture: "none",
    showSafeArea: false,
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
    id: `${type === "text" ? "txt" : type === "image" ? "img" : "pre"}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    value,
    view,
    x: 50,
    y: 50,
    scale: 1,
    rotation: 0,
    opacity: 1,
    locked: false,
    fx,
    zIndex,
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
    items.push({ label: "Text FX / Curved", amount: PRICE_MODIFIERS.fx });
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

export function encodeDesignToUrl(state: DesignState): string {
  const compact = {
    c: state.category,
    s: state.subType,
    v: state.view,
    b: state.baseColor,
    t: state.texture,
    sp: state.specs,
    l: state.layers.map((l) => ({
      t: l.type,
      v: l.type === "image" ? "" : l.value,
      vw: l.view,
      x: l.x,
      y: l.y,
      sc: l.scale,
      r: l.rotation,
      o: l.opacity,
      f: l.fx,
      z: l.zIndex,
    })),
  };
  return btoa(JSON.stringify(compact)).replace(/=/g, "");
}

export function decodeDesignFromUrl(encoded: string): Partial<DesignState> | null {
  try {
    const json = atob(encoded + "===".slice(0, (4 - (encoded.length % 4)) % 4));
    const data = JSON.parse(json);
    return {
      category: data.c,
      subType: data.s,
      view: data.v,
      baseColor: data.b,
      texture: data.t,
      specs: data.sp,
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
        fx: l.f as TextFX | undefined,
        zIndex: l.z as number,
      })),
    };
  } catch {
    return null;
  }
}

const CUSTOM_DESIGNS_KEY = "liminal:custom-designs";

export type SavedDesign = {
  id: string;
  slug: string;
  subType: ProductSubType;
  price: number;
  baseColor: string;
  text: string;
  image: string | null;
  preset: string | null;
  specs: Record<string, string>;
  createdAt: string;
};

export function saveCustomDesign(design: SavedDesign): void {
  if (typeof window === "undefined") return;
  const existing: SavedDesign[] = JSON.parse(
    localStorage.getItem(CUSTOM_DESIGNS_KEY) || "[]",
  );
  existing.push(design);
  localStorage.setItem(CUSTOM_DESIGNS_KEY, JSON.stringify(existing));
  window.dispatchEvent(new Event("liminal:custom-designs-change"));
}

export function getCustomDesigns(): SavedDesign[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_DESIGNS_KEY) || "[]");
  } catch {
    return [];
  }
}

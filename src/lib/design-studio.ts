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
};

export type DesignState = {
  category: ProductCategory;
  subType: ProductSubType;
  view: ViewId;
  baseColor: string;
  layers: DesignLayer[];
  specs: Record<string, string>;
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
] as const;

export const SURF_SPECS = [
  {
    key: "fin_config",
    label: "Fin Config",
    options: ["Tri (3)", "Quad (4)", "5-Fin", "Single", "Twin"],
  },
  {
    key: "tail_type",
    label: "Tail Type",
    options: ["Squash", "Round", "Pin", "Swallow", "Bat"],
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
  };
}

export function calculatePrice(state: DesignState): number {
  let price = BASE_PRICES[state.subType];
  const hasText = state.layers.some((l) => l.type === "text" && l.value.trim());
  const hasImage = state.layers.some((l) => l.type === "image" && l.value);
  const hasSpecs = Object.values(state.specs).some((v) => v);
  if (hasText) price += PRICE_MODIFIERS.text;
  if (hasImage) price += PRICE_MODIFIERS.image;
  if (hasSpecs) price += PRICE_MODIFIERS.specs;
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
  return items;
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

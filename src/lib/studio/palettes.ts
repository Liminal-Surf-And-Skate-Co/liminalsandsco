// Soft & Hot Color Palette Engine — dedicated quick-swatch palettes for the studio.
// These 6 sub-palettes (3 SOFT × 4 hexes; 3 HOT × 4 hexes) feed the inline color row
// in the Design Studio so vectors, text, brushes, and decals can be tinted in one click.

export type PaletteSwatch = {
  hex: string;
  label: string;
  blurb?: string;
};
export type PaletteGroup = {
  id: string;
  label: string;
  mood: "soft" | "hot";
  blurb: string;
  swatches: PaletteSwatch[];
};

export const SOFT_PALETTES: PaletteGroup[] = [
  {
    id: "cloud-lavender",
    label: "Cloud & Lavender",
    mood: "soft",
    blurb: "Pastel · calming · breath",
    swatches: [
      { hex: "#E6E6FA", label: "Pastel Lilac" },
      { hex: "#C1E1C1", label: "Soft Sage" },
      { hex: "#FFFDD0", label: "Cream White" },
      { hex: "#AEC6CF", label: "Muted Sky" },
    ],
  },
  {
    id: "sunbleached-linen",
    label: "Sunbleached Linen",
    mood: "soft",
    blurb: "Sun-baked, faded peach",
    swatches: [
      { hex: "#E0A96D", label: "Dusty Terracotta" },
      { hex: "#F5E6D3", label: "Soft Sand" },
      { hex: "#B38B6D", label: "Warm Taupe" },
      { hex: "#FCD5CE", label: "Faded Peach" },
    ],
  },
  {
    id: "nordic-mist",
    label: "Nordic Mist",
    mood: "soft",
    blurb: "Glacial pale + slate",
    swatches: [
      { hex: "#B0E0E6", label: "Powder Blue" },
      { hex: "#D8F3DC", label: "Frost Mint" },
      { hex: "#FAD2E1", label: "Pale Rose" },
      { hex: "#90A4AE", label: "Slate Gray" },
    ],
  },
];

export const HOT_PALETTES: PaletteGroup[] = [
  {
    id: "cyber-sunset",
    label: "Cyber Sunset",
    mood: "hot",
    blurb: "Magenta sun over violet horizon",
    swatches: [
      { hex: "#FF007F", label: "Electric Magenta" },
      { hex: "#FF4500", label: "Lava Orange" },
      { hex: "#FFEA00", label: "Neon Yellow" },
      { hex: "#4A00E0", label: "Deep Violet" },
    ],
  },
  {
    id: "acid-heat",
    label: "Acid Heat",
    mood: "hot",
    blurb: "Toxic lime + fiery red",
    swatches: [
      { hex: "#76FF03", label: "Toxic Lime" },
      { hex: "#D50000", label: "Fiery Red" },
      { hex: "#FF6F61", label: "Vivid Coral" },
      { hex: "#FFAB00", label: "Bright Amber" },
    ],
  },
  {
    id: "70s-surf-heat",
    label: "70s Surf Heat",
    mood: "hot",
    blurb: "Burnt ochre + crimson sunset",
    swatches: [
      { hex: "#E63946", label: "Vintage Flame" },
      { hex: "#F4A261", label: "Burnt Ochre" },
      { hex: "#9B2226", label: "Sunset Crimson" },
      { hex: "#E9C46A", label: "Bright Sunburst" },
    ],
  },
];

export const ALL_PALETTES: PaletteGroup[] = [...SOFT_PALETTES, ...HOT_PALETTES];

export const ALL_PALETTE_SWATCHES: PaletteSwatch[] = ALL_PALETTES.flatMap((g) =>
  g.swatches.map((s) => ({ ...s, blurb: s.blurb ?? `${g.label} · ${g.mood.toUpperCase()}` })),
);

/** Apply a Soft/Hot hex into the existing palette helpers used by the studio. */
export function paintSwatchAsInk(swatch: PaletteSwatch) {
  return swatch.hex;
}

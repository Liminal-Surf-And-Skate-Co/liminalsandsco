// 50 Studio Theme & Mood Presets.
// Each preset is a data token — palette + background + accent — that flows ONLY into
// the Design Studio's canvas wrapper via inline CSS custom properties. The outer site
// theme is intentionally NOT touched.
//
// Shape: { id, label, mood, palette: { bg, ink, accent, secondary, paper } }

export type StudioThemePalette = {
  bg: string; // canvas / artwork background
  ink: string; // primary ink / decal colour
  accent: string; // accent for highlights, glows
  secondary: string; // secondary ink / detail
  paper: string; // optional secondary fill (light tone)
};

export type StudioTheme = {
  id: string;
  label: string;
  mood: string;
  palette: StudioThemePalette;
};

export const STUDIO_THEMES: StudioTheme[] = [
  {
    id: "cyber-y2k",
    label: "Cyber Y2K",
    mood: "Chrome · magenta · millennium glitch",
    palette: {
      bg: "#0b0b18",
      ink: "#ff3fa4",
      accent: "#e8f0ff",
      secondary: "#7d4aff",
      paper: "#1a1430",
    },
  },
  {
    id: "psyche-70s",
    label: "70s Psychedelic Surf",
    mood: "Sun-baked day-glo on a longboard",
    palette: {
      bg: "#f5c84d",
      ink: "#7a1f1f",
      accent: "#d04bff",
      secondary: "#1f6f5c",
      paper: "#fde7b2",
    },
  },
  {
    id: "minimal-street",
    label: "Minimalist Streetwear",
    mood: "One word. One line. Zero noise.",
    palette: {
      bg: "#f5f2eb",
      ink: "#0b0b0f",
      accent: "#ff5b1f",
      secondary: "#9ea1a6",
      paper: "#f5f2eb",
    },
  },
  {
    id: "neon-synthwave",
    label: "Neon Synthwave",
    mood: "VHS horizon gridlines",
    palette: {
      bg: "#1c0b2e",
      ink: "#ff007a",
      accent: "#00f9ff",
      secondary: "#ffae00",
      paper: "#2a0e42",
    },
  },
  {
    id: "acid-graphix",
    label: "Acid Graphix",
    mood: "Risograph neon poster",
    palette: {
      bg: "#f0ff24",
      ink: "#3a0ca3",
      accent: "#06d6a0",
      secondary: "#ef476f",
      paper: "#dfff70",
    },
  },
  {
    id: "ukiyo-wave",
    label: "Japanese Ukiyo-e Wave",
    mood: "Woodblock indigo + coral",
    palette: {
      bg: "#0f2b4a",
      ink: "#e8e3d8",
      accent: "#d44b50",
      secondary: "#5a82b3",
      paper: "#f4ecd4",
    },
  },
  {
    id: "raw-punk-fanzine",
    label: "Raw Punk Fanzine",
    mood: "Xerox scrawl + crushed paper",
    palette: {
      bg: "#f5ecd8",
      ink: "#0b0b0f",
      accent: "#d4161c",
      secondary: "#1c1c1c",
      paper: "#f5ecd8",
    },
  },
  {
    id: "retro-anime-90",
    label: "Retro Anime 90s",
    mood: "Cel-shaded VHS cap",
    palette: {
      bg: "#f8b5c8",
      ink: "#23194b",
      accent: "#ffcf3a",
      secondary: "#5fa6ff",
      paper: "#fff1d6",
    },
  },
  {
    id: "venice-sunset",
    label: "Venice Beach Sunset",
    mood: "Orange smoke over the boardwalk",
    palette: {
      bg: "#fb8d4d",
      ink: "#2a1259",
      accent: "#ffcf66",
      secondary: "#9f4f7d",
      paper: "#ffd6a3",
    },
  },
  {
    id: "monochrome-noir",
    label: "Monochrome Noir",
    mood: "High contrast street portrait",
    palette: {
      bg: "#0d0d10",
      ink: "#f3f3f1",
      accent: "#a0a0a0",
      secondary: "#5a5a60",
      paper: "#18181c",
    },
  },
  {
    id: "concrete-skatepark",
    label: "Concrete Skatepark",
    mood: "Cast iron + dust + sun",
    palette: {
      bg: "#c2c1bd",
      ink: "#1c1c20",
      accent: "#9c5243",
      secondary: "#65666a",
      paper: "#ddddda",
    },
  },
  {
    id: "tropical-palms",
    label: "Tropical Palms",
    mood: "Midday Hawaiian shirting",
    palette: {
      bg: "#cfeacb",
      ink: "#0d3a1d",
      accent: "#ff7e51",
      secondary: "#7d5e36",
      paper: "#f3efe1",
    },
  },
  {
    id: "bauhaus-geo",
    label: "Bauhaus Geometry",
    mood: "Primary color planes, honest geometry",
    palette: {
      bg: "#f1ead0",
      ink: "#0b0b0f",
      accent: "#e63946",
      secondary: "#1c6dd0",
      paper: "#ffeacd",
    },
  },
  {
    id: "y2k-chrome",
    label: "Y2K Chrome Silver",
    mood: "Liquid metal logo energy",
    palette: {
      bg: "#dbe1ea",
      ink: "#1a1d28",
      accent: "#7c8aa6",
      secondary: "#465062",
      paper: "#eef2f7",
    },
  },
  {
    id: "industrial-rust",
    label: "Industrial Rust",
    mood: "Brownfield scaffolding orange",
    palette: {
      bg: "#2b1f17",
      ink: "#e0c8a4",
      accent: "#cc5b1a",
      secondary: "#8c6d52",
      paper: "#3b2a1f",
    },
  },
  {
    id: "pastel-sunset",
    label: "Pastel Sunset",
    mood: "Lip-balm + water colour",
    palette: {
      bg: "#ffd6e1",
      ink: "#3b2a4b",
      accent: "#ffb48a",
      secondary: "#a89ad6",
      paper: "#ffe8e1",
    },
  },
  {
    id: "hyperpop-neon",
    label: "Hyperpop Neon",
    mood: "Confetti squiggle / 3D bubble",
    palette: {
      bg: "#ff48a3",
      ink: "#fff5fb",
      accent: "#1ce0e8",
      secondary: "#ffe93a",
      paper: "#ffaecf",
    },
  },
  {
    id: "vintage-newspaper",
    label: "Vintage Newspaper",
    mood: "Classified ad halftone",
    palette: {
      bg: "#e9e1cf",
      ink: "#10120f",
      accent: "#3a3a30",
      secondary: "#7a7568",
      paper: "#efe8d5",
    },
  },
  {
    id: "cosmic-galaxy",
    label: "Cosmic Galaxy",
    mood: "Deep field swirls",
    palette: {
      bg: "#06061f",
      ink: "#cbb6ff",
      accent: "#ff7af6",
      secondary: "#69c9ff",
      paper: "#0e0e3a",
    },
  },
  {
    id: "swiss-intl",
    label: "Swiss International Style",
    mood: "Helvetica grids in cool grey",
    palette: {
      bg: "#f4f4f0",
      ink: "#0b0b0f",
      accent: "#ff2a2a",
      secondary: "#444444",
      paper: "#fafafa",
    },
  },
  {
    id: "grunge-collage",
    label: "Grunge Collage",
    mood: "Torn paper + duct tape",
    palette: {
      bg: "#a09785",
      ink: "#1a1414",
      accent: "#a43827",
      secondary: "#5b5247",
      paper: "#beb2a0",
    },
  },
  {
    id: "vapor-1988",
    label: "Vapor Vibe 1988",
    mood: "Mall kiosk pastel",
    palette: {
      bg: "#bfb5e6",
      ink: "#2c1f4d",
      accent: "#ff8ed6",
      secondary: "#74e2c1",
      paper: "#dcd4ee",
    },
  },
  {
    id: "emerald-jungle",
    label: "Emerald Jungle",
    mood: "Wet leaves + moss",
    palette: {
      bg: "#0c3a26",
      ink: "#cce8c7",
      accent: "#92c93a",
      secondary: "#1e6b50",
      paper: "#103b29",
    },
  },
  {
    id: "desert-mirage",
    label: "Desert Mirage",
    mood: "Heat shimmer over sand",
    palette: {
      bg: "#e6c189",
      ink: "#4a2415",
      accent: "#b8472c",
      secondary: "#7d5234",
      paper: "#f3dab0",
    },
  },
  {
    id: "cyberpunk-red",
    label: "Cyberpunk Red",
    mood: "City raincoat heat",
    palette: {
      bg: "#250014",
      ink: "#ffe1ea",
      accent: "#ff003c",
      secondary: "#9b003c",
      paper: "#37001f",
    },
  },
  {
    id: "deep-ocean",
    label: "Deep Ocean Trench",
    mood: "Cold pressure + bioluminescence",
    palette: {
      bg: "#03182f",
      ink: "#9bd6ff",
      accent: "#3dffce",
      secondary: "#1971a8",
      paper: "#052342",
    },
  },
  {
    id: "terracotta-clay",
    label: "Terracotta Clay",
    mood: "Earthenware, sun-dried",
    palette: {
      bg: "#c97a5a",
      ink: "#3a160a",
      accent: "#f0d098",
      secondary: "#7a4530",
      paper: "#e3a185",
    },
  },
  {
    id: "golden-hour",
    label: "Golden Hour Glow",
    mood: "Last light on a wave",
    palette: {
      bg: "#fcd27a",
      ink: "#3b1a0c",
      accent: "#ff8b3d",
      secondary: "#a64b1c",
      paper: "#ffdfa3",
    },
  },
  {
    id: "toxic-slime",
    label: "Toxic Slime Green",
    mood: "Biohazard glow",
    palette: {
      bg: "#1a2a09",
      ink: "#d1ff54",
      accent: "#a4ff00",
      secondary: "#5b7a14",
      paper: "#243915",
    },
  },
  {
    id: "arctic-ice",
    label: "Arctic Ice",
    mood: "Cool blue shards",
    palette: {
      bg: "#eaf6ff",
      ink: "#0d2640",
      accent: "#5cc8ff",
      secondary: "#8aa5b8",
      paper: "#f3faff",
    },
  },
  {
    id: "electric-lavender",
    label: "Electric Lavender",
    mood: "Soft but buzzing",
    palette: {
      bg: "#b9a7ff",
      ink: "#28196b",
      accent: "#fff04a",
      secondary: "#7d5fdf",
      paper: "#d2c4ff",
    },
  },
  {
    id: "sunset-boulevard",
    label: "Sunset Boulevard",
    mood: "LA in the rearview",
    palette: {
      bg: "#311a45",
      ink: "#f49b6a",
      accent: "#ffcf66",
      secondary: "#b0413e",
      paper: "#3e2357",
    },
  },
  {
    id: "pop-art-pop",
    label: "Pop Art Pop",
    mood: "Lichtenstein dot grids",
    palette: {
      bg: "#fff04a",
      ink: "#0d0d3a",
      accent: "#ff2266",
      secondary: "#1f6feb",
      paper: "#fff7a1",
    },
  },
  {
    id: "cyber-goth",
    label: "Cyber Goth",
    mood: "Rivet head, gloss lips",
    palette: {
      bg: "#0e0a16",
      ink: "#e8c5ff",
      accent: "#9a1ad0",
      secondary: "#5a2474",
      paper: "#1a1428",
    },
  },
  {
    id: "brutalist-raw",
    label: "Brutalist Raw",
    mood: "Exposed concrete + marker",
    palette: {
      bg: "#dad6cb",
      ink: "#0b0b0f",
      accent: "#ff5959",
      secondary: "#5c5b56",
      paper: "#e6e2d6",
    },
  },
  {
    id: "racing-hicon",
    label: "High-Contrast Racing",
    mood: "Checkered flag, hot motor oil",
    palette: {
      bg: "#0d0d0d",
      ink: "#ffef00",
      accent: "#ff1f1f",
      secondary: "#ffffff",
      paper: "#252525",
    },
  },
  {
    id: "midnight-velvet",
    label: "Midnight Velvet",
    mood: "Smoke + leather chair",
    palette: {
      bg: "#0e0a1a",
      ink: "#d5bda3",
      accent: "#915e3a",
      secondary: "#5a3a2a",
      paper: "#1a1428",
    },
  },
  {
    id: "electric-sunset",
    label: "Electric Sunset",
    mood: "Saturation turned up to 11",
    palette: {
      bg: "#ff5ea8",
      ink: "#fffdd0",
      accent: "#0019ff",
      secondary: "#ffae00",
      paper: "#ff9bc0",
    },
  },
  {
    id: "tuscan-clay",
    label: "Tuscan Clay",
    mood: "Old villa terracotta",
    palette: {
      bg: "#a85236",
      ink: "#3c1c10",
      accent: "#e5c264",
      secondary: "#65412a",
      paper: "#c87a52",
    },
  },
  {
    id: "holographic-foil",
    label: "Holographic Foil",
    mood: "Trading card prism",
    palette: {
      bg: "#e3e7ff",
      ink: "#1a1a3a",
      accent: "#ff5cff",
      secondary: "#5cffff",
      paper: "#f3f4ff",
    },
  },
  {
    id: "solar-flare",
    label: "Solar Flare",
    mood: "Looking into the sun",
    palette: {
      bg: "#ffea00",
      ink: "#2a0a3a",
      accent: "#ff5500",
      secondary: "#7a1f8c",
      paper: "#fff6a6",
    },
  },
  {
    id: "deep-forest",
    label: "Deep Forest",
    mood: "Moss, bark, low light",
    palette: {
      bg: "#0a2018",
      ink: "#cce0c0",
      accent: "#ffae40",
      secondary: "#3c5e3a",
      paper: "#0e2921",
    },
  },
  {
    id: "neon-cyber-grid",
    label: "Neon Cyber-Grid",
    mood: "Tron arcade cabinet",
    palette: {
      bg: "#04041a",
      ink: "#47ffb3",
      accent: "#1c1cff",
      secondary: "#ff3cff",
      paper: "#0a0a26",
    },
  },
  {
    id: "retro-billboard",
    label: "Retro Billboard",
    mood: "Times Square motel sign",
    palette: {
      bg: "#fcb13b",
      ink: "#3c0f0f",
      accent: "#ff5959",
      secondary: "#0f1f3a",
      paper: "#ffd586",
    },
  },
  {
    id: "coastal-salt",
    label: "Coastal Salt",
    mood: "Bleached linen + ocean air",
    palette: {
      bg: "#f3f4ee",
      ink: "#244b5a",
      accent: "#c8a76b",
      secondary: "#9aa9a1",
      paper: "#fafbf5",
    },
  },
  {
    id: "obsidian-dark",
    label: "Obsidian Dark",
    mood: "Glass sharp midnight",
    palette: {
      bg: "#08080c",
      ink: "#cdd1da",
      accent: "#7d8597",
      secondary: "#3a3e4a",
      paper: "#101218",
    },
  },
  {
    id: "sunbleached",
    label: "Sunbleached Linen",
    mood: "Hammock white + tan",
    palette: {
      bg: "#f4ecdb",
      ink: "#82604a",
      accent: "#ddb26a",
      secondary: "#b39a7a",
      paper: "#faf2e0",
    },
  },
  {
    id: "cyber-lime",
    label: "Cyber Lime",
    mood: "Glow-stick lemon-lime",
    palette: {
      bg: "#080a06",
      ink: "#cfff3a",
      accent: "#00ffaa",
      secondary: "#7c8a3a",
      paper: "#101414",
    },
  },
  {
    id: "lava-flow",
    label: "Lava Flow",
    mood: "Cracked basalt + molten flow",
    palette: {
      bg: "#1a0808",
      ink: "#ffaf40",
      accent: "#ff3c1a",
      secondary: "#7a1410",
      paper: "#260c0c",
    },
  },
  {
    id: "nordic-frost",
    label: "Nordic Frost",
    mood: "Glacial pale + spruce",
    palette: {
      bg: "#e9f3f7",
      ink: "#1c3946",
      accent: "#7fb9c8",
      secondary: "#5a6878",
      paper: "#f5fafc",
    },
  },
];

export const STUDIO_THEMES_BY_ID: Record<string, StudioTheme> = Object.fromEntries(
  STUDIO_THEMES.map((t) => [t.id, t]),
);

export function findStudioTheme(id: string | null | undefined): StudioTheme | undefined {
  if (!id) return undefined;
  return STUDIO_THEMES_BY_ID[id];
}

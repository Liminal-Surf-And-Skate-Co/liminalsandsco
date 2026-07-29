// Decal Categories 3–6 — 80 recolorable vector decals for the Canva-grade Design Studio.
//
// Same conventions as src/lib/studio/decals.ts:
//   • Every SVG uses `currentColor`, so any parent `color` CSS rules tint the path.
//   • IDs are kebab-case, tags are lowercase, single-path where possible.
//   • Appending new categories is purely additive — append a new const + push to DECAL_CATEGORIES_BATCH2.

export type Decal = {
  id: string;
  label: string;
  /** Lowercase search keywords used by the inline sticker search. */
  tags: string[];
  /** Inline SVG markup. Uses currentColor — wraps with the parent's `color`. */
  svg: string;
};

export type DecalCategory = {
  id: string;
  label: string;
  blurb?: string;
  decals: Decal[];
};

const d = (id: string, label: string, tags: string[], svg: string): Decal => ({
  id,
  label,
  tags: tags.map((t) => t.toLowerCase()),
  svg,
});

// =========================================================================
// 3. SKATE, URBAN & STREET — 20 decals
// =========================================================================
const SKATE_URBAN: Decal[] = [
  d(
    "skate-deck",
    "Skate Deck",
    ["skate", "board", "deck", "popsicle"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'><rect x='6' y='6' width='108' height='28' rx='14' fill='currentColor'/><circle cx='28' cy='14' r='2' fill='#fff' opacity='.4'/><circle cx='60' cy='14' r='2' fill='#fff' opacity='.4'/><circle cx='92' cy='14' r='2' fill='#fff' opacity='.4'/><circle cx='28' cy='26' r='2' fill='#fff' opacity='.4'/><circle cx='60' cy='26' r='2' fill='#fff' opacity='.4'/><circle cx='92' cy='26' r='2' fill='#fff' opacity='.4'/></svg>`,
  ),
  d(
    "wheel-icon",
    "Skate Wheel",
    ["wheel", "skate", "round", "urethane"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='currentColor'/><circle cx='50' cy='50' r='30' fill='#fff' opacity='.15'/><circle cx='50' cy='50' r='6' fill='#fff' opacity='.4'/><g stroke='#fff' stroke-width='1' opacity='.3' fill='none'><line x1='50' y1='14' x2='50' y2='22'/><line x1='50' y1='78' x2='50' y2='86'/><line x1='14' y1='50' x2='22' y2='50'/><line x1='78' y1='50' x2='86' y2='50'/></g></svg>`,
  ),
  d(
    "skate-trucks",
    "Skateboard Trucks",
    ["trucks", "metal", "axle", "hangar"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'><rect x='4' y='14' width='112' height='12' rx='3' fill='currentColor'/><circle cx='20' cy='30' r='6' fill='currentColor'/><circle cx='100' cy='30' r='6' fill='currentColor'/></svg>`,
  ),
  d(
    "flame-graphic",
    "Flame Graphic",
    ["flame", "fire", "hot", "rod"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 100'><path d='M40 4 C 50 22 70 26 66 50 C 78 60 60 84 50 80 C 54 70 44 70 44 80 C 50 90 38 96 28 88 C 18 96 6 80 14 64 C 8 50 30 36 40 4 Z' fill='currentColor'/><path d='M40 36 C 46 46 56 46 52 58 C 50 64 46 64 42 58 C 42 70 36 72 32 66 C 30 58 36 50 40 36 Z' fill='#fff' opacity='.3'/></svg>`,
  ),
  d(
    "barbed-wire",
    "Barbed Wire Loop",
    ["wire", "fence", "spike", "punk"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'><path d='M0 22 Q 30 6 60 22 Q 90 38 120 22' stroke='currentColor' stroke-width='2' fill='none'/><g fill='currentColor'><polygon points='20,18 24,12 28,18 32,12 36,18'/><polygon points='50,28 54,34 58,28 62,34 66,28'/><polygon points='80,18 84,12 88,18 92,12 96,18'/></g></svg>`,
  ),
  d(
    "spray-cap",
    "Spray Paint Cap",
    ["spray", "paint", "can", "graffiti"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 100'><rect x='24' y='30' width='32' height='50' rx='4' fill='currentColor'/><rect x='20' y='80' width='40' height='12' rx='3' fill='currentColor'/><circle cx='40' cy='22' r='8' fill='currentColor'/><line x1='28' y1='30' x2='52' y2='30' stroke='#fff' stroke-width='1.5' opacity='.4'/></svg>`,
  ),
  d(
    "brick-texture",
    "Brick Texture Stamp",
    ["brick", "wall", "pattern", "mortar"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'><g fill='currentColor'><rect x='2' y='2' width='22' height='12'/><rect x='26' y='2' width='22' height='12'/><rect x='50' y='2' width='22' height='12'/><rect x='74' y='2' width='22' height='12'/><rect x='14' y='16' width='22' height='12'/><rect x='38' y='16' width='22' height='12'/><rect x='62' y='16' width='22' height='12'/><rect x='2' y='30' width='22' height='12'/><rect x='26' y='30' width='22' height='12'/><rect x='50' y='30' width='22' height='12'/><rect x='74' y='30' width='22' height='12'/><rect x='14' y='44' width='22' height='12'/><rect x='38' y='44' width='22' height='12'/><rect x='62' y='44' width='22' height='12'/></g></svg>`,
  ),
  d(
    "hazard-stripes",
    "Hazard Stripes",
    ["hazard", "stripe", "warning", "caution"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'><defs><pattern id='hz' width='20' height='60' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><rect width='10' height='60' fill='currentColor'/></pattern></defs><rect x='2' y='2' width='96' height='56' fill='url(#hz)'/></svg>`,
  ),
  d(
    "chain-link",
    "Chain Link",
    ["chain", "link", "metal", "loop"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'><g fill='none' stroke='currentColor' stroke-width='6'><ellipse cx='28' cy='20' rx='16' ry='10'/><ellipse cx='92' cy='20' rx='16' ry='10'/></g><ellipse cx='60' cy='20' rx='16' ry='10' fill='none' stroke='currentColor' stroke-width='6'/></svg>`,
  ),
  d(
    "graffiti-arrow",
    "Graffiti Arrow",
    ["graffiti", "arrow", "tag", "point"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'><path d='M2 30 L 74 30 L 74 16 L 110 38 L 74 60 L 74 46 L 2 46 Z' fill='currentColor'/></svg>`,
  ),
  d(
    "broken-glass",
    "Broken Glass Shards",
    ["broken", "glass", "shards", "crack"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='currentColor'><polygon points='20,80 30,28 52,72'/><polygon points='40,90 60,38 72,80'/><polygon points='62,90 78,48 88,86'/><polygon points='10,40 24,16 40,38'/></g></svg>`,
  ),
  d(
    "melting-drip",
    "Melting Drips",
    ["drip", "melt", "paint", "ooze"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M0 0 L 100 0 L 100 18 Q 96 50 90 18 Q 84 62 78 18 Q 72 72 66 18 Q 60 50 54 18 Q 48 60 42 18 Q 36 70 30 18 Q 24 50 18 18 Q 12 60 6 18 L 0 30 Z' fill='currentColor'/></svg>`,
  ),
  d(
    "caution-badge",
    "Caution Badge",
    ["caution", "badge", "warning", "alert"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,8 92,30 92,70 50,92 8,70 8,30' fill='currentColor'/><text x='50' y='66' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='48' fill='#fff'>!</text></svg>`,
  ),
  d(
    "skull-crossbones",
    "Skull & Crossbones",
    ["skull", "bones", "death", "pirate"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 12 C 28 12 16 28 16 48 C 16 60 24 70 32 74 L 34 86 L 44 86 L 44 78 L 56 78 L 56 86 L 66 86 L 68 74 C 76 70 84 60 84 48 C 84 28 72 12 50 12 Z' fill='currentColor'/><circle cx='40' cy='46' r='6' fill='#fff'/><circle cx='60' cy='46' r='6' fill='#fff'/><rect x='12' y='62' width='58' height='10' rx='5' fill='currentColor' transform='rotate(-30 41 67)'/><rect x='12' y='62' width='58' height='10' rx='5' fill='currentColor' transform='rotate(30 41 67)'/></svg>`,
  ),
  d(
    "urban-rat",
    "Urban Rat Icon",
    ["rat", "rodent", "urban", "street"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><path d='M14 50 Q 24 30 50 30 Q 76 30 88 50 L 110 60 Q 116 60 116 56 L 116 50 Q 110 48 102 52 L 92 38 L 86 38 L 90 50 Z' fill='currentColor'/><circle cx='88' cy='40' r='3' fill='#fff'/><circle cx='96' cy='40' r='3' fill='#fff'/><circle cx='92' cy='46' r='2' fill='#fff'/><line x1='102' y1='52' x2='116' y2='50' stroke='currentColor' stroke-width='2'/></svg>`,
  ),
  d(
    "concrete-cracks",
    "Concrete Cracks",
    ["crack", "concrete", "broken", "fracture"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M2 60 L 30 50 L 40 60 L 50 40 L 70 50 L 80 30 L 98 40' stroke='currentColor' stroke-width='3' fill='none'/><path d='M40 60 L 36 80 L 50 90' stroke='currentColor' stroke-width='2' fill='none'/><path d='M70 50 L 80 70 L 70 84' stroke='currentColor' stroke-width='2' fill='none'/></svg>`,
  ),
  d(
    "boombox",
    "Boombox",
    ["music", "radio", "speaker", "bass"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'><rect x='6' y='10' width='108' height='40' rx='4' fill='currentColor'/><circle cx='26' cy='30' r='10' fill='#fff' opacity='.5'/><circle cx='94' cy='30' r='10' fill='#fff' opacity='.5'/><rect x='44' y='20' width='32' height='12' rx='2' fill='#fff' opacity='.3'/><rect x='44' y='34' width='32' height='4' fill='#fff' opacity='.3'/></svg>`,
  ),
  d(
    "high-tops",
    "High-Top Sneaker",
    ["shoe", "sneaker", "high-tops", "kicks"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'><path d='M10 50 L 10 30 L 30 14 L 70 14 L 70 24 L 100 24 L 110 36 L 110 50 Z' fill='currentColor'/><line x1='30' y1='20' x2='30' y2='44' stroke='#fff' stroke-width='1.5' opacity='.5'/><line x1='50' y1='18' x2='50' y2='44' stroke='#fff' stroke-width='1.5' opacity='.5'/><rect x='6' y='50' width='108' height='6' fill='currentColor'/></svg>`,
  ),
  d(
    "safety-pin",
    "Safety Pin",
    ["pin", "metal", "safety", "fastener"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M28 14 L 28 76 L 72 76 Q 82 76 82 66 L 82 30 Q 82 20 72 20 L 50 20 L 50 32 L 70 32 Q 74 32 74 36 L 74 56 L 36 56 L 36 70' stroke='currentColor' stroke-width='4' fill='none' stroke-linecap='round'/><circle cx='36' cy='72' r='4' fill='currentColor'/></svg>`,
  ),
  d(
    "anarchy-a",
    "Anarchy A",
    ["anarchy", "punk", "symbol", "circle-a"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='44' fill='none' stroke='currentColor' stroke-width='3'/><path d='M50 20 L 78 80 L 70 80 L 62 64 L 38 64 L 30 80 L 22 80 Z M 42 56 L 58 56 L 50 36 Z' fill='currentColor'/></svg>`,
  ),
];

// =========================================================================
// 4. Y2K, RETRO & CYBER — 20 decals
// =========================================================================
const Y2K_CYBER: Decal[] = [
  d(
    "chrome-drip",
    "Chrome Liquid Drip",
    ["chrome", "drip", "metallic", "liquid"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M40 8 Q 30 56 50 80 Q 70 56 60 8 Z' fill='currentColor'/><path d='M30 8 Q 24 52 44 76' fill='none' stroke='#fff' stroke-width='2' opacity='.6'/><path d='M70 8 Q 76 52 56 76' fill='none' stroke='#000' stroke-width='1' opacity='.3'/></svg>`,
  ),
  d(
    "cyber-heart",
    "Cyber Heart",
    ["heart", "cyber", "love", "wire"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 88 C 18 64 14 38 32 26 C 42 22 48 28 50 36 C 52 28 58 22 68 26 C 86 38 82 64 50 88 Z' fill='none' stroke='currentColor' stroke-width='3'/><line x1='50' y1='40' x2='50' y2='80' stroke='currentColor' stroke-width='2'/><line x1='30' y1='50' x2='70' y2='50' stroke='currentColor' stroke-width='2'/></svg>`,
  ),
  d(
    "tribal-tattoo",
    "Tribal Tattoo",
    ["tribal", "tattoo", "ink", "indigenous"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 8 L 60 26 L 76 22 L 70 40 L 86 50 L 70 60 L 76 78 L 60 74 L 50 92 L 40 74 L 24 78 L 30 60 L 14 50 L 30 40 L 24 22 L 40 26 Z' fill='currentColor'/><circle cx='50' cy='50' r='6' fill='#fff' opacity='.3'/></svg>`,
  ),
  d(
    "wireframe-globe",
    "Y2K Wireframe Globe",
    ["globe", "wireframe", "world", "earth"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='38' fill='none' stroke='currentColor' stroke-width='2'/><ellipse cx='50' cy='50' rx='38' ry='14' fill='none' stroke='currentColor' stroke-width='1.5'/><ellipse cx='50' cy='50' rx='38' ry='28' fill='none' stroke='currentColor' stroke-width='1' opacity='.6'/><ellipse cx='50' cy='50' rx='14' ry='38' fill='none' stroke='currentColor' stroke-width='1.5'/><ellipse cx='50' cy='50' rx='26' ry='38' fill='none' stroke='currentColor' stroke-width='1' opacity='.6'/></svg>`,
  ),
  d(
    "pixel-star",
    "Pixel Art Star",
    ["pixel", "8-bit", "star", "digital"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='currentColor'><rect x='46' y='14' width='8' height='8'/><rect x='44' y='22' width='12' height='12'/><rect x='40' y='34' width='20' height='8'/><rect x='36' y='42' width='28' height='6'/><rect x='34' y='48' width='32' height='8'/><rect x='36' y='56' width='28' height='6'/><rect x='40' y='62' width='20' height='8'/><rect x='44' y='70' width='12' height='12'/><rect x='46' y='82' width='8' height='6'/><rect x='14' y='40' width='18' height='6'/><rect x='68' y='40' width='18' height='6'/><rect x='22' y='50' width='10' height='6'/><rect x='68' y='50' width='10' height='6'/></g></svg>`,
  ),
  d(
    "vinyl-record",
    "Vinyl Record",
    ["vinyl", "music", "record", "lp"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='currentColor'/><circle cx='50' cy='50' r='14' fill='#fff' opacity='.3'/><circle cx='50' cy='50' r='5' fill='currentColor'/><g stroke='#fff' stroke-width='.5' fill='none' opacity='.4'><circle cx='50' cy='50' r='18'/><circle cx='50' cy='50' r='22'/><circle cx='50' cy='50' r='26'/><circle cx='50' cy='50' r='30'/><circle cx='50' cy='50' r='34'/></g></svg>`,
  ),
  d(
    "cassette",
    "Retro Cassette",
    ["cassette", "tape", "music", "80s"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 70'><rect x='4' y='10' width='112' height='50' rx='4' fill='currentColor'/><rect x='14' y='20' width='40' height='28' rx='3' fill='#fff' opacity='.3'/><circle cx='24' cy='34' r='6' fill='currentColor'/><circle cx='44' cy='34' r='6' fill='currentColor'/><rect x='66' y='20' width='40' height='28' rx='3' fill='#fff' opacity='.3'/><rect x='74' y='24' width='24' height='4' fill='currentColor'/><rect x='74' y='40' width='24' height='4' fill='currentColor'/></svg>`,
  ),
  d(
    "grid-node",
    "Cyber Grid Node",
    ["grid", "node", "cyber", "network"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='8' fill='currentColor'/><g stroke='currentColor' stroke-width='2' fill='none'><line x1='50' y1='50' x2='14' y2='14'/><line x1='50' y1='50' x2='86' y2='14'/><line x1='50' y1='50' x2='14' y2='86'/><line x1='50' y1='50' x2='86' y2='86'/><line x1='50' y1='50' x2='50' y2='6'/><line x1='50' y1='50' x2='6' y2='50'/><line x1='50' y1='50' x2='94' y2='50'/><line x1='50' y1='50' x2='50' y2='94'/></g><g fill='currentColor'><circle cx='14' cy='14' r='4'/><circle cx='86' cy='14' r='4'/><circle cx='14' cy='86' r='4'/><circle cx='86' cy='86' r='4'/><circle cx='50' cy='6' r='3'/><circle cx='6' cy='50' r='3'/><circle cx='94' cy='50' r='3'/><circle cx='50' cy='94' r='3'/></g></svg>`,
  ),
  d(
    "barcode-digit",
    "Digital Barcode",
    ["barcode", "digit", "scan", "retail"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 50'><g fill='currentColor'><rect x='4' y='4' width='3' height='42'/><rect x='10' y='4' width='2' height='42'/><rect x='15' y='4' width='5' height='42'/><rect x='24' y='4' width='2' height='42'/><rect x='30' y='4' width='3' height='42'/><rect x='36' y='4' width='6' height='42'/><rect x='46' y='4' width='2' height='42'/><rect x='51' y='4' width='3' height='42'/><rect x='58' y='4' width='4' height='42'/><rect x='66' y='4' width='2' height='42'/><rect x='71' y='4' width='5' height='42'/><rect x='80' y='4' width='2' height='42'/><rect x='85' y='4' width='3' height='42'/><rect x='91' y='4' width='4' height='42'/><rect x='99' y='4' width='2' height='42'/><rect x='104' y='4' width='6' height='42'/><rect x='114' y='4' width='3' height='42'/></g></svg>`,
  ),
  d(
    "glitch-block",
    "Glitch Blocks",
    ["glitch", "block", "corrupt", "vhs"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='currentColor'><rect x='10' y='14' width='28' height='8'/><rect x='42' y='14' width='38' height='8' opacity='.5'/><rect x='10' y='26' width='70' height='6'/><rect x='14' y='38' width='40' height='8'/><rect x='58' y='38' width='18' height='8' opacity='.5'/><rect x='10' y='50' width='80' height='10'/><rect x='10' y='64' width='34' height='6' opacity='.5'/><rect x='48' y='64' width='42' height='6'/><rect x='10' y='74' width='50' height='6'/><rect x='64' y='74' width='26' height='6' opacity='.5'/></g></svg>`,
  ),
  d(
    "y2k-butterfly",
    "Y2K Butterfly",
    ["y2k", "butterfly", "retro", "2000"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 50 Q 18 30 14 12 Q 36 18 50 50 Z' fill='currentColor'/><path d='M50 50 Q 82 30 86 12 Q 64 18 50 50 Z' fill='currentColor'/><path d='M50 50 Q 18 70 14 88 Q 36 82 50 50 Z' fill='currentColor' opacity='.8'/><path d='M50 50 Q 82 70 86 88 Q 64 82 50 50 Z' fill='currentColor' opacity='.8'/><ellipse cx='50' cy='50' rx='3' ry='18' fill='currentColor'/><circle cx='40' cy='30' r='2' fill='#fff' opacity='.5'/><circle cx='60' cy='30' r='2' fill='#fff' opacity='.5'/></svg>`,
  ),
  d(
    "matrix-code",
    "Matrix Code Cascade",
    ["matrix", "code", "cascade", "binary"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='currentColor'><text x='10' y='20' font-family='monospace' font-size='14'>1</text><text x='10' y='40' font-family='monospace' font-size='14'>0</text><text x='10' y='60' font-family='monospace' font-size='14'>1</text><text x='10' y='80' font-family='monospace' font-size='14'>1</text><text x='30' y='18' font-family='monospace' font-size='14'>0</text><text x='30' y='38' font-family='monospace' font-size='14'>1</text><text x='30' y='58' font-family='monospace' font-size='14'>1</text><text x='30' y='78' font-family='monospace' font-size='14'>0</text><text x='50' y='20' font-family='monospace' font-size='14'>1</text><text x='50' y='40' font-family='monospace' font-size='14'>1</text><text x='50' y='60' font-family='monospace' font-size='14'>0</text><text x='50' y='80' font-family='monospace' font-size='14'>1</text><text x='70' y='18' font-family='monospace' font-size='14'>1</text><text x='70' y='38' font-family='monospace' font-size='14'>0</text><text x='70' y='58' font-family='monospace' font-size='14'>1</text><text x='70' y='78' font-family='monospace' font-size='14'>1</text><text x='90' y='20' font-family='monospace' font-size='14'>0</text><text x='90' y='40' font-family='monospace' font-size='14'>1</text><text x='90' y='60' font-family='monospace' font-size='14'>1</text><text x='90' y='80' font-family='monospace' font-size='14'>0</text></g></svg>`,
  ),
  d(
    "neon-crosshair",
    "Neon Crosshairs",
    ["neon", "crosshair", "target", "scope"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='32' fill='none' stroke='currentColor' stroke-width='3'/><circle cx='50' cy='50' r='20' fill='none' stroke='currentColor' stroke-width='2'/><line x1='50' y1='10' x2='50' y2='22' stroke='currentColor' stroke-width='3'/><line x1='50' y1='78' x2='50' y2='90' stroke='currentColor' stroke-width='3'/><line x1='10' y1='50' x2='22' y2='50' stroke='currentColor' stroke-width='3'/><line x1='78' y1='50' x2='90' y2='50' stroke='currentColor' stroke-width='3'/><circle cx='50' cy='50' r='4' fill='currentColor'/></svg>`,
  ),
  d(
    "retro-tv",
    "Retro TV Frame",
    ["retro", "tv", "television", "vintage"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 90'><rect x='6' y='10' width='108' height='72' rx='10' fill='currentColor'/><rect x='18' y='20' width='80' height='48' rx='4' fill='#fff' opacity='.2'/><rect x='12' y='82' width='96' height='6' fill='currentColor'/><circle cx='106' cy='74' r='3' fill='#fff' opacity='.5'/><circle cx='98' cy='74' r='3' fill='#fff' opacity='.5'/><line x1='30' y1='20' x2='30' y2='68' stroke='#fff' stroke-width='2' opacity='.4'/><line x1='40' y1='28' x2='40' y2='64' stroke='#fff' stroke-width='2' opacity='.4'/><line x1='52' y1='36' x2='52' y2='60' stroke='#fff' stroke-width='2' opacity='.4'/></svg>`,
  ),
  d(
    "floppy-disk",
    "Floppy Disk",
    ["floppy", "disk", "save", "retro"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='8' y='8' width='84' height='84' rx='4' fill='currentColor'/><rect x='60' y='8' width='28' height='40' fill='#fff' opacity='.3'/><rect x='8' y='64' width='84' height='28' fill='#fff' opacity='.15'/><rect x='68' y='14' width='12' height='4' fill='currentColor'/><rect x='68' y='22' width='12' height='4' fill='currentColor'/></svg>`,
  ),
  d(
    "chrome-star",
    "Chrome Star",
    ["chrome", "star", "shine", "metallic"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,4 62,38 96,38 68,58 80,92 50,72 20,92 32,58 4,38 38,38' fill='currentColor'/><polygon points='50,4 62,38 96,38 68,58 50,52' fill='#fff' opacity='.4'/></svg>`,
  ),
  d(
    "cyber-badge",
    "Cyber Badge",
    ["cyber", "badge", "shield", "rank"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,4 90,18 90,58 50,96 10,58 10,18' fill='none' stroke='currentColor' stroke-width='3'/><polygon points='50,18 76,28 76,52 50,80 24,52 24,28' fill='currentColor'/><circle cx='50' cy='46' r='8' fill='#fff'/><line x1='42' y1='50' x2='58' y2='50' stroke='currentColor' stroke-width='2'/><line x1='50' y1='42' x2='50' y2='58' stroke='currentColor' stroke-width='2'/></svg>`,
  ),
  d(
    "mp3-player",
    "MP3 Player UI",
    ["mp3", "player", "music", "ui"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 100'><rect x='6' y='6' width='48' height='88' rx='4' fill='currentColor'/><rect x='12' y='14' width='36' height='40' rx='2' fill='#fff' opacity='.3'/><circle cx='30' cy='70' r='10' fill='#fff' opacity='.3'/><circle cx='30' cy='70' r='4' fill='currentColor'/><circle cx='14' cy='70' r='3' fill='#fff' opacity='.4'/><circle cx='46' cy='70' r='3' fill='#fff' opacity='.4'/></svg>`,
  ),
  d(
    "sparkle-ring",
    "Sparkle Ring",
    ["sparkle", "ring", "twinkle", "circle"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='34' fill='none' stroke='currentColor' stroke-width='2'/><g fill='currentColor'><polygon points='50,8 52,18 62,20 52,22 50,32 48,22 38,20 48,18'/><polygon points='50,68 52,78 62,80 52,82 50,92 48,82 38,80 48,78'/><polygon points='8,50 18,52 20,62 22,52 32,50 22,48 20,38 18,48'/><polygon points='68,50 78,52 80,62 82,52 92,50 82,48 80,38 78,48'/></g></svg>`,
  ),
  d(
    "holographic-flare",
    "Holographic Flare",
    ["holo", "flare", "rainbow", "lens"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='none' stroke='currentColor' stroke-width='2'/><ellipse cx='50' cy='50' rx='40' ry='12' fill='none' stroke='currentColor' stroke-width='1.5' transform='rotate(30 50 50)'/><ellipse cx='50' cy='50' rx='40' ry='8' fill='none' stroke='currentColor' stroke-width='1.5' transform='rotate(-30 50 50)'/><ellipse cx='50' cy='50' rx='40' ry='6' fill='none' stroke='currentColor' stroke-width='1' transform='rotate(60 50 50)'/><circle cx='50' cy='50' r='6' fill='currentColor'/></svg>`,
  ),
];

// =========================================================================
// 5. FRAMES, BORDERS & BADGES — 20 decals
// =========================================================================
const FRAMES_BADGES: Decal[] = [
  d(
    "torn-paper",
    "Torn Paper Edge",
    ["torn", "paper", "edge", "ripped"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M2 30 Q 8 22 14 30 Q 22 22 30 30 Q 38 20 46 30 Q 54 22 62 30 Q 70 18 78 30 Q 86 20 94 30 Q 98 34 98 40 L 98 90 L 2 90 Z' fill='currentColor'/></svg>`,
  ),
  d(
    "geometric-badge",
    "Geometric Badge",
    ["badge", "geometric", "shape", "polygon"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,6 80,18 92,46 92,72 70,92 30,92 8,72 8,46 20,18' fill='none' stroke='currentColor' stroke-width='3'/><polygon points='50,20 70,28 78,48 78,68 62,80 38,80 22,68 22,48 30,28' fill='currentColor'/></svg>`,
  ),
  d(
    "circular-stamp",
    "Circular Stamp",
    ["stamp", "circle", "round", "ink"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='44' fill='none' stroke='currentColor' stroke-width='3'/><circle cx='50' cy='50' r='38' fill='none' stroke='currentColor' stroke-width='1'/><circle cx='50' cy='50' r='30' fill='none' stroke='currentColor' stroke-width='2'/><text x='50' y='58' text-anchor='middle' font-family='Georgia, serif' font-size='28' font-weight='bold' fill='currentColor'>★</text></svg>`,
  ),
  d(
    "stamp-outline",
    "Stamp Outline",
    ["stamp", "outline", "shape", "wax"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 12 L 60 18 L 72 16 L 76 28 L 86 32 L 84 44 L 92 52 L 84 60 L 86 72 L 76 76 L 72 88 L 60 86 L 50 92 L 40 86 L 28 88 L 24 76 L 14 72 L 16 60 L 8 52 L 16 44 L 14 32 L 24 28 L 28 16 L 40 18 Z' fill='none' stroke='currentColor' stroke-width='3'/></svg>`,
  ),
  d(
    "wavy-divider",
    "Wavy Divider",
    ["wave", "divider", "line", "rule"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'><path d='M2 30 Q 8 16 16 30 Q 24 44 32 30 Q 40 16 48 30 Q 56 44 64 30 Q 72 16 80 30 Q 88 44 98 30' stroke='currentColor' stroke-width='3' fill='none' stroke-linecap='round'/></svg>`,
  ),
  d(
    "dashed-cut",
    "Dashed Cut Line",
    ["dashed", "cut", "line", "trim"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'><line x1='4' y1='30' x2='96' y2='30' stroke='currentColor' stroke-width='3' stroke-dasharray='6 6'/></svg>`,
  ),
  d(
    "arch-frame",
    "Arch Frame",
    ["arch", "frame", "window", "door"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M16 90 L 16 50 Q 16 16 50 16 Q 84 16 84 50 L 84 90 Z' fill='none' stroke='currentColor' stroke-width='3'/><line x1='8' y1='90' x2='92' y2='90' stroke='currentColor' stroke-width='3'/></svg>`,
  ),
  d(
    "photo-corner",
    "Vintage Photo Corner",
    ["photo", "corner", "vintage", "album"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M2 2 L 30 2 L 30 8 L 8 8 L 8 30 L 2 30 Z M 98 2 L 70 2 L 70 8 L 92 8 L 92 30 L 98 30 Z M 2 98 L 30 98 L 30 92 L 8 92 L 8 70 L 2 70 Z M 98 98 L 70 98 L 70 92 L 92 92 L 92 70 L 98 70 Z' fill='currentColor'/></svg>`,
  ),
  d(
    "double-line-box",
    "Double Line Box",
    ["box", "frame", "double", "border"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='4' y='4' width='92' height='92' fill='none' stroke='currentColor' stroke-width='3'/><rect x='10' y='10' width='80' height='80' fill='none' stroke='currentColor' stroke-width='1.5'/></svg>`,
  ),
  d(
    "film-strip",
    "Film Strip",
    ["film", "strip", "cinema", "movie"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><rect x='4' y='4' width='112' height='72' fill='currentColor'/><g fill='#fff'><rect x='10' y='10' width='10' height='10'/><rect x='28' y='10' width='10' height='10'/><rect x='46' y='10' width='10' height='10'/><rect x='64' y='10' width='10' height='10'/><rect x='82' y='10' width='10' height='10'/><rect x='100' y='10' width='10' height='10'/><rect x='10' y='60' width='10' height='10'/><rect x='28' y='60' width='10' height='10'/><rect x='46' y='60' width='10' height='10'/><rect x='64' y='60' width='10' height='10'/><rect x='82' y='60' width='10' height='10'/><rect x='100' y='60' width='10' height='10'/></g><rect x='4' y='28' width='112' height='24' fill='#fff' opacity='.3'/></svg>`,
  ),
  d(
    "shield-crest",
    "Shield Crest",
    ["shield", "crest", "coat-of-arms", "heraldry"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 8 L 88 22 L 88 56 Q 88 80 50 94 Q 12 80 12 56 L 12 22 Z' fill='currentColor'/><line x1='50' y1='20' x2='50' y2='80' stroke='#fff' stroke-width='2' opacity='.4'/><polygon points='50,32 58,52 80,52 62,64 70,84 50,72 30,84 38,64 20,52 42,52' fill='#fff' opacity='.5'/></svg>`,
  ),
  d(
    "hexagon-outline",
    "Hexagon Outline",
    ["hexagon", "outline", "six", "geometric"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,8 88,28 88,72 50,92 12,72 12,28' fill='none' stroke='currentColor' stroke-width='3'/><polygon points='50,20 78,36 78,64 50,80 22,64 22,36' fill='currentColor' opacity='.3'/></svg>`,
  ),
  d(
    "ticket-stub",
    "Ticket Stub",
    ["ticket", "stub", "admit", "event"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 50'><path d='M4 6 L 116 6 Q 116 16 116 18 Q 110 18 110 24 Q 110 26 116 26 Q 116 32 116 44 L 4 44 Q 4 32 4 26 Q 10 26 10 24 Q 10 18 4 18 Q 4 16 4 6 Z' fill='currentColor'/><line x1='40' y1='6' x2='40' y2='44' stroke='#fff' stroke-width='1.5' stroke-dasharray='4 4' opacity='.5'/></svg>`,
  ),
  d(
    "wax-seal",
    "Wax Seal Shape",
    ["wax", "seal", "stamp", "emboss"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='currentColor'/><circle cx='50' cy='50' r='36' fill='none' stroke='#fff' stroke-width='1' opacity='.4'/><circle cx='50' cy='50' r='30' fill='none' stroke='#fff' stroke-width='1' opacity='.3'/><path d='M50 30 L 56 46 L 74 46 L 60 56 L 66 72 L 50 62 L 34 72 L 40 56 L 26 46 L 44 46 Z' fill='#fff' opacity='.6'/></svg>`,
  ),
  d(
    "diamond-grid",
    "Diamond Grid Frame",
    ["diamond", "grid", "frame", "pattern"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='10' y='10' width='80' height='80' fill='none' stroke='currentColor' stroke-width='3'/><g fill='none' stroke='currentColor' stroke-width='1'><line x1='10' y1='30' x2='30' y2='10'/><line x1='30' y1='10' x2='50' y2='30'/><line x1='50' y1='30' x2='70' y2='10'/><line x1='70' y1='10' x2='90' y2='30'/><line x1='90' y1='30' x2='90' y2='50'/><line x1='90' y1='50' x2='70' y2='70'/><line x1='70' y1='70' x2='50' y2='50'/><line x1='50' y1='50' x2='30' y2='70'/><line x1='30' y1='70' x2='10' y2='50'/><line x1='10' y1='50' x2='10' y2='30'/></g></svg>`,
  ),
  d(
    "oval-locket",
    "Oval Locket",
    ["oval", "locket", "frame", "photo"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><ellipse cx='50' cy='50' rx='40' ry='46' fill='none' stroke='currentColor' stroke-width='3'/><ellipse cx='50' cy='50' rx='32' ry='38' fill='currentColor' opacity='.4'/><circle cx='50' cy='14' r='6' fill='currentColor'/></svg>`,
  ),
  d(
    "ribbon-banner",
    "Ribbon Banner",
    ["ribbon", "banner", "flag", "scroll"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M14 30 L 86 30 L 86 60 L 14 60 Z' fill='currentColor'/><path d='M14 30 L 4 50 L 14 60 Z' fill='currentColor'/><path d='M86 30 L 96 50 L 86 60 Z' fill='currentColor'/><path d='M30 60 L 24 80 L 36 70 Z' fill='currentColor'/><path d='M70 60 L 76 80 L 64 70 Z' fill='currentColor'/></svg>`,
  ),
  d(
    "label-tag",
    "Label Tag",
    ["label", "tag", "price", "hang"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 8 L 92 50 L 50 92 L 8 50 Z' fill='none' stroke='currentColor' stroke-width='3'/><circle cx='30' cy='30' r='6' fill='currentColor'/></svg>`,
  ),
  d(
    "bracket-border",
    "Bracket Border",
    ["bracket", "border", "frame", "corner"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M4 4 L 30 4 L 30 12 L 12 12 L 12 30 L 4 30 Z M 96 4 L 70 4 L 70 12 L 88 12 L 88 30 L 96 30 Z M 4 96 L 30 96 L 30 88 L 12 88 L 12 70 L 4 70 Z M 96 96 L 70 96 L 70 88 L 88 88 L 88 70 L 96 70 Z' fill='currentColor'/></svg>`,
  ),
  d(
    "polaroid-frame",
    "Polaroid Frame",
    ["polaroid", "photo", "frame", "instant"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 110'><rect x='6' y='6' width='88' height='98' fill='currentColor'/><rect x='14' y='14' width='72' height='68' fill='#fff' opacity='.4'/><rect x='20' y='88' width='60' height='8' fill='#fff' opacity='.3'/></svg>`,
  ),
];

// =========================================================================
// 6. TYPOGRAPHY ACCENTS & NUMBERS — 20 decals
// =========================================================================
const TYPOGRAPHY_ACCENTS: Decal[] = [
  d(
    "number-pack",
    "Retro Number Pack",
    ["number", "digit", "retro", "pack"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'><g fill='currentColor' font-family='Impact, Arial Black, sans-serif' font-size='48' text-anchor='middle'><text x='14' y='46'>0</text><text x='32' y='46'>1</text><text x='50' y='46'>2</text><text x='68' y='46'>3</text><text x='86' y='46'>4</text></g></svg>`,
  ),
  d(
    "exclamation",
    "Expressive Exclamations",
    ["exclamation", "bang", "highlight"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'><g fill='currentColor' font-family='Impact, Arial Black, sans-serif' font-size='52'><text x='10' y='48'>!</text><text x='34' y='48'>!</text><text x='58' y='48' font-size='64'>!</text><text x='84' y='48'>!</text></g></svg>`,
  ),
  d(
    "authentic-quality",
    "Authentic Quality Badge",
    ["authentic", "quality", "seal", "premium"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='44' fill='none' stroke='currentColor' stroke-width='3'/><circle cx='50' cy='50' r='38' fill='currentColor'/><text x='50' y='42' text-anchor='middle' font-family='Georgia, serif' font-size='9' letter-spacing='1' fill='#fff'>AUTHENTIC</text><text x='50' y='58' text-anchor='middle' font-family='Georgia, serif' font-size='14' font-weight='bold' fill='#fff'>QUALITY</text><line x1='42' y1='46' x2='58' y2='46' stroke='#fff' stroke-width='1'/><line x1='42' y1='62' x2='58' y2='62' stroke='#fff' stroke-width='1'/></svg>`,
  ),
  d(
    "hundred-custom",
    "100% Custom Seal",
    ["custom", "100", "seal", "unique"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='44' fill='none' stroke='currentColor' stroke-width='3'/><text x='50' y='42' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='22' fill='currentColor'>100%</text><text x='50' y='62' text-anchor='middle' font-family='Georgia, serif' font-size='14' letter-spacing='2' fill='currentColor'>CUSTOM</text></svg>`,
  ),
  d(
    "made-california",
    "Made in California Badge",
    ["california", "made", "badge", "usa"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='44' fill='none' stroke='currentColor' stroke-width='3'/><text x='50' y='32' text-anchor='middle' font-family='Georgia, serif' font-size='9' letter-spacing='1' fill='currentColor'>MADE IN</text><text x='50' y='58' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='22' fill='currentColor'>CA</text><text x='50' y='74' text-anchor='middle' font-family='Georgia, serif' font-size='8' letter-spacing='1' fill='currentColor'>EST. 2024</text></svg>`,
  ),
  d(
    "dollar-sign",
    "Dollar Sign",
    ["dollar", "money", "price", "$"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='80' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='96' fill='currentColor'>$</text></svg>`,
  ),
  d(
    "percent-badge",
    "Percent Badge",
    ["percent", "%", "off", "sale"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='44' fill='none' stroke='currentColor' stroke-width='3'/><text x='50' y='70' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='56' fill='currentColor'>%</text></svg>`,
  ),
  d(
    "arrow-mark",
    "Arrow Typography Mark",
    ["arrow", "mark", "point", "→"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'><text x='50' y='50' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='56' fill='currentColor'>→</text></svg>`,
  ),
  d(
    "price-tag",
    "Price Tag",
    ["price", "tag", "tagged", "sale"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 6 L 96 50 L 50 96 L 6 50 Z' fill='currentColor'/><circle cx='34' cy='34' r='6' fill='#fff'/><text x='50' y='60' text-anchor='middle' font-family='Impact, sans-serif' font-size='24' fill='#fff'>$</text></svg>`,
  ),
  d(
    "barcode-stamp",
    "Barcode Stamp",
    ["barcode", "stamp", "scan", "code"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'><rect x='2' y='2' width='116' height='56' fill='none' stroke='currentColor' stroke-width='2'/><g fill='currentColor'><rect x='8' y='10' width='3' height='30'/><rect x='14' y='10' width='2' height='30'/><rect x='19' y='10' width='5' height='30'/><rect x='28' y='10' width='2' height='30'/><rect x='34' y='10' width='3' height='30'/><rect x='40' y='10' width='6' height='30'/><rect x='50' y='10' width='2' height='30'/><rect x='55' y='10' width='3' height='30'/><rect x='62' y='10' width='4' height='30'/><rect x='70' y='10' width='2' height='30'/><rect x='76' y='10' width='5' height='30'/><rect x='85' y='10' width='2' height='30'/><rect x='90' y='10' width='3' height='30'/><rect x='96' y='10' width='4' height='30'/><rect x='104' y='10' width='2' height='30'/><rect x='109' y='10' width='6' height='30'/></g></svg>`,
  ),
  d(
    "star-rating",
    "5-Star Rating",
    ["star", "rating", "five", "review"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'><g fill='currentColor'><polygon points='10,4 13,12 22,12 15,18 18,26 10,22 2,26 5,18 -2,12 7,12' transform='translate(0 0)'/><polygon points='30,4 33,12 42,12 35,18 38,26 30,22 22,26 25,18 18,12 27,12' transform='translate(0 0)'/><polygon points='50,4 53,12 62,12 55,18 58,26 50,22 42,26 45,18 38,12 47,12' transform='translate(0 0)'/><polygon points='70,4 73,12 82,12 75,18 78,26 70,22 62,26 65,18 58,12 67,12' transform='translate(0 0)'/><polygon points='90,4 93,12 102,12 95,18 98,26 90,22 82,26 85,18 78,12 87,12' transform='translate(0 0)'/></g></svg>`,
  ),
  d(
    "ampersand",
    "Heavy Ampersand",
    ["ampersand", "&", "and", "type"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='86' text-anchor='middle' font-family='Times New Roman, serif' font-size='110' font-weight='bold' font-style='italic' fill='currentColor'>&amp;</text></svg>`,
  ),
  d(
    "asterisk",
    "Asterisk Mark",
    ["asterisk", "star", "type", "*"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='currentColor'><rect x='46' y='10' width='8' height='80'/><rect x='10' y='46' width='80' height='8'/><rect x='20' y='20' width='8' height='8' transform='rotate(45 50 50)'/><rect x='72' y='20' width='8' height='8' transform='rotate(45 50 50)'/><rect x='20' y='72' width='8' height='8' transform='rotate(45 50 50)'/><rect x='72' y='72' width='8' height='8' transform='rotate(45 50 50)'/></g></svg>`,
  ),
  d(
    "parentheses",
    "Parentheses Accents",
    ["parentheses", "bracket", "accent", "( )"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='currentColor' stroke-width='6' stroke-linecap='round'><path d='M40 12 Q 20 50 40 88'/><path d='M60 12 Q 80 50 60 88'/></g></svg>`,
  ),
  d(
    "quote-bubble",
    "Quote Bubbles",
    ["quote", "bubble", "speech", "talking"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 80'><path d='M6 6 L 94 6 Q 94 6 94 18 L 94 42 Q 94 54 82 54 L 38 54 L 24 68 L 26 54 L 18 54 Q 6 54 6 42 L 6 18 Q 6 6 6 6 Z' fill='currentColor'/><text x='50' y='38' text-anchor='middle' font-family='Georgia, serif' font-size='28' font-weight='bold' fill='#fff'>&quot;</text></svg>`,
  ),
  d(
    "arrow-header",
    "Arrow Header",
    ["arrow", "header", "tag", "→"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M6 50 L 70 50 L 70 30 L 94 50 L 70 70 L 70 50' stroke='currentColor' stroke-width='6' fill='none' stroke-linecap='round'/><path d='M94 50 L 70 30 M 94 50 L 70 70' stroke='currentColor' stroke-width='6' stroke-linecap='round'/></svg>`,
  ),
  d(
    "stamp-date",
    "Stamp Date",
    ["date", "stamp", "calendar", "ink"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='10' y='14' width='80' height='72' fill='none' stroke='currentColor' stroke-width='3'/><line x1='10' y1='34' x2='90' y2='34' stroke='currentColor' stroke-width='3'/><line x1='30' y1='8' x2='30' y2='24' stroke='currentColor' stroke-width='3'/><line x1='70' y1='8' x2='70' y2='24' stroke='currentColor' stroke-width='3'/><text x='50' y='68' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='24' fill='currentColor'>24</text></svg>`,
  ),
  d(
    "warning-flag",
    "Warning Flag",
    ["warning", "flag", "alert", "caution"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><line x1='20' y1='8' x2='20' y2='94' stroke='currentColor' stroke-width='4'/><path d='M20 14 L 90 14 L 76 36 L 90 58 L 20 58 Z' fill='currentColor'/><text x='54' y='46' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='28' fill='#fff'>!</text></svg>`,
  ),
  d(
    "certified-stamp",
    "Certified Stamp",
    ["certified", "stamp", "seal", "approved"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='none' stroke='currentColor' stroke-width='3'/><circle cx='50' cy='50' r='32' fill='none' stroke='currentColor' stroke-width='1'/><text x='50' y='46' text-anchor='middle' font-family='Georgia, serif' font-size='9' letter-spacing='1' fill='currentColor'>CERTIFIED</text><text x='50' y='62' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='14' fill='currentColor'>✓</text></svg>`,
  ),
  d(
    "sale-burst",
    "Sale Burst Tag",
    ["sale", "burst", "starburst", "tag"],
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,4 58,24 78,18 70,38 90,42 74,52 86,68 66,66 70,86 52,76 50,96 48,76 30,86 34,66 14,68 26,52 10,42 30,38 22,18 42,24' fill='currentColor'/><text x='50' y='58' text-anchor='middle' font-family='Impact, Arial Black, sans-serif' font-size='18' fill='#fff'>SALE</text></svg>`,
  ),
];

// =========================================================================
// Aggregate catalog — append-only. To add categories 7+ add another const.
// =========================================================================
export const DECAL_CATEGORIES_BATCH2: DecalCategory[] = [
  {
    id: "skate-urban",
    label: "Skate, Urban & Street",
    blurb: "Concrete, wheels, drip art, punk & pavement.",
    decals: SKATE_URBAN,
  },
  {
    id: "y2k-cyber",
    label: "Y2K, Retro & Cyber",
    blurb: "Chrome, glitch, glow, grid nodes & nostalgic tech.",
    decals: Y2K_CYBER,
  },
  {
    id: "frames-badges",
    label: "Frames, Borders & Badges",
    blurb: "Torn paper, shields, seals & sticker outlines.",
    decals: FRAMES_BADGES,
  },
  {
    id: "typography-accents",
    label: "Typography Accents & Numbers",
    blurb: "Numbers, exclamations, badges & typographic marks.",
    decals: TYPOGRAPHY_ACCENTS,
  },
];

/** Flat list of every batch-2 decal, useful for the design studio global search. */
export const ALL_DECALS_BATCH2: Decal[] = DECAL_CATEGORIES_BATCH2.flatMap((c) => c.decals);

/**
 * Look up a single decal by id. Returns `undefined` if not found in this batch.
 * The primary decals.ts uses the same shape; the studio router tries both.
 */
export const findDecalBatch2 = (id: string): Decal | undefined =>
  ALL_DECALS_BATCH2.find((x) => x.id === id);

/**
 * Keyword search across all batch-2 decals. Returns matches sorted by
 * how early the query appears in the label/tags.
 */
export const searchDecalsBatch2 = (query: string): Decal[] => {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_DECALS_BATCH2;
  return ALL_DECALS_BATCH2.filter((decal) => {
    if (decal.id.toLowerCase().includes(q)) return true;
    if (decal.label.toLowerCase().includes(q)) return true;
    return decal.tags.some((tag) => tag.includes(q));
  }).sort((a, b) => {
    const aScore = a.label.toLowerCase().startsWith(q) ? 0 : 1;
    const bScore = b.label.toLowerCase().startsWith(q) ? 0 : 1;
    return aScore - bScore;
  });
};

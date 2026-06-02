import type { Department } from "@/lib/products";

/** Curated mega-menu structure mirrored by the shop sidebar filters. */
export type MenuColumn = {
  title: string;
  links: { label: string; type?: string; category?: string }[];
};

export const MEGA_MENU: Record<Department, { columns: MenuColumn[]; allLabel: string }> = {
  skate: {
    allLabel: "Shop All Skate",
    columns: [
      {
        title: "Decks",
        links: [
          { label: "Shop All", type: "deck" },
          { label: "Featured Decks", type: "deck", category: "featured" },
          { label: "Logo Decks", type: "deck", category: "logo" },
          { label: "Pro Models", type: "deck", category: "pro" },
          { label: "Reissues", type: "deck", category: "reissue" },
          { label: "Shaped Decks", type: "deck", category: "shaped" },
        ],
      },
      {
        title: "Tech Decks",
        links: [
          { label: "Shop All", type: "deck", category: "tech" },
          { label: "VX™ Technology", type: "deck", category: "vx" },
        ],
      },
      {
        title: "Completes",
        links: [
          { label: "Shop All", type: "complete" },
          { label: "Street / Park", type: "complete", category: "street" },
          { label: "Cruisers & Longboards", type: "cruiser" },
        ],
      },
      {
        title: "Accessories",
        links: [
          { label: "Shop All", type: "skate-accessory" },
          { label: "Trucks", type: "trucks" },
          { label: "Wheels & Bearings", type: "wheels" },
          { label: "Grip Tape", type: "grip" },
          { label: "Rails", type: "rails" },
          { label: "Parts", type: "parts" },
          { label: "Curb Wax", type: "curb-wax" },
          { label: "Stickers", type: "stickers" },
        ],
      },
    ],
  },
  surf: {
    allLabel: "Shop All Surf",
    columns: [
      {
        title: "Surfboards",
        links: [
          { label: "Shop All", type: "surfboard" },
          { label: "Shortboards", type: "shortboard" },
          { label: "Longboards", type: "longboard" },
          { label: "Fish & Funboards", type: "fish" },
          { label: "Soft Tops / Foamies", type: "softtop" },
        ],
      },
      {
        title: "Wetsuits & Neoprene",
        links: [
          { label: "Shop All", type: "wetsuit" },
          { label: "Fullsuits (3/2 & 4/3)", type: "wetsuit", category: "fullsuit" },
          { label: "Springsuits", type: "wetsuit", category: "spring" },
          { label: "Rash Guards & UV", type: "rashguard" },
        ],
      },
      {
        title: "Hardware",
        links: [
          { label: "Shop All", type: "surf-accessory" },
          { label: "Fins", type: "fins" },
          { label: "Leashes", type: "leash" },
          { label: "Traction Pads", type: "traction" },
          { label: "Surf Wax", type: "surf-wax" },
          { label: "Board Bags & Socks", type: "boardbag" },
        ],
      },
    ],
  },
  clothing: {
    allLabel: "Shop All Clothing",
    columns: [
      {
        title: "Mens",
        links: [
          { label: "Shop All", target: "men" } as any,
          { label: "Tees", type: "tee", category: "men" },
          { label: "Sweatshirts", type: "sweatshirt", category: "men" },
          { label: "Hoodies", type: "hoodie", category: "men" },
          { label: "Pants", type: "pants", category: "men" },
          { label: "Shorts", type: "shorts", category: "men" },
        ],
      },
      {
        title: "Womens",
        links: [
          { label: "Shop All", category: "women" },
          { label: "Tees", type: "tee", category: "women" },
          { label: "Sweatshirts", type: "sweatshirt", category: "women" },
          { label: "Hoodies", type: "hoodie", category: "women" },
        ],
      },
      {
        title: "Boys",
        links: [
          { label: "Shop All", category: "boys" },
          { label: "Tees", type: "tee", category: "boys" },
          { label: "Sweatshirts", type: "sweatshirt", category: "boys" },
          { label: "Hoodies", type: "hoodie", category: "boys" },
          { label: "Pants", type: "pants", category: "boys" },
          { label: "Shorts", type: "shorts", category: "boys" },
        ],
      },
      {
        title: "Girls",
        links: [
          { label: "Shop All", category: "girls" },
          { label: "Tees", type: "tee", category: "girls" },
          { label: "Dresses", type: "dress", category: "girls" },
          { label: "Sweatshirts", type: "sweatshirt", category: "girls" },
          { label: "Hoodies", type: "hoodie", category: "girls" },
          { label: "Pants", type: "pants", category: "girls" },
          { label: "Shorts", type: "shorts", category: "girls" },
        ],
      },
    ],
  },
  accessories: {
    allLabel: "Shop All Accessories",
    columns: [
      {
        title: "Accessories",
        links: [
          { label: "Shop All" },
          { label: "Socks", type: "socks" },
          { label: "Bags & Backpacks", type: "bag" },
          { label: "Headwear", type: "headwear" },
          { label: "Footwear", type: "footwear" },
          { label: "Beach", type: "beach" },
          { label: "School Essentials", type: "school" },
          { label: "Stickers", type: "stickers" },
        ],
      },
    ],
  },
  other: {
    allLabel: "Shop All Other",
    columns: [
      {
        title: "Other",
        links: [
          { label: "Fashion", type: "fashion" },
          { label: "Jewellery", type: "jewellery" },
          { label: "Artisan Products", type: "artisan" },
        ],
      },
    ],
  },
};

// ---------- Filter taxonomies (mirror nav + spec presets) ----------

export const COLOURS = [
  "black", "blue", "brown", "grey", "pink", "red",
  "white", "yellow", "multi", "orange", "purple",
] as const;
export type Colour = (typeof COLOURS)[number];

export const GENDERS = ["men", "women", "unisex", "boys", "girls"] as const;
export type Gender = (typeof GENDERS)[number];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "S/M", "L/XL", "2-8"] as const;

/** Filters that only make sense for skate decks. */
export const DECK_SPEC_FIELDS = [
  { key: "deck_width", label: "Deck Width" },
  { key: "deck_length", label: "Deck Length" },
  { key: "deck_nose_length", label: "Nose Length" },
  { key: "deck_shape", label: "Deck Shape" },
  { key: "deck_type", label: "Deck Type" },
  { key: "deck_wheelbase", label: "Wheelbase" },
] as const;

/** Wetsuit thickness for surf. */
export const SURF_SPEC_FIELDS = [
  { key: "wetsuit_thickness", label: "Wetsuit Thickness" },
  { key: "fin_setup", label: "Fin Setup" },
] as const;

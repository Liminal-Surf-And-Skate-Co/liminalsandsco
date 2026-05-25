import deck from "@/assets/hero-deck.jpg";
import surfboard from "@/assets/craft-surfboard.jpg";
import apparel from "@/assets/apparel.jpg";
import accessories from "@/assets/accessories.jpg";
import workshop from "@/assets/about-workshop.jpg";

export type Category =
  | "Surfboards"
  | "Skateboards"
  | "Merchandise"
  | "Footwear"
  | "Accessories"
  | "Jewellery"
  | "Hand Crafted";

export type Product = {
  slug: string;
  img: string;
  title: string;
  price: number;
  tag: string;
  category: Category;
  addedAt: string;
  description: string;
  details: string[];
};

export const categories: Category[] = [
  "Surfboards",
  "Skateboards",
  "Merchandise",
  "Footwear",
  "Accessories",
  "Jewellery",
  "Hand Crafted",
];

export const allProducts: Product[] = [
  // Skateboards
  { slug: "maple-cruisers", img: deck, title: "Maple Cruisers", price: 180, tag: "Skate", category: "Skateboards", addedAt: "2025-02-12",
    description: "Seven-ply Canadian maple cruisers shaped for smooth carving and steady commutes. Pressed in small batches in our workshop.",
    details: ["7-ply Canadian maple", "Hand-pressed concave", "Sealed grip tape", "Wheels & trucks included"] },
  { slug: "street-decks", img: deck, title: "Street Decks", price: 160, tag: "Skate", category: "Skateboards", addedAt: "2025-05-04",
    description: "Popsicle street decks built for ledges, stairs, and everyday flatground sessions.",
    details: ["8.25\" width", "Medium concave", "Heat-transferred graphics"] },

  // Surfboards
  { slug: "shaped-shortboards", img: surfboard, title: "Shaped Shortboards", price: 720, tag: "Surf", category: "Surfboards", addedAt: "2024-11-20",
    description: "Performance shortboards shaped by hand for responsive turns in chest- to head-high surf.",
    details: ["EPS core, epoxy glass", "FCS II fin boxes", "Custom dims on request"] },
  { slug: "longboard-logs", img: surfboard, title: "Longboard Logs", price: 880, tag: "Surf", category: "Surfboards", addedAt: "2026-01-08",
    description: "Classic single-fin logs for nose rides and slow, glassy lines.",
    details: ["9'2\" - 9'6\"", "Volan glass tail patch", "Resin tint options"] },

  // Merchandise
  { slug: "heavyweight-hoodies", img: apparel, title: "Heavyweight Hoodies", price: 85, tag: "Hoodies", category: "Merchandise", addedAt: "2025-09-14",
    description: "14oz brushed-back fleece hoodies, garment-washed for that broken-in feel from day one.",
    details: ["14oz cotton fleece", "Garment washed", "Embroidered chest mark"] },
  { slug: "logo-tees", img: apparel, title: "Logo Tees", price: 38, tag: "T-Shirts", category: "Merchandise", addedAt: "2025-07-02",
    description: "Mid-weight 6.5oz cotton tees printed in our studio.",
    details: ["6.5oz ringspun cotton", "Water-based print", "Boxy fit"] },
  { slug: "canvas-work-pants", img: apparel, title: "Canvas Work Pants", price: 110, tag: "Pants", category: "Merchandise", addedAt: "2026-04-10",
    description: "Heavy 12oz canvas work pants cut for movement around the shop.",
    details: ["12oz cotton canvas", "Triple-needle seams", "Reinforced knees"] },

  // Footwear
  { slug: "vulc-skate-shoes", img: apparel, title: "Vulc Skate Shoes", price: 95, tag: "Shoes", category: "Footwear", addedAt: "2026-03-02",
    description: "Vulcanised low-tops with a gum sole. Boardfeel-first, broken-in fast.",
    details: ["Vulcanised gum sole", "Suede toe", "Padded collar"] },
  { slug: "shop-slides", img: apparel, title: "Shop Slides", price: 42, tag: "Slides", category: "Footwear", addedAt: "2026-02-20",
    description: "Soft EVA slides for the carpark after a session. Stupidly comfortable.",
    details: ["EVA footbed", "Embossed mark", "Quick-dry"] },
  { slug: "salt-sandals", img: apparel, title: "Salt Sandals", price: 58, tag: "Sandals", category: "Footwear", addedAt: "2025-11-08",
    description: "Leather-strap sandals built for sandy feet and long walks down the headland.",
    details: ["Full-grain leather", "Rubber outsole", "Adjustable strap"] },

  // Accessories
  { slug: "workshop-caps", img: apparel, title: "Workshop Caps", price: 32, tag: "Hats", category: "Accessories", addedAt: "2026-03-19",
    description: "Six-panel canvas caps with a low, unstructured crown.",
    details: ["Cotton canvas", "Adjustable strap", "Embroidered mark"] },
  { slug: "wool-beanies", img: apparel, title: "Wool Beanies", price: 36, tag: "Beanies", category: "Accessories", addedAt: "2026-04-22",
    description: "Cuffed merino-blend beanies for cold dawn patrols.",
    details: ["Merino wool blend", "Cuffed fit", "Woven label"] },
  { slug: "salt-sunglasses", img: accessories, title: "Salt Sunglasses", price: 95, tag: "Sunglasses", category: "Accessories", addedAt: "2025-12-01",
    description: "Polarised sunglasses built for sun-blasted line-ups and long drives north.",
    details: ["Polarised lenses", "Italian acetate", "Spring hinges"] },
  { slug: "field-backpack", img: accessories, title: "Field Backpack", price: 140, tag: "Backpack", category: "Accessories", addedAt: "2026-01-30",
    description: "Waxed-canvas roll-top backpack sized for a deck, a wetsuit, and a thermos.",
    details: ["Waxed canvas", "Roll-top closure", "Padded laptop sleeve"] },
  { slug: "wet-bag", img: accessories, title: "Wet Bag", price: 48, tag: "Wet Bag", category: "Accessories", addedAt: "2026-02-05",
    description: "Sealed wet/dry bag so the back seat survives a post-surf drive home.",
    details: ["Waterproof seams", "Roll-top", "Shoulder strap"] },
  { slug: "beach-towel", img: accessories, title: "Beach Towel", price: 54, tag: "Towel", category: "Accessories", addedAt: "2026-03-11",
    description: "Heavyweight cotton terry towel, oversized for the post-surf wrap.",
    details: ["100% cotton terry", "180 × 90 cm", "Woven label"] },

  // Jewellery
  { slug: "resin-wave-pendant", img: accessories, title: "Resin Wave Pendant", price: 48, tag: "Pendant", category: "Jewellery", addedAt: "2025-08-22",
    description: "Cast resin pendants with hand-poured ocean swirls. Each piece is one of one.",
    details: ["Hand-poured resin", "Stainless chain", "One of one"] },
  { slug: "brass-surf-ring", img: accessories, title: "Brass Surf Ring", price: 62, tag: "Ring", category: "Jewellery", addedAt: "2026-02-14",
    description: "Solid brass band with a carved swell motif. Develops a warm patina with wear.",
    details: ["Solid brass", "Hand-carved detail", "Whole & half sizes"] },
  { slug: "cord-bracelet", img: accessories, title: "Cord Bracelet", price: 28, tag: "Bracelet", category: "Jewellery", addedAt: "2025-06-30",
    description: "Waxed cord bracelets with brass hardware. Easy daily wear.",
    details: ["Waxed cotton cord", "Brass hardware", "Adjustable fit"] },

  // Hand Crafted
  { slug: "hand-shaped-fins", img: workshop, title: "Hand-Shaped Fins", price: 140, tag: "One-off", category: "Hand Crafted", addedAt: "2025-10-05",
    description: "Foiled wood-core fins shaped one at a time. Specify your template and box system.",
    details: ["Wood core, glass wrap", "FCS II or Futures", "Custom templates"] },
  { slug: "inlay-cruiser", img: workshop, title: "Inlay Cruiser", price: 320, tag: "Limited", category: "Hand Crafted", addedAt: "2026-05-01",
    description: "Limited-run cruisers with multi-species wood inlays. Numbered editions of twelve.",
    details: ["Wood inlay deck", "Numbered /12", "Premium hardware"] },
  { slug: "carved-wall-piece", img: workshop, title: "Carved Wall Piece", price: 540, tag: "Art", category: "Hand Crafted", addedAt: "2024-12-18",
    description: "Sculptural wall pieces carved from reclaimed timber. Commissioned one at a time.",
    details: ["Reclaimed timber", "Hand carved & oiled", "Mounting hardware"] },
];

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import deck from "@/assets/hero-deck.jpg";
import surfboard from "@/assets/craft-surfboard.jpg";
import apparel from "@/assets/apparel.jpg";
import accessories from "@/assets/accessories.jpg";
import workshop from "@/assets/about-workshop.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Liminal Surf & Skate Co" },
      { name: "description", content: "Skateboards, surfboards, merchandise, jewellery, and hand-crafted pieces from Liminal." },
      { property: "og:title", content: "Shop — Liminal Surf & Skate Co" },
      { property: "og:description", content: "Skateboards, surfboards, merchandise, jewellery, and hand-crafted pieces from Liminal." },
    ],
  }),
  component: ShopPage,
});

type Product = { img: string; title: string; price: string; tag: string };

const boards: Product[] = [
  { img: deck, title: "Maple Cruisers", price: "From $180", tag: "Skate" },
  { img: deck, title: "Street Decks", price: "From $160", tag: "Skate" },
  { img: surfboard, title: "Shaped Shortboards", price: "From $720", tag: "Surf" },
  { img: surfboard, title: "Longboard Logs", price: "From $880", tag: "Surf" },
];

const merch: Product[] = [
  { img: apparel, title: "Heavyweight Hoodies", price: "$85", tag: "Hoodies" },
  { img: apparel, title: "Logo Tees", price: "$38", tag: "T-Shirts" },
  { img: apparel, title: "Workshop Caps", price: "$32", tag: "Hats" },
  { img: accessories, title: "Salt Sunglasses", price: "$95", tag: "Sunglasses" },
  { img: apparel, title: "Canvas Work Pants", price: "$110", tag: "Pants" },
];

const jewellery: Product[] = [
  { img: accessories, title: "Resin Wave Pendant", price: "$48", tag: "Pendant" },
  { img: accessories, title: "Brass Surf Ring", price: "$62", tag: "Ring" },
  { img: accessories, title: "Cord Bracelet", price: "$28", tag: "Bracelet" },
];

const handCrafted: Product[] = [
  { img: workshop, title: "Hand-Shaped Fins", price: "$140", tag: "One-off" },
  { img: workshop, title: "Inlay Cruiser", price: "$320", tag: "Limited" },
  { img: workshop, title: "Carved Wall Piece", price: "$540", tag: "Art" },
];

function Section({ id, number, title, blurb, items }: { id: string; number: string; title: string; blurb: string; items: Product[] }) {
  return (
    <section id={id} className="py-24 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
            ({number}) {title}
          </p>
          <h2 className="font-display font-black text-4xl lg:text-6xl max-w-3xl">
            {blurb}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <a
              key={p.title}
              href="#newsletter"
              className="group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden"
            >
              <div className="aspect-square overflow-hidden bg-background">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                    {p.tag}
                  </p>
                  <h3 className="font-display font-bold text-lg">{p.title}</h3>
                </div>
                <span className="text-silver text-sm font-mono">{p.price}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="py-24 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              The Shop
            </p>
            <h1 className="font-display font-black text-5xl lg:text-8xl leading-none">
              Everything we make,<br />in one place.
            </h1>
            <p className="mt-8 max-w-2xl text-silver/80 font-mono text-sm leading-relaxed">
              From shaped boards to small-batch jewellery — each piece comes out of the
              same workshop, between wave and concrete.
            </p>
          </div>
        </section>

        <Section id="boards" number="01" title="Skate & Surf" blurb="Skateboards & surfboards." items={boards} />
        <Section id="merch" number="02" title="Merchandise" blurb="Wear it in & out of the water." items={merch} />
        <Section id="jewellery" number="03" title="Jewellery" blurb="Small wearable pieces." items={jewellery} />
        <Section id="hand-crafted" number="04" title="Hand Crafted" blurb="One-off & limited works." items={handCrafted} />
      </main>
      <Footer />
    </div>
  );
}

import hero from "@/assets/hero-deck.jpg";
import apparel from "@/assets/apparel.jpg";
import accessories from "@/assets/accessories.jpg";
import surfboard from "@/assets/craft-surfboard.jpg";

const products = [
  { img: hero, title: "Maple Cruisers", price: "From $180", tag: "Decks" },
  { img: surfboard, title: "Shaped Surfboards", price: "From $720", tag: "Surf" },
  { img: apparel, title: "Heavyweight Hoodies", price: "$85", tag: "Wear" },
  { img: accessories, title: "Wheels & Stickers", price: "From $12", tag: "Bits" },
];

export function Shop() {
  return (
    <section id="shop" className="relative py-32 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              (02) The Drop
            </p>
            <h2 className="font-display font-black text-5xl lg:text-7xl">
              Shop the<br />latest run.
            </h2>
          </div>
          <a
            href="#newsletter"
            className="font-mono text-xs uppercase tracking-widest text-silver/70 hover:text-primary border-b border-silver/30 pb-1"
          >
            View all →
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
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

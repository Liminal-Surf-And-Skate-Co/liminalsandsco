import { Instagram } from "lucide-react";
import deck from "@/assets/hero-deck.jpg";
import apparel from "@/assets/apparel.jpg";
import accessories from "@/assets/accessories.jpg";
import surfboard from "@/assets/craft-surfboard.jpg";
import workshop from "@/assets/about-workshop.jpg";

const tiles = [
  { img: deck, user: "@maya.r", caption: "First push, fresh deck." },
  { img: surfboard, user: "@theo.k", caption: "Dawn glass at North Point." },
  { img: apparel, user: "@jules.p", caption: "Hoodie weather." },
  { img: workshop, user: "@liminal.co", caption: "Mid-shape, mid-bench." },
  { img: accessories, user: "@sal.t", caption: "New shades, salt-proof." },
  { img: deck, user: "@rio.b", caption: "Bowls at sunset." },
];

export function SocialFeed() {
  return (
    <section className="relative py-24 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Live Feed
            </p>
            <h2 className="font-display font-black text-4xl lg:text-5xl">From the crew.</h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-silver/70 hover:text-primary border-b border-silver/30 pb-1"
          >
            <Instagram className="h-4 w-4" /> Follow @liminal.co
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {tiles.map((t, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              className="relative group aspect-square overflow-hidden bg-card border border-border/40"
            >
              <img
                src={t.img}
                alt={t.caption}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/70 transition-colors flex flex-col items-center justify-center text-center p-3 opacity-0 group-hover:opacity-100">
                <Instagram className="h-5 w-5 text-primary mb-2" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver">
                  {t.user}
                </span>
                <span className="font-mono text-[10px] text-silver/70 mt-1">{t.caption}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

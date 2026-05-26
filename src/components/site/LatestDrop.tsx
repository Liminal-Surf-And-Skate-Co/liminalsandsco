import { Link } from "@tanstack/react-router";
import apparel from "@/assets/apparel.jpg";

export function LatestDrop() {
  return (
    <section className="relative border-y border-border/40 bg-card/40">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 relative">
          <img src={apparel} alt="Latest seasonal drop — apparel and footwear" loading="lazy" className="w-full h-auto shadow-card" />
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest px-3 py-1">
            New In
          </span>
        </div>
        <div className="md:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Latest Drop · Season 02</p>
          <h2 className="font-display font-black text-4xl lg:text-6xl leading-none mb-5">
            Heavyweight fleece,<br />vulc soles, salt-proof shades.
          </h2>
          <p className="text-silver/80 max-w-lg mb-6">
            New apparel, footwear, and accessories built for cold dawn patrols and long carpark hangs. Limited runs, gone when they're gone.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-gradient-purple text-primary-foreground px-8 py-4 font-mono text-xs uppercase tracking-widest shadow-glow hover:translate-y-[-2px] transition-transform"
          >
            Shop the Drop →
          </Link>
        </div>
      </div>
    </section>
  );
}

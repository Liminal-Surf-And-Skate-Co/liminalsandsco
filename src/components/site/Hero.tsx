import hero from "@/assets/hero-deck.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden grain">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-8">
            Oh Yeah Not Bad! · Est. 2026 · Hand-crafted
          </p>
          <h1 className="font-display font-black text-6xl sm:text-7xl lg:text-[8.5rem] leading-[0.85] tracking-tighter mb-8">
            BETWEEN<br />
            <span className="text-stroke">WAVE</span><br />
            & CONCRETE.
          </h1>
          <p className="text-lg text-silver/80 max-w-xl mb-10 leading-relaxed">
            Liminal is a one-bench workshop crafting hand-shaped skate decks
            and surfboards. No factories. No shortcuts. Just slow craft for
            people who feel the in-between.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#custom"
              className="bg-gradient-purple text-primary-foreground px-8 py-4 font-mono text-xs uppercase tracking-widest shadow-glow hover:translate-y-[-2px] transition-transform"
            >
              Commission a Board
            </a>
            <a
              href="#shop"
              className="border border-silver/30 text-silver px-8 py-4 font-mono text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
            >
              Shop the Drop
            </a>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full" />
          <img
            src={hero}
            alt="Hand-shaped skateboard deck in a dim workshop"
            width={1536}
            height={1536}
            className="relative w-full h-auto animate-float shadow-card"
          />
        </div>
      </div>

      {/* marquee */}
      <div className="border-y border-border/40 overflow-hidden bg-background/40">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 font-display text-2xl text-silver/40">
              <span>OH YEAH NOT BAD!</span><span className="text-primary">✦</span>
              <span>HAND CRAFTED</span><span className="text-primary">✦</span>
              <span>SURF · SKATE · WEAR</span><span className="text-primary">✦</span>
              <span>MADE TO RIDE</span><span className="text-primary">✦</span>
              <span>NO TWO ALIKE</span><span className="text-primary">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

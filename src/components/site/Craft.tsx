import surfboard from "@/assets/craft-surfboard.jpg";

export function Craft() {
  return (
    <section id="craft" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-6 -left-6 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            (01) The Craft
          </div>
          <img
            src={surfboard}
            alt="Craftsman shaping a surfboard"
            width={1280}
            height={1600}
            loading="lazy"
            className="w-full h-auto shadow-card"
          />
        </div>
        <div>
          <h2 className="font-display font-black text-5xl lg:text-7xl leading-none mb-8">
            Every board<br />tells on its<br />maker.
          </h2>
          <p className="text-silver/80 text-lg leading-relaxed mb-10 max-w-md">
            From maple billet to glassed surfboard, each piece passes through
            one set of hands. We shape it, sand it, and ride it before it
            ever leaves the shop.
          </p>
          <dl className="grid grid-cols-2 gap-8 border-t border-border/40 pt-8">
            {[
              ["7-day", "Shape & cure"],
              ["100%", "Hand-finished"],
              ["1 of 1", "Custom graphics"],
              ["∞", "Soul per board"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="font-display text-3xl text-primary">{k}</dt>
                <dd className="font-mono text-xs uppercase tracking-widest text-silver/60 mt-1">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

import about from "@/assets/about-workshop.jpg";

export function About() {
  return (
    <section id="about" className="relative py-32 grain">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-6 bg-primary/15 blur-3xl rounded-full" />
          <img
            src={about}
            alt="A craftsperson hand-shaping a skate deck in the Liminal workshop"
            width={1280}
            height={1280}
            className="relative w-full h-auto shadow-card"
          />
        </div>
        <div className="lg:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
            About · The Workshop
          </p>
          <h2 className="font-display font-black text-5xl lg:text-7xl leading-[0.9] tracking-tighter mb-8">
            ONE BENCH.<br />
            <span className="text-stroke">TWO WORLDS.</span><br />
            ONE STOKE.
          </h2>
          <div className="space-y-5 text-silver/80 text-lg leading-relaxed max-w-xl">
            <p>
              Liminal started where most days end — between the last set and
              the first push down an empty street. We make boards for the
              in-between people: surfers who skate, skaters who paddle out,
              anyone who lives in the gap.
            </p>
            <p>
              Every deck and blank is shaped by hand on a single bench. No
              CNC. No outsourced glassing. Just slow work, salvaged blanks,
              and a "oh yeah, not bad" when it finally rolls right.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <Stat k="2026" v="Founded" />
            <Stat k="100%" v="Hand-made" />
            <Stat k="1" v="Bench" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-t border-primary/40 pt-3">
      <div className="font-display text-3xl text-silver">{k}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-1">
        {v}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Heart, Leaf, Users, Wrench } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { About } from "@/components/site/About";
import workshop from "@/assets/about-workshop.jpg";
import surfboard from "@/assets/craft-surfboard.jpg";
import deck from "@/assets/hero-deck.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "One bench. Two worlds. One stoke. The origin story, the crew, the riders, and what Liminal stands for.",
      },
      { property: "og:title", content: "About — Liminal Surf & Skate Co" },
      {
        property: "og:description",
        content: "The story behind Liminal — hand-shaped surf and skate from a one-bench workshop.",
      },
    ],
  }),
  component: AboutPage,
});

const crew = [
  { name: "Sam Ortega", role: "Founder · Shaper", img: workshop, spot: "North Point reef", board: "6'2\" round-tail" },
  { name: "Jules Park", role: "Glassing · Repairs", img: workshop, spot: "Riverside bowls", board: "Custom 8.25\" street" },
  { name: "Mika Tan", role: "Graphics · Studio", img: workshop, spot: "Harbour wall longboard", board: "9'4\" log" },
];

const team = [
  { name: "Theo K.", stance: "Goofy", town: "Westside", img: deck, ride: "Street Decks 8.25\"" },
  { name: "Maya R.", stance: "Regular", town: "North Point", img: surfboard, ride: "Shaped Shortboard 5'10\"" },
  { name: "Leo F.", stance: "Regular", town: "Downtown", img: deck, ride: "Maple Cruiser" },
  { name: "Ana D.", stance: "Goofy", town: "Coastal Vil.", img: surfboard, ride: "Longboard Log 9'2\"" },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <About />

        <section className="py-24 border-t border-border/40 bg-background">
          <div className="max-w-4xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">01 · The Origin</p>
            <h2 className="font-display font-black text-4xl lg:text-6xl leading-none mb-10">
              It started in a<br /><span className="text-stroke">garage.</span>
            </h2>
            <div className="space-y-5 text-silver/85 text-lg leading-relaxed max-w-2xl">
              <p>
                One winter, two friends, a borrowed planer and a stack of seconds
                blanks no one else wanted. We were tired of paying $900 for a
                board that snapped on its third session — and tired of decks that
                felt mass-pressed and dead under our feet.
              </p>
              <p>
                So we started shaping our own. Bad ones, then okay ones, then
                ones our friends asked for. Liminal grew out of that — a workshop
                making honest, durable gear that survives heavy street sessions
                and saltwater abuse, without costing a fortune.
              </p>
              <p className="font-mono text-sm uppercase tracking-widest text-primary pt-4 border-t border-border/40">
                Mission: keep the soul, lose the markup.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-border/40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">02 · The Crew</p>
                <h2 className="font-display font-black text-4xl lg:text-5xl leading-none">Who's at the bench.</h2>
              </div>
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {crew.map((c) => (
                <div key={c.name} className="bg-card border border-border/60 overflow-hidden">
                  <div className="aspect-[4/5] overflow-hidden bg-background">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-xl mb-1">{c.name}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">{c.role}</p>
                    <p className="font-mono text-xs text-silver/80">Local spot: {c.spot}</p>
                    <p className="font-mono text-xs text-silver/80">Daily ride: {c.board}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-border/40 bg-card/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">03 · The Team</p>
                <h2 className="font-display font-black text-4xl lg:text-5xl leading-none">Riders we back.</h2>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </div>
            <p className="text-silver/70 max-w-2xl mb-10">
              The people who put our boards through their paces. Local crew, real footage,
              no marketing copy.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((r) => (
                <div key={r.name} className="bg-card border border-border/60 overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-background">
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-lg mb-1">{r.name}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                      {r.stance} · {r.town}
                    </p>
                    <p className="font-mono text-xs text-silver/80">Ride: {r.ride}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-border/40">
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">04 · What we stand for</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl leading-none mb-12">
              Beliefs, not slogans.
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border/60 bg-card p-7">
                <Leaf className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-display font-bold text-2xl mb-3">Sustainability</h3>
                <p className="text-silver/80 leading-relaxed">
                  Recycled cotton blends. Plastic-free shipping. Salvaged blanks
                  where we can. We don't have it perfect — we have it in progress.
                  We run beach cleanups every season and donate a cut of every
                  Hand Crafted piece to local ocean conservation.
                </p>
              </div>
              <div className="border border-border/60 bg-card p-7">
                <Heart className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-display font-bold text-2xl mb-3">Inclusivity</h3>
                <p className="text-silver/80 leading-relaxed">
                  Skate and surf are for everyone. Every age, every body, every
                  background, every skill level. If you've never stepped on a
                  board before, come by the shop — we'll point you at the right
                  setup and the right spot.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

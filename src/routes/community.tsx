import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, MapPin, MessageCircle, Trophy, Upload, Users, Video, Waves } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const DISCORD_URL = "https://discord.gg/your-invite-here";

type Pin = { id: string; name: string; kind: "Surf" | "Skate"; x: number; y: number; tip: string };
const mapPins: Pin[] = [
  { id: "np", name: "North Point Reef", kind: "Surf", x: 22, y: 30, tip: "Mid-tide pushing in. SW swell lights it up." },
  { id: "hw", name: "Harbour Wall", kind: "Surf", x: 58, y: 22, tip: "Sheltered on a NE wind. Mellow lefts." },
  { id: "rb", name: "Riverside Bowls", kind: "Skate", x: 38, y: 62, tip: "Smooth concrete, deep end gets dusty." },
  { id: "sy", name: "School Yard Banks", kind: "Skate", x: 72, y: 70, tip: "Lights til 10pm. Locals after 6." },
  { id: "ll", name: "Lighthouse Lefts", kind: "Surf", x: 82, y: 48, tip: "Hidden gem on bigger swells. Walk-in." },
  { id: "dt", name: "Downtown Ledges", kind: "Skate", x: 14, y: 80, tip: "Smooth marble, no bust til midnight." },
];

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Liminal Surf & Skate Co" },
      { name: "description", content: "Local spots, events, ride shares, and the Liminal Discord — the hub for our skate & surf community." },
      { property: "og:title", content: "Community — Liminal Surf & Skate Co" },
      { property: "og:description", content: "Local spots, events, ride shares, and our Discord community." },
    ],
  }),
  component: CommunityPage,
});

const spots = [
  { name: "North Point Reef", kind: "Surf", status: "3–4ft, glassy", note: "Dawn patrol looking clean. Mid-tide is the move." },
  { name: "Harbour Wall", kind: "Surf", status: "Flat", note: "Wind switch this afternoon, maybe knee-high by dusk." },
  { name: "Riverside Bowls", kind: "Skate", status: "Dry", note: "Some debris in the deep end — bring a broom." },
  { name: "School Yard Banks", kind: "Skate", status: "Dry", note: "Quiet after 6pm. Lights stay on til 10." },
];

const events = [
  { date: "Jun 14", title: "Beach Cleanup — North Point", detail: "9am meet at the car park. Gloves and bags provided." },
  { date: "Jun 22", title: "Mini Ramp Jam", detail: "BYO board. Beers + BBQ from 4pm at the workshop." },
  { date: "Jul 06", title: "Sunrise Paddle-Out", detail: "Long-boards welcome. Coffee after at the kiosk." },
  { date: "Jul 19", title: "Shaping Workshop (Open Day)", detail: "Come watch a blank become a deck. Free entry." },
];

const rides = [
  { user: "Maya R.", route: "City → North Point", when: "Sat 5:30am", seats: 2 },
  { user: "Theo K.", route: "Westside → Riverside Bowls", when: "Sun 3pm", seats: 3 },
  { user: "Jules P.", route: "Downtown → Harbour Wall", when: "Weekdays 6am", seats: 1 },
];

export function CommunityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="border-b border-border/40 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">The Crew</p>
            <h1 className="font-display font-black text-5xl lg:text-7xl leading-none mb-6">
              COMMUNITY,<br /><span className="text-stroke">NOT CONTENT.</span>
            </h1>
            <p className="text-silver/80 text-lg max-w-2xl">
              Local spots, ride-shares, jams, and the people who keep the scene alive.
              Pull up, say hi, share a wave.
            </p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 mt-8 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-6 py-3 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" /> Join the Discord
            </a>
          </div>
        </section>

        {/* Spot Checks */}
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display font-black text-3xl lg:text-4xl">Local Spot Checks</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">Updated daily</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {spots.map((s) => (
                <div key={s.name} className="border border-border/60 bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {s.kind === "Surf" ? <Waves className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{s.kind}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1">{s.name}</h3>
                  <p className="font-mono text-xs text-silver mb-3">{s.status}</p>
                  <p className="text-sm text-silver/80">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display font-black text-3xl lg:text-4xl">Events Calendar</h2>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <ul className="divide-y divide-border/40 border-y border-border/40">
              {events.map((e) => (
                <li key={e.title} className="grid md:grid-cols-12 gap-6 py-6 items-baseline px-2">
                  <div className="md:col-span-2 font-mono text-xs uppercase tracking-widest text-silver/60">{e.date}</div>
                  <div className="md:col-span-7">
                    <h3 className="font-display font-bold text-xl text-silver mb-1">{e.title}</h3>
                    <p className="text-silver/70 text-sm">{e.detail}</p>
                  </div>
                  <div className="md:col-span-3 md:text-right font-mono text-[10px] uppercase tracking-widest text-primary">
                    RSVP in Discord →
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ride Share */}
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display font-black text-3xl lg:text-4xl">Ride Share & Skate Buddies</h2>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rides.map((r) => (
                <div key={r.user + r.route} className="border border-border/60 bg-card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">{r.user}</p>
                  <h3 className="font-display font-bold text-lg mb-1">{r.route}</h3>
                  <p className="font-mono text-xs text-silver/80 mb-1">{r.when}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">{r.seats} seat{r.seats === 1 ? "" : "s"} open</p>
                </div>
              ))}
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="border border-dashed border-primary/60 bg-card p-5 flex items-center justify-center text-center font-mono text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                + Post a ride in Discord
              </a>
            </div>
          </div>
        </section>

        {/* Discord CTA */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <MessageCircle className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="font-display font-black text-3xl lg:text-5xl leading-none mb-6">
              The whole scene lives on Discord.
            </h2>
            <p className="text-silver/80 mb-8">
              Trade gear, find a ride, swap clips, get the day's spot reports first.
            </p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-8 py-4 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" /> Open the invite
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

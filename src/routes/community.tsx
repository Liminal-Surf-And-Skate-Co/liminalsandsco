import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, MessageCircle, Trophy, Upload, Users, Video, Waves, Clock, ExternalLink, CalendarPlus } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useSiteSettings } from "@/lib/site-settings";
import { SPOT_PINS, type SpotPin } from "@/lib/community-data";
import { useEvents, googleCalendarUrl, formatEventDate, EVENT_CATEGORY_LABELS } from "@/lib/events";


type Pin = SpotPin;
const mapPins = SPOT_PINS;

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

// events now loaded from Supabase via useEvents()

const rides = [
  { user: "Maya R.", route: "City → North Point", when: "Sat 5:30am", seats: 2 },
  { user: "Theo K.", route: "Westside → Riverside Bowls", when: "Sun 3pm", seats: 3 },
  { user: "Jules P.", route: "Downtown → Harbour Wall", when: "Weekdays 6am", seats: 1 },
];

export function CommunityPage() {
  const { data: settings } = useSiteSettings();
  const DISCORD_URL = settings?.discord_invite_url || "";
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState<"list" | "grid">("grid");
  const { data: events = [], isLoading: eventsLoading } = useEvents({ upcomingOnly: true });
  const groupedByMonth = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const e of events) {
      const d = new Date(e.start_at);
      const key = d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [events]);

  useEffect(() => {
    if (window.location.hash === "#events") {
      setTimeout(() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, []);
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

        {/* Interactive Spot Map */}
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-display font-black text-3xl lg:text-4xl">Interactive Spot Map</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">Tap a pin · Locals only know</p>
            </div>
            <p className="text-silver/70 mb-6 max-w-2xl text-sm">
              Pinned by the crew — favourite breaks, hidden street spots, and the parks worth the drive. Best tides, smoothest concrete, when to skip it.
            </p>
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 relative border border-border/60 bg-card aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,45 C20,30 40,60 60,40 S90,55 100,42 L100,0 L0,0 Z" fill="oklch(0.7 0.18 290 / 0.08)" stroke="oklch(0.7 0.18 290 / 0.4)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                </svg>
                {mapPins.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePin(p)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    aria-label={p.name}
                  >
                    <span className={`absolute inset-0 -m-2 rounded-full ${p.kind === "Surf" ? "bg-primary/30" : "bg-silver/30"} animate-ping`} />
                    <span className={`relative block h-4 w-4 rounded-full border-2 border-background ${p.kind === "Surf" ? "bg-primary" : "bg-silver"} group-hover:scale-125 transition-transform`} />
                  </button>
                ))}
                {activePin && (
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-background/95 border border-primary p-4 shadow-glow">
                    <div className="flex items-center gap-2 mb-2">
                      {activePin.kind === "Surf" ? <Waves className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
                      <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{activePin.kind}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg mb-1">{activePin.name}</h3>
                    <p className="text-sm text-silver/80">{activePin.tip}</p>
                  </div>
                )}
              </div>
              <div className="lg:col-span-4 space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2">{mapPins.length} pins · Updated by locals</p>
                {mapPins.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePin(p)}
                    className={`w-full text-left border p-3 transition-colors ${activePin?.id === p.id ? "border-primary bg-card" : "border-border/60 bg-card hover:border-primary/60"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {p.kind === "Surf" ? <Waves className="h-3 w-3 text-primary" /> : <MapPin className="h-3 w-3 text-primary" />}
                      <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{p.kind}</span>
                    </div>
                    <p className="font-display font-bold text-sm">{p.name}</p>
                  </button>
                ))}
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block border border-dashed border-primary/60 bg-card p-3 text-center font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  + Pin your spot in Discord
                </a>
              </div>
            </div>
          </div>
        </section>



        {/* Events */}
        <section id="events" className="py-20 border-b border-border/40 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="font-display font-black text-3xl lg:text-4xl">Events Calendar</h2>
              </div>
              <div className="flex gap-1 border border-border/60">
                <button
                  onClick={() => setView("grid")}
                  className={`font-mono text-[10px] uppercase tracking-widest px-3 py-2 ${view === "grid" ? "bg-primary text-primary-foreground" : "text-silver/70 hover:text-primary"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`font-mono text-[10px] uppercase tracking-widest px-3 py-2 ${view === "list" ? "bg-primary text-primary-foreground" : "text-silver/70 hover:text-primary"}`}
                >
                  List
                </button>
              </div>
            </div>

            {eventsLoading ? (
              <p className="font-mono text-xs text-silver/60">Loading events…</p>
            ) : events.length === 0 ? (
              <div className="border border-dashed border-border/60 bg-card p-12 text-center">
                <Calendar className="h-8 w-8 text-silver/40 mx-auto mb-3" />
                <p className="font-mono text-sm text-silver/70 mb-2">No upcoming events yet.</p>
                {DISCORD_URL && (
                  <a href={DISCORD_URL} target="_blank" rel="noreferrer noopener" className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline">
                    Hear about new events on Discord →
                  </a>
                )}
              </div>
            ) : view === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((e) => {
                  const { date, time } = formatEventDate(e.start_at);
                  return (
                    <article key={e.id} className="group border border-border/60 bg-card overflow-hidden flex flex-col">
                      <div className="aspect-[16/10] bg-background overflow-hidden relative">
                        {e.image_url ? (
                          <img src={e.image_url} alt={e.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-purple/30">
                            <Calendar className="h-12 w-12 text-primary/60" />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-widest bg-background/90 text-primary px-2 py-1 border border-primary/40">
                          {EVENT_CATEGORY_LABELS[e.category]}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-display font-bold text-xl mb-2 leading-tight">{e.title}</h3>
                        <div className="space-y-1 font-mono text-xs text-silver/70 mb-3">
                          <p className="flex items-center gap-2"><Clock className="h-3 w-3 text-primary" />{date} · {time}</p>
                          {e.location && <p className="flex items-center gap-2"><MapPin className="h-3 w-3 text-primary" />{e.location}</p>}
                        </div>
                        {e.description && <p className="text-sm text-silver/80 mb-4 line-clamp-3 flex-1">{e.description}</p>}
                        <div className="flex gap-2 mt-auto pt-2">
                          <a
                            href={e.rsvp_url || DISCORD_URL || "#"}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex-1 inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest px-3 py-2 hover:opacity-90"
                          >
                            RSVP <ExternalLink className="h-3 w-3" />
                          </a>
                          <a
                            href={googleCalendarUrl(e)}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center justify-center gap-1 border border-primary text-primary font-mono text-[10px] uppercase tracking-widest px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                            title="Add to Google Calendar"
                          >
                            <CalendarPlus className="h-3 w-3" /> GCal
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-10">
                {groupedByMonth.map(([month, list]) => (
                  <div key={month}>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-3">{month}</h3>
                    <ul className="divide-y divide-border/40 border-y border-border/40">
                      {list.map((e) => {
                        const { date, time } = formatEventDate(e.start_at);
                        return (
                          <li key={e.id} className="grid md:grid-cols-12 gap-4 py-5 items-center px-2">
                            <div className="md:col-span-2 font-mono text-xs uppercase tracking-widest text-silver/80">
                              {date}<br /><span className="text-silver/50">{time}</span>
                            </div>
                            <div className="md:col-span-6">
                              <p className="font-mono text-[9px] uppercase tracking-widest text-primary mb-1">{EVENT_CATEGORY_LABELS[e.category]}</p>
                              <h4 className="font-display font-bold text-lg text-silver mb-1">{e.title}</h4>
                              {e.location && <p className="font-mono text-xs text-silver/60 flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</p>}
                            </div>
                            <div className="md:col-span-4 flex md:justify-end gap-2">
                              <a href={e.rsvp_url || DISCORD_URL || "#"} target="_blank" rel="noreferrer noopener" className="font-mono text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-3 py-2 hover:opacity-90">
                                RSVP
                              </a>
                              <a href={googleCalendarUrl(e)} target="_blank" rel="noreferrer noopener" className="font-mono text-[10px] uppercase tracking-widest border border-primary text-primary px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors inline-flex items-center gap-1">
                                <CalendarPlus className="h-3 w-3" /> GCal
                              </a>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
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

        {/* Video Submission Portal — Clip of the Month */}
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-display font-black text-3xl lg:text-4xl flex items-center gap-3">
                <Trophy className="h-7 w-7 text-primary" /> Clip of the Month
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">Winner takes the pot</p>
            </div>
            <p className="text-silver/70 mb-8 max-w-2xl text-sm">
              Drop your best skate line or surf wave. Community votes. Winner gets a free shop deck, tee, and a brick of wax. New round every month.
            </p>
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                {submitted ? (
                  <div className="border border-primary bg-card p-10 text-center">
                    <Trophy className="h-10 w-10 text-primary mx-auto mb-4" />
                    <p className="font-display text-2xl text-primary mb-2">Clip in the bag.</p>
                    <p className="text-silver/70 font-mono text-sm">We'll review it within 48 hours. Voting opens on the 1st.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                    className="bg-card/60 border border-border p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Video className="h-4 w-4 text-primary" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Submit your clip</span>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">Your name / handle</label>
                      <input required className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">Email</label>
                      <input type="email" required className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">Discipline</label>
                      <select className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary">
                        <option>Skate</option>
                        <option>Surf</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">Clip link (YouTube / Vimeo / IG)</label>
                      <input type="url" required placeholder="https://" className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">Where was it shot?</label>
                      <input className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-gradient-purple text-primary-foreground py-4 font-mono text-xs uppercase tracking-widest shadow-glow hover:translate-y-[-2px] transition-transform">
                      <Upload className="h-4 w-4" /> Submit Clip
                    </button>
                  </form>
                )}
              </div>
              <div className="lg:col-span-5 space-y-4">
                <div className="border border-border/60 bg-card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">The Prize</p>
                  <h3 className="font-display font-bold text-xl mb-2">Free shop deck + tee + wax</h3>
                  <p className="text-sm text-silver/80">Winner picks any in-stock deck or surfboard blank, a Liminal tee, and a brick of wax. Featured on the Daily Swell.</p>
                </div>
                <div className="border border-border/60 bg-card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">How voting works</p>
                  <ul className="space-y-2 text-sm text-silver/80">
                    <li>1. Submit your clip before the 28th.</li>
                    <li>2. Top 6 go live on Discord on the 1st.</li>
                    <li>3. Community votes for 7 days.</li>
                    <li>4. Winner announced + shipped the prize.</li>
                  </ul>
                </div>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block border border-dashed border-primary/60 bg-card p-4 text-center font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Watch this month's entries on Discord
                </a>
              </div>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Play, Search, Mail, ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { posts } from "@/lib/posts";
import { useNewsletters } from "@/lib/newsletters";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Newsletters — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "Dispatches from the workshop, weekly newsletters every Friday, plus field reports and stories from the in-between.",
      },
      { property: "og:title", content: "Blog & Newsletters — Liminal Surf & Skate Co" },
      {
        property: "og:description",
        content: "Articles, weekly Friday newsletters, and clips from the workshop.",
      },
    ],
  }),
  component: BlogIndex,
});

const media = [
  { title: "Daily Swell — Tues 6:14am", kind: "Spot Check", duration: "1:42" },
  { title: "North Point — Dawn Patrol Log", kind: "Surf Vlog", duration: "8:21" },
  { title: "Riverside Bowls Session", kind: "Skate Edit", duration: "3:55" },
  { title: "Workshop B-Roll: Glassing Day", kind: "Photography", duration: "—" },
  { title: "Sunrise Long-Board Cruise", kind: "Surf Vlog", duration: "5:10" },
  { title: "Local Skatepark Tour", kind: "Skate Edit", duration: "6:38" },
];

function BlogIndex() {
  const [q, setQ] = useState("");
  const { data: newsletters } = useNewsletters();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
  }, [q]);

  const filteredMedia = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return media;
    return media.filter(
      (m) => m.title.toLowerCase().includes(term) || m.kind.toLowerCase().includes(term),
    );
  }, [q]);

  const filteredNewsletters = useMemo(() => {
    const list = newsletters ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (n) =>
        n.subject.toLowerCase().includes(term) ||
        (n.excerpt ?? "").toLowerCase().includes(term),
    );
  }, [newsletters, q]);

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="grain">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
            Blog · Dispatches · Weekly Letters
          </p>
          <h1 className="font-display font-black text-5xl lg:text-8xl leading-[0.85] tracking-tighter mb-6">
            FIELD<br />
            <span className="text-stroke">NOTES</span>
          </h1>
          <p className="text-silver/70 text-lg max-w-2xl mb-8">
            Stories from the bench, the break, and the in-between. New weekly letter every Friday.
          </p>

          <div className="relative max-w-xl">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-silver/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles, newsletters, videos…"
              className="w-full pl-11 pr-4 py-3 bg-card border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
            />
          </div>
        </section>

        {/* Weekly Newsletters Archive */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display font-black text-2xl lg:text-3xl flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" /> News & Weekly Letters
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
              Sent every Friday
            </p>
          </div>

          {filteredNewsletters.length === 0 ? (
            <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70">
              {newsletters === undefined ? "Loading…" : q ? `No issues match "${q}".` : "No issues published yet — first letter drops Friday."}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNewsletters.map((n) => {
                const d = new Date(n.scheduled_for ?? n.sent_at);
                const weekday = d.toLocaleDateString("en-AU", { weekday: "short" });
                const dateLabel = d.toLocaleDateString("en-AU", { month: "short", day: "2-digit", year: "numeric" });
                return (
                  <Link
                    key={n.id}
                    to="/blog/$slug"
                    params={{ slug: `newsletter-${n.id}` }}
                    className="group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden"
                  >
                    <div className="aspect-[16/10] bg-background overflow-hidden">
                      {n.cover_image ? (
                        <img src={n.cover_image} alt={n.subject} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-transparent">
                          <Mail className="h-10 w-10 text-silver/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">
                        Newsletter · {weekday} · {dateLabel}
                      </p>
                      <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                        {n.subject}
                      </h3>
                      {n.excerpt && (
                        <p className="text-xs text-silver/60 line-clamp-2 mb-3">{n.excerpt}</p>
                      )}
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-silver/70 group-hover:text-primary">
                        Read issue <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Articles */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="font-display font-black text-2xl lg:text-3xl mb-6">Articles</h2>
          {filtered.length === 0 ? (
            <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70">
              No posts match "{q}".
            </div>
          ) : (
            <ul className="divide-y divide-border/40 border-y border-border/40">
              {filtered.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group grid md:grid-cols-12 gap-6 py-10 items-baseline hover:bg-primary/5 transition-colors px-2"
                  >
                    <div className="md:col-span-2 font-mono text-[10px] uppercase tracking-widest text-silver/50">
                      {new Date(p.date).toLocaleDateString("en-US", {
                        month: "short", day: "2-digit", year: "numeric",
                      })}
                    </div>
                    <div className="md:col-span-8">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                        {p.category}
                      </p>
                      <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-silver group-hover:text-primary transition-colors mb-2">
                        {p.title}
                      </h2>
                      <p className="text-silver/70 max-w-xl">{p.excerpt}</p>
                    </div>
                    <div className="md:col-span-2 font-mono text-[10px] uppercase tracking-widest text-silver/50 md:text-right">
                      {p.readTime} →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Media section */}
        <section className="max-w-5xl mx-auto px-6 pb-32">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display font-black text-2xl lg:text-3xl">Daily Swell · Log · Videos</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
              Edits & spot checks
            </p>
          </div>
          {filteredMedia.length === 0 ? (
            <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70">
              No clips match "{q}".
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMedia.map((m) => (
                <div key={m.title} className="bg-card border border-border/60 overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-video bg-background flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    <Play className="h-10 w-10 text-silver/70 group-hover:text-primary transition-colors relative" />
                    <span className="absolute bottom-2 right-2 font-mono text-[10px] text-silver bg-background/80 px-2 py-0.5">
                      {m.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">{m.kind}</p>
                    <h3 className="font-display font-bold text-base">{m.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

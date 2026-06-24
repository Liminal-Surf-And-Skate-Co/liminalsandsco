import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Package, FileText, Mail, Calendar, Search as SearchIcon, MapPin, ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { GlobalSearch } from "@/components/site/GlobalSearch";
import { useGlobalSearch, highlightText } from "@/lib/search";
import { productImage, effectivePrice, DEPARTMENT_LABELS } from "@/lib/products";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: ({ match }) => {
    const q = (match.search as { q?: string }).q ?? "";
    const title = q ? `Search: ${q} — Liminal` : "Search — Liminal";
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Search products, articles, weekly letters and community events at Liminal Surf & Skate Co.",
        },
      ],
    };
  },
  component: SearchPage,
});

function safeHtml(html: string) {
  return { __html: html };
}

function SearchPage() {
  const { q } = Route.useSearch();
  const res = useGlobalSearch(q, 50);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="border-b border-border/40 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Search</p>
            <h1 className="font-display font-black text-4xl lg:text-6xl leading-none mb-6">
              {q ? (
                <>
                  Results for
                  <br />
                  <span className="text-stroke">“{q}”</span>
                </>
              ) : (
                "Search Liminal"
              )}
            </h1>
            <div className="max-w-xl">
              <GlobalSearch />
            </div>
            {q && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-silver/60">
                {res.loading && res.total === 0
                  ? "Searching…"
                  : `${res.total} result${res.total === 1 ? "" : "s"} across the site`}
              </p>
            )}
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-12 space-y-14">
          {!q && (
            <div className="border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70 flex flex-col items-center gap-3">
              <SearchIcon className="h-8 w-8 text-primary" />
              Type above to search products, articles, newsletters and events.
            </div>
          )}

          {q && res.total === 0 && !res.loading && (
            <div className="border border-border/60 bg-card p-12 text-center">
              <SearchIcon className="h-8 w-8 text-silver/40 mx-auto mb-4" />
              <p className="font-mono text-sm text-silver/70 mb-1">
                Nothing matched <span className="text-primary">“{q}”</span>
              </p>
              <p className="text-xs text-silver/50 mb-6">Try a different keyword or browse these categories.</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link to="/shop" className="px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">
                  Shop All
                </Link>
                <Link to="/shop" search={{ dept: "skate" }} className="px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">
                  Skate
                </Link>
                <Link to="/shop" search={{ dept: "surf" }} className="px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">
                  Surf
                </Link>
                <Link to="/shop" search={{ dept: "clothing" }} className="px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">
                  Clothing
                </Link>
                <Link to="/shop" search={{ dept: "accessories" }} className="px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">
                  Accessories
                </Link>
                <Link to="/blog" className="px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link to="/community" className="px-4 py-2 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">
                  Community
                </Link>
              </div>
            </div>
          )}

          {res.products.length > 0 && (
            <Group
              title="Products Found"
              icon={<Package className="h-5 w-5 text-primary" />}
              count={res.products.length}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {res.products.map((p) => (
                  <Link
                    key={p.id}
                    to="/shop/$slug"
                    params={{ slug: p.slug }}
                    className="group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden bg-background">
                      <img
                        src={productImage(p)}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">
                          {DEPARTMENT_LABELS[p.department]}
                        </p>
                        <h3 className="font-display font-bold text-base" dangerouslySetInnerHTML={safeHtml(highlightText(p.title, q))} />
                        {q && matchDescription(p.description, q) && (
                          <p className="text-xs text-silver/60 mt-1 line-clamp-2" dangerouslySetInnerHTML={safeHtml(highlightText(p.description, q))} />
                        )}
                      </div>
                      <span className="text-silver text-sm font-mono">${effectivePrice(p)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Group>
          )}

          {res.posts.length > 0 && (
            <Group
              title="Articles Found"
              icon={<FileText className="h-5 w-5 text-primary" />}
              count={res.posts.length}
            >
              <ul className="divide-y divide-border/40 border-y border-border/40">
                {res.posts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="grid md:grid-cols-12 gap-4 py-6 hover:bg-primary/5 px-2 group"
                    >
                      <div className="md:col-span-2 font-mono text-[10px] uppercase tracking-widest text-silver/50">
                        {new Date(p.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                      <div className="md:col-span-10">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">
                          {p.category}
                        </p>
                        <h3 className="font-display font-bold text-2xl text-silver group-hover:text-primary transition-colors" dangerouslySetInnerHTML={safeHtml(highlightText(p.title, q))} />
                        <p className="text-silver/70 text-sm mt-1" dangerouslySetInnerHTML={safeHtml(highlightText(p.excerpt, q))} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Group>
          )}

          {res.newsletters.length > 0 && (
            <Group
              title="Weekly Letters Found"
              icon={<Mail className="h-5 w-5 text-primary" />}
              count={res.newsletters.length}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {res.newsletters.map((n) => (
                  <Link
                    key={n.id}
                    to="/blog/$slug"
                    params={{ slug: `newsletter-${n.id}` }}
                    className="group block bg-card border border-border/60 hover:border-primary p-4"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                      Newsletter ·{" "}
                      {new Date(n.scheduled_for ?? n.sent_at).toLocaleDateString("en-AU", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary mb-2" dangerouslySetInnerHTML={safeHtml(highlightText(n.subject, q))} />
                    {n.excerpt && (
                      <p className="text-xs text-silver/60 line-clamp-3" dangerouslySetInnerHTML={safeHtml(highlightText(n.excerpt, q))} />
                    )}
                  </Link>
                ))}
              </div>
            </Group>
          )}

          {res.events.length > 0 && (
            <Group
              title="Events Found"
              icon={<Calendar className="h-5 w-5 text-primary" />}
              count={res.events.length}
            >
              <ul className="divide-y divide-border/40 border-y border-border/40">
                {res.events.map((e) => (
                  <li key={e.id} className="grid md:grid-cols-12 gap-4 py-6 px-2">
                    <div className="md:col-span-2 font-mono text-xs uppercase tracking-widest text-silver/60">
                      {e.date}
                    </div>
                    <div className="md:col-span-7">
                      <h3 className="font-display font-bold text-xl text-silver mb-1" dangerouslySetInnerHTML={safeHtml(highlightText(e.title, q))} />
                      <p className="text-silver/70 text-sm" dangerouslySetInnerHTML={safeHtml(highlightText(e.detail, q))} />
                    </div>
                    <div className="md:col-span-3 md:text-right">
                      <Link
                        to="/community"
                        hash="events"
                        className="font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70"
                      >
                        View in Community →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </Group>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function matchDescription(text: string, term: string): boolean {
  return text.toLowerCase().includes(term.toLowerCase());
}

function Group({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-display font-black text-2xl lg:text-3xl flex items-center gap-3">
          {icon} {title}
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
          {count} found
        </span>
      </div>
      {children}
    </section>
  );
}

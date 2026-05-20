import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { posts } from "@/lib/posts";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "Dispatches from the workshop: shaping notes, field reports, and stories from the in-between.",
      },
      { property: "og:title", content: "Journal — Liminal Surf & Skate Co" },
      {
        property: "og:description",
        content: "Dispatches from the workshop. Oh yeah, not bad.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="grain">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
            Journal · Dispatches
          </p>
          <h1 className="font-display font-black text-5xl lg:text-8xl leading-[0.85] tracking-tighter mb-6">
            FIELD<br />
            <span className="text-stroke">NOTES</span>
          </h1>
          <p className="text-silver/70 text-lg max-w-2xl">
            Stories from the bench, the break, and the in-between.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-32">
          <ul className="divide-y divide-border/40 border-y border-border/40">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group grid md:grid-cols-12 gap-6 py-10 items-baseline hover:bg-primary/5 transition-colors px-2"
                >
                  <div className="md:col-span-2 font-mono text-[10px] uppercase tracking-widest text-silver/50">
                    {new Date(p.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
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
        </section>
      </main>
      <Footer />
    </div>
  );
}

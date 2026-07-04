// @ts-nocheck — DB types generated; some referenced tables/columns pending migrations.
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, ExternalLink } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getPost, posts } from "@/lib/posts";
import { sanitizeError } from "@/lib/error-sanitize";
import { supabase } from "@/integrations/supabase/client";
import type { Newsletter, NewsletterLink } from "@/lib/newsletters";

const NL_PREFIX = "newsletter-";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — Liminal Journal` }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-5xl mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary font-mono text-xs uppercase tracking-widest">
          ← Back to journal
        </Link>
      </main>
      <Footer />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-silver/70 mb-4">{sanitizeError(error)}</p>
        <button
          onClick={reset}
          className="text-primary font-mono text-xs uppercase tracking-widest"
        >
          Retry
        </button>
      </div>
    </div>
  ),
  component: SlugPage,
});

function SlugPage() {
  const { slug } = Route.useParams();
  if (slug.startsWith(NL_PREFIX)) {
    return <NewsletterPage id={slug.slice(NL_PREFIX.length)} />;
  }
  const post = getPost(slug);
  if (!post) throw notFound();
  return <PostPage post={post} />;
}

function PostPage({ post }: { post: ReturnType<typeof getPost> & {} }) {
  const others = posts.filter((p) => p.slug !== post!.slug).slice(0, 2);
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="grain">
        <article className="max-w-3xl mx-auto px-6 pt-24 pb-24">
          <Link
            to="/blog"
            className="font-mono text-[10px] uppercase tracking-widest text-primary mb-10 inline-block"
          >
            ← Journal
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
            {post!.category} ·{" "}
            {new Date(post!.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {post!.readTime}
          </p>
          <h1 className="font-display font-black text-4xl md:text-6xl leading-[0.9] tracking-tighter mb-8">
            {post!.title}
          </h1>
          <p className="text-xl text-silver/80 mb-12 leading-relaxed border-l-2 border-primary pl-5">
            {post!.excerpt}
          </p>
          <div className="space-y-6 text-silver/80 text-lg leading-relaxed">
            {post!.body.map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
        {others.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 pb-32 border-t border-border/40 pt-16">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-8">
              Keep reading
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group block border border-border/40 p-6 hover:border-primary transition-colors"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">
                    {p.category}
                  </p>
                  <h3 className="font-display font-bold text-2xl text-silver group-hover:text-primary transition-colors mb-2">
                    {p.title}
                  </h3>
                  <p className="text-silver/60 text-sm">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function NewsletterPage({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["newsletter", id],
    queryFn: async (): Promise<Newsletter | null> => {
      const { data, error } = await supabase
        .from("newsletters")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Record<string, unknown> | null;
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="py-32 text-center font-mono text-xs text-silver/60">Loading issue…</main>
      </div>
    );
  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="max-w-3xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-5xl mb-4">Issue not found</h1>
          <Link to="/blog" className="text-primary font-mono text-xs uppercase tracking-widest">
            ← Back to newsletters
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const d = new Date(data.scheduled_for ?? data.sent_at);
  const links = Array.isArray((data as Record<string, unknown>).links)
    ? ((data as Record<string, unknown>).links as NewsletterLink[])
    : [];
  const paragraphs = (data.body ?? "").split(/\n\s*\n/);
  const isImage = (s: string) =>
    /^https?:\/\/\S+\.(png|jpe?g|gif|webp|avif)(\?\S*)?$/i.test(s.trim());

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="grain">
        <article className="max-w-3xl mx-auto px-6 pt-24 pb-24">
          <Link
            to="/blog"
            className="font-mono text-[10px] uppercase tracking-widest text-primary mb-10 inline-block"
          >
            ← Journal
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 inline-flex items-center gap-2">
            <Mail className="h-3 w-3" /> Weekly Letter ·{" "}
            {d.toLocaleDateString("en-AU", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="font-display font-black text-4xl md:text-6xl leading-[0.9] tracking-tighter mb-8">
            {data.subject}
          </h1>
          {data.cover_image && (
            <img
              src={data.cover_image}
              alt={data.subject}
              className="w-full mb-10 border border-border/40"
            />
          )}
          {data.excerpt && (
            <p className="text-xl text-silver/80 mb-12 leading-relaxed border-l-2 border-primary pl-5">
              {data.excerpt}
            </p>
          )}
          <div className="space-y-6 text-silver/80 text-lg leading-relaxed">
            {paragraphs.map((para, i) => {
              const trimmed = para.trim();
              if (!trimmed) return null;
              if (isImage(trimmed)) {
                return (
                  <img key={i} src={trimmed} alt="" className="w-full border border-border/40" />
                );
              }
              return (
                <p key={i} className="whitespace-pre-wrap">
                  {trimmed}
                </p>
              );
            })}
          </div>
          {links.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/40">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">
                Links
              </p>
              <ul className="space-y-2">
                {links.map((l, i) => (
                  <li key={i}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-silver hover:text-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> {l.label || l.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}

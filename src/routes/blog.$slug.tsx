import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getPost, posts } from "@/lib/posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Liminal Journal` },
          { name: "description", content: loaderData.post.excerpt },
          {
            property: "og:title",
            content: `${loaderData.post.title} — Liminal Journal`,
          },
          { property: "og:description", content: loaderData.post.excerpt },
        ]
      : [{ title: "Liminal Journal" }],
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
        <p className="text-silver/70 mb-4">{error.message}</p>
        <button onClick={reset} className="text-primary font-mono text-xs uppercase tracking-widest">
          Retry
        </button>
      </div>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

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
            {post.category} ·{" "}
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {post.readTime}
          </p>
          <h1 className="font-display font-black text-4xl md:text-6xl leading-[0.9] tracking-tighter mb-8">
            {post.title}
          </h1>
          <p className="text-xl text-silver/80 mb-12 leading-relaxed border-l-2 border-primary pl-5">
            {post.excerpt}
          </p>
          <div className="space-y-6 text-silver/80 text-lg leading-relaxed">
            {post.body.map((para: string, i: number) => (
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

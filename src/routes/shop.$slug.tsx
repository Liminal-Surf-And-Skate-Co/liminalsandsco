import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getProductBySlug } from "@/lib/products";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.title} — Liminal Surf & Skate Co` : "Product — Liminal";
    const description = p?.description ?? "Hand-made surf, skate, and craft from Liminal.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(p ? [{ property: "og:image", content: p.img } as const] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display font-black text-4xl mb-4">Piece not found</h1>
        <Link to="/shop" className="font-mono text-xs uppercase tracking-widest text-primary">
          ← Back to the shop
        </Link>
      </main>
      <Footer />
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen bg-background text-foreground p-12 text-center">
      <p className="font-mono text-sm mb-4">Something broke loading this piece.</p>
      <button onClick={reset} className="font-mono text-xs uppercase tracking-widest text-primary">Retry</button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<"inquiry" | "custom">("inquiry");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/70 hover:text-primary mb-10"
        >
          <ArrowLeft className="h-3 w-3" /> Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-card border border-border/60">
            <div className="aspect-square overflow-hidden">
              <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-1 p-1">
              {[product.img, product.img, product.img].map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden bg-background">
                  <img src={src} alt="" className="w-full h-full object-cover opacity-70" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
              {product.category} · {product.tag}
            </p>
            <h1 className="font-display font-black text-4xl lg:text-5xl leading-none mb-4">
              {product.title}
            </h1>
            <p className="font-mono text-2xl text-silver mb-8">${product.price}</p>

            <p className="text-silver/90 leading-relaxed mb-8">{product.description}</p>

            <ul className="border-y border-border/60 divide-y divide-border/60 mb-10">
              {product.details.map((d: string) => (
                <li key={d} className="py-3 font-mono text-xs uppercase tracking-widest text-silver/80">
                  — {d}
                </li>
              ))}
            </ul>

            <div className="border border-border/60 bg-card p-6">
              <div className="flex gap-2 mb-5">
                {([
                  ["inquiry", "Inquire"],
                  ["custom", "Custom order"],
                ] as const).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setMode(k)}
                    className={`flex-1 font-mono text-[10px] uppercase tracking-widest px-3 py-2 border transition-colors ${
                      mode === k
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 text-silver hover:border-primary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {sent ? (
                <p className="font-mono text-xs uppercase tracking-widest text-primary py-6 text-center">
                  Thanks — we'll be in touch within 48 hours.
                </p>
              ) : (
                <form onSubmit={submit} className="space-y-3">
                  <input
                    required
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                  />
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder={
                      mode === "custom"
                        ? "Tell us about the custom build — dimensions, colours, timeline…"
                        : "Questions about this piece? Stock, sizing, shipping…"
                    }
                    className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity"
                  >
                    {mode === "custom" ? "Send custom request" : "Send inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

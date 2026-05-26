import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle, Mail, Clock, Search, Truck, Waves, Ruler } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const DISCORD_URL = "https://discord.gg/your-invite-here";
const SUPPORT_EMAIL = "support@liminal.co";

type Faq = { q: string; a: string; group: "Orders" | "Surf" | "Skate" };

const faqs: Faq[] = [
  { group: "Orders", q: "How long does shipping take for oversized items like surfboards?", a: "Surfboards ship via freight and typically take 7–14 business days domestic, 3–5 weeks international. We email tracking and freight contact details the day it leaves the bench." },
  { group: "Orders", q: "Do you offer international shipping or local shop / curbside pickup?", a: "Yes — we ship worldwide. Locals can choose Workshop Pickup at checkout (free) and grab orders from the shop Wed–Sat, 11am–5pm." },
  { group: "Orders", q: "How do I change or cancel my order after it's been placed?", a: "Email support within 12 hours of ordering and we'll do our best. Once a custom build is started or grip tape is applied, changes aren't possible." },
  { group: "Surf", q: "How do I choose the right wetsuit thickness for my water temperature?", a: "Rough guide: 22°C+ springsuit, 18–22°C 2/2mm, 14–18°C 3/2mm, 10–14°C 4/3mm with boots, sub-10°C 5/4mm + boots, gloves and hood." },
  { group: "Surf", q: "What's your warranty policy on surfboards and snapped fins?", a: "Manufacturer defects (delam, dry spots, broken stringers from glassing) covered 90 days. Snapped fins from impact aren't covered, but we'll always quote a repair." },
  { group: "Surf", q: "How should I rinse and store my wetsuit so it lasts?", a: "Fresh-water rinse inside and out after every session, hang folded at the waist on a wide hanger out of direct sun. Never tumble dry or leave it wet in the boot." },
  { group: "Skate", q: "Do completes come fully assembled, or do I need tools?", a: "Completes ship fully built, gripped, and ready to roll. We include a skate tool with every complete in case you want to swap hardware later." },
  { group: "Skate", q: "What size skateboard deck fits my shoe size or riding style?", a: "Street/tech under 8.25\", all-rounder 8.25–8.5\", transition/cruising 8.5–9.0\". Bigger feet (US 11+) generally want 8.5\" or wider for stability." },
  { group: "Skate", q: "What's your return policy on gripped or skated decks?", a: "Decks can be returned within 14 days only if the grip tape has NOT been applied and the deck is unridden. Once gripped or skated, all sales are final — industry-wide rule." },
];

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Liminal Surf & Skate Co" },
      { name: "description", content: "Help center: size charts, shipping info, returns, wetsuit care, skate gear FAQs, and how to reach us." },
      { property: "og:title", content: "Support — Liminal Surf & Skate Co" },
      { property: "og:description", content: "FAQs, contact, and policies for Liminal customers." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.group.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const out: Record<Faq["group"], Faq[]> = { Orders: [], Surf: [], Skate: [] };
    filtered.forEach((f) => out[f.group].push(f));
    return out;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="border-b border-border/40 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Help Center</p>
            <h1 className="font-display font-black text-5xl lg:text-7xl leading-none mb-6">
              How can we<br /><span className="text-stroke">help?</span>
            </h1>
            <p className="text-silver/80 text-lg mb-8">
              Search size charts, shipping, returns, wetsuit care, skate gear — or hit us up directly.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="h-5 w-5 text-silver/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "wetsuit return" or "truck size"…'
                className="w-full bg-input/60 border border-border pl-12 pr-4 py-4 font-mono text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        <section className="py-16 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-5">
            {[
              { icon: <Ruler className="h-5 w-5 text-primary" />, title: "Size Charts", body: "Deck widths, wetsuit thickness, apparel fit guides." },
              { icon: <Truck className="h-5 w-5 text-primary" />, title: "Shipping Info", body: "Rates, transit times, freight on oversized boards." },
              { icon: <Waves className="h-5 w-5 text-primary" />, title: "Returns & Care", body: "Return windows, wetsuit care, warranty terms." },
            ].map((c) => (
              <div key={c.title} className="border border-border/60 bg-card p-6">
                <div className="mb-3">{c.icon}</div>
                <h3 className="font-display font-bold text-xl mb-2">{c.title}</h3>
                <p className="text-silver/80 text-sm">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 border-b border-border/40">
          <div className="max-w-4xl mx-auto px-6 space-y-14">
            {(["Orders", "Surf", "Skate"] as const).map((g) => {
              const items = grouped[g];
              if (!items.length) return null;
              const label = g === "Orders" ? "📦 Orders & Shipping" : g === "Surf" ? "🏄‍♂️ Surf & Wetsuit Care" : "🛹 Skate Gear & Assembly";
              return (
                <div key={g}>
                  <h2 className="font-display font-black text-3xl lg:text-4xl mb-6">{label}</h2>
                  <ul className="divide-y divide-border/40 border-y border-border/40">
                    {items.map((f) => (
                      <li key={f.q} className="py-5">
                        <details className="group">
                          <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                            <span className="font-display font-bold text-lg text-silver">{f.q}</span>
                            <span className="font-mono text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                          </summary>
                          <p className="mt-3 text-silver/80 leading-relaxed">{f.a}</p>
                        </details>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-silver/60 font-mono text-sm">No results. Try a different keyword, or reach out below.</p>
            )}
          </div>
        </section>

        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Reach Us</p>
              <h2 className="font-display font-black text-4xl lg:text-5xl leading-none mb-6">Still stuck? Hit us up.</h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-display font-bold text-lg">Email</p>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-silver/80 hover:text-primary">{SUPPORT_EMAIL}</a>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-1">We usually reply within 24 hours</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <MessageCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-display font-bold text-lg">Discord — Live Support</p>
                    <a href={DISCORD_URL} target="_blank" rel="noreferrer noopener" className="text-silver/80 hover:text-primary">Open the #support channel</a>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-1">Crew online most evenings</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-display font-bold text-lg">Shop Hours</p>
                    <p className="text-silver/80">Wed – Sat · 11am – 5pm</p>
                    <p className="text-silver/80">Sun · 10am – 2pm</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mt-1">Closed Mon & Tue</p>
                  </div>
                </li>
              </ul>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); alert("Thanks — we'll get back to you within 24 hours."); }}
              className="bg-card/60 border border-border p-8 space-y-4"
            >
              <h3 className="font-display font-bold text-2xl mb-2">Send a message</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-4">We usually reply within 24 hours</p>
              <Field label="Name" name="name" />
              <Field label="Email" name="email" type="email" />
              <Field label="Order # (optional)" name="order" required={false} />
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">Message</label>
                <textarea rows={5} required className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
              <button type="submit" className="w-full bg-gradient-purple text-primary-foreground py-4 font-mono text-xs uppercase tracking-widest shadow-glow hover:translate-y-[-2px] transition-transform">
                Send Message
              </button>
            </form>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <Policy id="privacy" title="Privacy Policy"
              body="We collect only what we need to fulfil your order (name, email, shipping address, payment info handled by our processor). We never sell or share your data. Cookies are used for cart persistence and basic analytics — you can opt out in your browser." />
            <Policy id="terms" title="Terms of Service"
              body="By using this site or buying from us, you agree to our terms: products are described as accurately as possible, custom items are non-refundable once started, and prices are subject to change. Disputes are governed by the laws of our home jurisdiction." />
            <Policy id="refund" title="Refund Policy"
              body="Unused, unridden, and ungripped items: 14-day refund or exchange. Custom builds, gripped decks, glassed surfboards, worn apparel, and pierced jewellery are final sale. Defects covered by 90-day warranty — email photos for a quick resolution." />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = "text", required = true }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">{label}</label>
      <input name={name} type={type} required={required} className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary" />
    </div>
  );
}

function Policy({ id, title, body }: { id: string; title: string; body: string }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="font-display font-black text-3xl lg:text-4xl mb-4">{title}</h2>
      <p className="text-silver/80 leading-relaxed">{body}</p>
    </div>
  );
}

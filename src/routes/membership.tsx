import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Waves,
  Crown,
  Gem,
  Sparkles,
  ChevronRight,
  Check,
  Hash,
  Handshake,
  Compass,
} from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

type Tier = {
  id: string;
  name: string;
  price: string;
  color: string;
  icon: React.ReactNode;
  perks: string[];
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    id: "salt",
    name: "Salt",
    price: "Free",
    color: "border-silver/40",
    icon: <Compass className="h-6 w-6 text-silver" />,
    perks: [
      "Early access to weekly drops",
      "Digital sticker pack on sign-up",
      "Monthly newsletter with surf reports",
      "5% off your first custom order",
    ],
  },
  {
    id: "wave",
    name: "Wave",
    price: "$9 / mo",
    color: "border-primary/80",
    icon: <Waves className="h-6 w-6 text-primary" />,
    featured: true,
    perks: [
      "Everything in Salt tier",
      "10% off all custom orders — always",
      "Free grip-tape upgrades on completes",
      "Exclusive Wave-only colourways",
      "Priority workshop queue (skip 2 weeks)",
      "Access to member-only Slack channel",
    ],
  },
  {
    id: "barrel",
    name: "Barrel",
    price: "$19 / mo",
    color: "border-purple-glow/80",
    icon: <Crown className="h-6 w-6" style={{ color: "var(--purple-glow)" }} />,
    perks: [
      "Everything in Wave tier",
      "Free global shipping on orders $100+",
      "Quarterly limited-edition drop shipped to you",
      "One free custom re-glass per year",
      "VIP workshop priority (skip 4 weeks)",
      "Vote on community deck & apparel designs",
      "Named on the Barrel wall in the shop",
    ],
  },
];

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Join the Crew — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "Become part of the Liminal family. Free and paid membership tiers with exclusive perks, discounts, early access, and more.",
      },
      { property: "og:title", content: "Join the Crew — Liminal Surf & Skate Co" },
      {
        property: "og:description",
        content: "Membership tiers, perks, early access, and community.",
      },
    ],
  }),
  component: MembershipPage,
});

function MembershipPage() {
  const [selected, setSelected] = useState<string>("wave");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        {/* Hero */}
        <section className="border-b border-border/40 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Join the Crew
            </p>
            <h1 className="font-display font-black text-5xl lg:text-7xl leading-none mb-6">
              Ride with us.
              <br />
              <span className="text-stroke">For real.</span>
            </h1>
            <p className="text-silver/80 text-lg max-w-2xl mx-auto mb-8">
              Membership means discounts, early drops, custom builds, and a crew that has your back
              in the lineup and the bowl.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Stat icon={<Hash className="h-4 w-4" />} label="Active Members" value="1,200+" />
              <Stat
                icon={<Handshake className="h-4 w-4" />}
                label="Custom Builds Shipped"
                value="4,500+"
              />
              <Stat icon={<Gem className="h-4 w-4" />} label="Community Events / yr" value="24" />
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-display font-black text-4xl lg:text-5xl leading-none mb-4">
                Choose your tier
              </h2>
              <p className="text-silver/80 font-mono text-sm">
                Free to join. Cancel anytime. No lock-in — ever.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {tiers.map((tier) => {
                const isActive = selected === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelected(tier.id)}
                    className={`relative text-left p-8 border-2 ${tier.color} bg-card transition-all duration-300 group ${
                      isActive
                        ? "ring-2 ring-primary/60 scale-[1.02] shadow-lg shadow-primary/10"
                        : "hover:border-primary/30"
                    } ${tier.featured ? "md:-mt-4 md:mb-4" : ""}`}
                  >
                    {tier.featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}

                    <div className="mb-4">{tier.icon}</div>
                    <h3 className="font-display font-black text-2xl mb-1">{tier.name}</h3>
                    <p className="font-mono text-2xl font-bold text-primary mb-6">{tier.price}</p>

                    <ul className="space-y-3 mb-6">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-sm text-silver/80">
                          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest px-4 py-2.5 border transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-primary group-hover:bg-primary/10"
                      }`}
                    >
                      Join {tier.name} <ChevronRight className="h-3 w-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Perks grid */}
        <section className="py-20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-display font-black text-4xl lg:text-5xl leading-none mb-4">
                Why join?
              </h2>
              <p className="text-silver/80 font-mono text-sm">
                More than just discounts — it's how we build better gear together.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Sparkles className="h-6 w-6 text-primary" />,
                  title: "Early Access",
                  body: "Every drop, every colourway, every collab — you see it first.",
                },
                {
                  icon: <Hash className="h-6 w-6 text-primary" />,
                  title: "Member Discounts",
                  body: "Permanent 10–15% off custom builds depending on your tier.",
                },
                {
                  icon: <Handshake className="h-6 w-6 text-primary" />,
                  title: "Community Voting",
                  body: "Vote on the next deck shape, apparel design, or collab direction.",
                },
                {
                  icon: <Waves className="h-6 w-6 text-primary" />,
                  title: "Priority Queue",
                  body: "Barrel members skip 4+ weeks off custom-build lead times.",
                },
                {
                  icon: <Crown className="h-6 w-6 text-primary" />,
                  title: "VIP Drops",
                  body: "Quarterly member-only gear shipped direct — limited runs only.",
                },
                {
                  icon: <Gem className="h-6 w-6 text-primary" />,
                  title: "Free Re-glass",
                  body: "One free re-glassing per year on surfboards for Barrel tier.",
                },
                {
                  icon: <Compass className="h-6 w-6 text-primary" />,
                  title: "Surf Reports",
                  body: "Monthly break conditions & swell forecasts for your region.",
                },
                {
                  icon: <Handshake className="h-6 w-6 text-primary" />,
                  title: "Slack Community",
                  body: "Hang with the crew, share clips, and get gear advice directly.",
                },
              ].map((perk) => (
                <div
                  key={perk.title}
                  className="border border-border/60 bg-card p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="mb-4">{perk.icon}</div>
                  <h3 className="font-display font-bold text-lg mb-2">{perk.title}</h3>
                  <p className="text-silver/80 text-sm leading-relaxed">{perk.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-display font-black text-4xl lg:text-5xl leading-none mb-6">
              Ready to <span className="text-stroke">join the crew?</span>
            </h2>
            <p className="text-silver/80 text-lg mb-8">
              Pick your tier above, sign in or create an account, and start riding with the best
              crew on the coast.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById("tiers");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-gradient-purple text-primary-foreground py-4 px-10 font-mono text-xs uppercase tracking-widest shadow-glow hover:translate-y-[-2px] transition-transform"
            >
              Sign Up Free <Sparkles className="h-3 w-3 inline ml-1" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-silver/60 font-mono text-xs tracking-widest uppercase">
      {icon}
      <span>
        <strong className="text-foreground font-display text-lg">{value}</strong> {label}
      </span>
    </div>
  );
}

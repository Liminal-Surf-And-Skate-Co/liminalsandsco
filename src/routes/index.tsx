import { Link } from "@tanstack/react-router";
import { Sparkles, Zap, Waves } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Venice Beach · Est. 2024
            </p>
            <h1 className="font-display font-black text-5xl lg:text-7xl leading-none mb-6">
              RIDE THE<br />
              <span className="text-accent">IN-BETWEEN</span>
            </h1>
            <p className="text-silver/70 max-w-xl mx-auto text-sm mb-8">
              Custom skate decks, surfboards, and apparel — designed by you, built by us.
              Launch the Design Studio and make something nobody else has.
            </p>
            <Link
              to="/design-studio"
              className="inline-flex items-center gap-2 bg-accent text-white font-mono text-xs uppercase tracking-widest px-8 py-4 hover:opacity-90 transition-opacity"
            >
              <Sparkles className="h-4 w-4" /> Open Design Studio
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-accent" />}
            title="Design Studio"
            description="Build custom decks, surfboards, tees & hoodies with live preview and real-time pricing."
            link="/design-studio"
            linkLabel="Start designing"
          />
          <FeatureCard
            icon={<Waves className="h-6 w-6 text-accent" />}
            title="Your Garage"
            description="Save your custom builds to your profile and revisit them anytime."
            link="/account/garage"
            linkLabel="View garage"
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-accent" />}
            title="Admin Dashboard"
            description="Your team can review all custom order submissions with full design details."
            link="/admin/custom-orders"
            linkLabel="View orders"
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({
  icon, title, description, link, linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}) {
  return (
    <div className="border border-border/60 bg-card p-6 hover:border-accent transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-silver/60 mb-4">{description}</p>
      <Link
        to={link}
        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

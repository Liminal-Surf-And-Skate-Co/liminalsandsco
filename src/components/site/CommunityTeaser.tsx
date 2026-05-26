import { Link } from "@tanstack/react-router";
import { MessageCircle, Play } from "lucide-react";
import surfboard from "@/assets/craft-surfboard.jpg";

const DISCORD_URL = "https://discord.gg/your-invite-here";

export function CommunityTeaser() {
  return (
    <section className="relative py-24 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 relative group">
          <img src={surfboard} alt="Daily Swell — latest spot check clip" loading="lazy" className="w-full h-auto shadow-card" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 ml-1" fill="currentColor" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest bg-background/80 px-3 py-1">Daily Swell · North Point</span>
            <span className="font-mono text-[10px] uppercase tracking-widest bg-background/80 px-3 py-1">02:14</span>
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">The Hub</p>
          <h2 className="font-display font-black text-4xl lg:text-6xl leading-none mb-5">
            Join the<br />daily session.
          </h2>
          <p className="text-silver/80 mb-8">
            Spot reports, clips, ride-shares, gear swaps. The whole scene checks in on Discord every dawn — pull up.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-6 py-4 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" /> Join our Discord
            </a>
            <Link
              to="/community"
              className="inline-flex items-center justify-center border border-silver/30 text-silver font-mono text-xs uppercase tracking-widest px-6 py-4 hover:border-primary hover:text-primary transition-colors"
            >
              Visit the Community →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import logo from "@/assets/liminal-logo.png";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Liminal Surf & Skate Co" className="h-10 w-auto" />
          <span className="font-display font-bold text-sm tracking-widest hidden sm:inline text-silver">
            LIMINAL
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-mono uppercase tracking-widest text-silver/80">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#craft" className="hover:text-primary transition-colors">Craft</a>
          <a href="#shop" className="hover:text-primary transition-colors">Shop</a>
          <a href="#custom" className="hover:text-primary transition-colors">Custom</a>
          <Link to="/blog" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Journal</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to="/about"
            className="hidden sm:inline text-xs font-mono uppercase tracking-widest px-4 py-2 border border-silver/60 bg-background text-silver hover:bg-silver hover:text-background transition-colors"
            activeProps={{ className: "bg-silver text-background" }}
          >
            About Us
          </Link>
          <Link
            to="/blog"
            className="hidden sm:inline text-xs font-mono uppercase tracking-widest px-4 py-2 border border-silver/60 text-silver hover:bg-silver hover:text-background transition-colors"
            activeProps={{ className: "bg-silver text-background" }}
          >
            Blog
          </Link>
          <a
            href="/#custom"
            className="text-xs font-mono uppercase tracking-widest px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Order Custom
          </a>
        </div>
      </div>
    </header>
  );
}

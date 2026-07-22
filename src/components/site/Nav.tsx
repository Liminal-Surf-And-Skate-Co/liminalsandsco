import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="border-b border-border/40 bg-card/80 backdrop-blur-sm sticky top-0 z-30">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display font-black text-lg text-foreground">LIMINAL</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/60 hidden sm:inline">
            Surf & Skate Co
          </span>
        </Link>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest">
          <Link to="/" className="text-silver hover:text-primary transition-colors">Home</Link>
          <Link to="/design-studio" className="text-silver hover:text-primary transition-colors">Studio</Link>
          <Link to="/account/garage" className="text-silver hover:text-primary transition-colors">Garage</Link>
          <Link to="/admin/custom-orders" className="text-silver hover:text-primary transition-colors">Admin</Link>
        </div>
      </nav>
    </header>
  );
}

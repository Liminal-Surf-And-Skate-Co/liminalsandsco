export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display font-black text-sm text-foreground">LIMINAL SURF & SKATE CO</p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-silver/50 mt-1">
            Custom builds, made by riders — for riders
          </p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-silver/40">
          © {new Date().getFullYear()} Liminal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

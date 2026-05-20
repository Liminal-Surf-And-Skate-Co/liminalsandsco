import logo from "@/assets/liminal-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <img src={logo} alt="Liminal" className="h-16 w-auto mb-4" />
          <p className="text-silver/60 text-sm max-w-xs leading-relaxed">
            Hand-shaped surf and skate from a one-bench workshop. Made
            between the wave and the concrete.
          </p>
        </div>
        <FooterCol title="Visit" links={["Workshop", "Stockists", "Events"]} />
        <FooterCol title="Follow" links={["Instagram", "TikTok", "YouTube"]} />
      </div>
      <div className="border-t border-border/40 py-6 text-center font-mono text-[10px] uppercase tracking-widest text-silver/40">
        © {new Date().getFullYear()} Liminal Surf & Skate Co · Est. 26
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
        {title}
      </h4>
      <ul className="space-y-2 text-silver/70 text-sm">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-primary transition-colors">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

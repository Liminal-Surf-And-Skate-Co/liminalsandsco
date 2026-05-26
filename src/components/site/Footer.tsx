import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import logo from "@/assets/liminal-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <img src={logo} alt="Liminal" className="h-16 w-auto mb-4" />
          <p className="font-display text-2xl text-primary mb-3">Oh Yeah Not Bad!</p>
          <p className="text-silver/60 text-sm max-w-xs leading-relaxed">
            Hand-crafted surf and skate from a one-bench workshop. Made
            between the wave and the concrete.
          </p>
        </div>
        <FooterCol title="Visit" links={["Workshop", "Stockists", "Events"]} />
        <FooterCol title="Follow" links={["Instagram", "TikTok", "YouTube"]} />
      </div>

      <div className="border-t border-border/40 bg-card/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-silver/70 font-mono text-[10px] uppercase tracking-widest">
            <Lock className="h-3.5 w-3.5 text-primary" />
            Secure SSL checkout · Your data stays encrypted
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-silver/60">
            <span className="px-2 py-1 border border-border/60">Visa</span>
            <span className="px-2 py-1 border border-border/60">Mastercard</span>
            <span className="px-2 py-1 border border-border/60">Amex</span>
            <span className="px-2 py-1 border border-border/60">Apple Pay</span>
            <span className="px-2 py-1 border border-border/60">Google Pay</span>
            <span className="px-2 py-1 border border-border/60">Afterpay</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-silver/50">
          <p>© {new Date().getFullYear()} Liminal Surf & Skate Co · Est. 26</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li><Link to="/support" className="hover:text-primary transition-colors">Support</Link></li>
            <li><Link to="/support" hash="privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/support" hash="terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link to="/support" hash="refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
          </ul>
        </div>
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

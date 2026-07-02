import { Link } from "@tanstack/react-router";
import { Lock, Instagram, Youtube, MessageCircle, Mail } from "lucide-react";
import logo from "@/assets/liminal-logo.png";
import { useSiteSettings } from "@/lib/site-settings";

// Liam the Llama mascot placeholder
const LIAM_PLACEHOLDER = `[ LIAM THE LLAMA BRAND CONTAINER — MASCOT IMAGE PLACEHOLDER ]`;

export function LiamBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-silver/10 border border-silver/30 rounded-sm">
      <div className="h-6 w-6 rounded-full bg-silver/20 flex items-center justify-center">
        <span className="font-display font-black text-[8px] text-silver">LL</span>
      </div>
      <span className="font-mono text-[9px] uppercase tracking-widest text-silver/70">Liam SAYS HI</span>
    </div>
  );
}

export function Footer() {
  const { data: settings } = useSiteSettings();
  const socials = [
    { key: "instagram_url", label: "Instagram", url: settings?.instagram_url, Icon: Instagram },
    { key: "youtube_url", label: "YouTube", url: settings?.youtube_url, Icon: Youtube },
    {
      key: "tiktok_url",
      label: "TikTok",
      url: settings?.tiktok_url,
      // lucide doesn't ship a TikTok icon; reuse a music-y glyph
      Icon: MessageCircle,
    },
    {
      key: "discord_invite_url",
      label: "Discord",
      url: settings?.discord_invite_url,
      Icon: MessageCircle,
    },
  ].filter((s) => s.url);

  const emailPrimary = settings?.contact_email_primary;
  const emailSecondary = settings?.contact_email_secondary;

  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <img src={logo} alt="Liminal" className="h-16 w-auto" />
            <LiamBadge />
          </div>
          <p className="font-display text-2xl text-primary mb-3">Oh Yeah Not Bad!</p>
          <p className="text-silver/60 text-sm max-w-xs leading-relaxed">
            Hand-crafted surf and skate from a one-bench workshop. Made between the wave and the
            concrete.
          </p>
          <p className="font-mono text-[9px] text-silver/30 mt-3">{LIAM_PLACEHOLDER}</p>
        </div>

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
            Contact
          </h4>
          <ul className="space-y-2 text-silver/70 text-sm">
            {emailPrimary && (
              <li>
                <a
                  href={`mailto:${emailPrimary}`}
                  className="hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="h-3.5 w-3.5" /> {emailPrimary}
                </a>
              </li>
            )}
            {emailSecondary && (
              <li>
                <a
                  href={`mailto:${emailSecondary}`}
                  className="hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="h-3.5 w-3.5" /> {emailSecondary}
                </a>
              </li>
            )}
            <li>
              <Link to="/support" className="hover:text-primary transition-colors">
                Support hub
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
            Follow
          </h4>
          {socials.length === 0 ? (
            <p className="text-silver/40 text-xs font-mono">Links coming soon</p>
          ) : (
            <ul className="space-y-2 text-silver/70 text-sm">
              {socials.map(({ key, label, url, Icon }) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
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
            <li>
              <Link to="/support" className="hover:text-primary transition-colors">
                Support
              </Link>
            </li>
            <li>
              <Link to="/legal/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/legal/returns" className="hover:text-primary transition-colors">
                Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/liability" className="hover:text-primary transition-colors">
                Activity Waiver
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

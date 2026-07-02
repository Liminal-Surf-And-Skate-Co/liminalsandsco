import { useState } from "react";
import { MessageCircle, X, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

export function LiamChatWidget() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const discordUrl = settings?.discord_invite_url;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-silver text-background shadow-lg flex items-center justify-center hover:bg-primary transition-colors group"
        aria-label="Ask Liam"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
          </>
        )}
      </button>

      {/* Popup panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-72 border border-border/60 bg-card shadow-2xl">
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-silver/10 flex items-center justify-center border border-silver/30">
                <span className="font-display font-black text-sm text-silver">LL</span>
              </div>
              <div>
                <p className="font-display font-bold text-sm">Liam's Dispatch</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-silver/50">
                  Ask Liam anything
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-silver/80">
              Hey, I'm Liam. Need gear advice, a stoke check, or just want to chat about last
              swell? Hit me up on Discord.
            </p>
            <p className="text-xs text-silver/50 italic">
              "The waves wait for no one. But I'll answer your DMs within 24 hours."
            </p>
            {discordUrl ? (
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-center gap-2 w-full bg-silver text-background font-mono text-xs uppercase tracking-widest py-3 hover:bg-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on Discord
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <div className="text-center py-2">
                <p className="font-mono text-[10px] text-silver/40">Discord link coming soon</p>
              </div>
            )}
            <div className="pt-2 border-t border-border/40">
              <a
                href="mailto:contact@liminalsandsco.com"
                className="block text-center text-xs text-silver/60 hover:text-primary transition-colors"
              >
                contact@liminalsandsco.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { AlertTriangle, X, Database, Sparkles } from "lucide-react";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

const DISMISS_KEY = "liminal:backend-banner:dismissed";

/**
 * Sticky top-of-app amber banner. Renders only when Supabase env vars are missing
 * or set to placeholder values (Demo / Offline Mode). Sessions can dismiss it
 * once per browser via localStorage; a manual reset button appears after 7 days.
 *
 * Placement: injected by `__root.tsx` directly above the global <Nav /> so it
 * appears across every route (store, studio, account, admin, etc.).
 */
export function BackendConfigBanner() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Defer the env check to the client to avoid SSR errors when
    // import.meta.env is unavailable at build-time hydration.
    try {
      setConfigured(isSupabaseConfigured());
    } catch {
      setConfigured(true);
    }
    try {
      const raw = window.localStorage.getItem(DISMISS_KEY);
      if (raw) {
        const ts = Number(raw) || 0;
        // Auto-reappear after 7 days of dismissal so devs aren't stuck.
        if (Date.now() - ts < 7 * 24 * 60 * 60 * 1000) setDismissed(true);
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  if (configured === null || configured === true || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore storage errors */
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[60] w-full border-b border-amber-500/40 bg-amber-100/95 text-amber-950 backdrop-blur supports-[backdrop-filter]:bg-amber-100/80 dark:bg-amber-500/20 dark:text-amber-50 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-2.5 sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-md bg-amber-500/20 p-1.5 text-amber-700 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1 text-xs leading-relaxed sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-mono uppercase tracking-widest text-amber-700 dark:text-amber-200">
              Demo / Offline Mode
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-amber-700/70 sm:inline dark:text-amber-200/70">
              ·
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700/70 dark:text-amber-200/70">
              Backend not configured
            </span>
          </div>
          <p className="mt-0.5 max-w-3xl text-amber-900/90 dark:text-amber-50/90">
            <code className="rounded bg-amber-200/60 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-500/30">
              VITE_SUPABASE_URL
            </code>{" "}
            or{" "}
            <code className="rounded bg-amber-200/60 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-500/30">
              VITE_SUPABASE_ANON_KEY
            </code>{" "}
            is missing in this environment. Authentication, account data, blog CMS, loyalty points,
            orders, and saved Garage designs will simulate local mock behavior — your browser is
            fully usable for browsing and Design Studio preview, but nothing will sync to a real
            backend until the keys are added.
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-amber-800/80 dark:text-amber-100/80">
            <span className="inline-flex items-center gap-1">
              <Database className="h-3 w-3" />
              Local mock data only
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              All visual tools active
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss backend status banner"
          className="ml-auto inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-amber-800 transition hover:bg-amber-200/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-amber-100 dark:hover:bg-amber-500/30"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  );
}

export default BackendConfigBanner;

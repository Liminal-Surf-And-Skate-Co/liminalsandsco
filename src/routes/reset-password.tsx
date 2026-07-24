// @ts-nocheck
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertCircle, Loader as Loader2, KeyRound } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Liminal Surf & Skate Co" },
      { name: "description", content: "Set a new password for your Liminal account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase recovery link puts a session in the URL hash; the client picks it up automatically.
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      setReady(true);
      return;
    }
    // Otherwise verify we have a session.
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/account" });
    } catch (err: any) {
      console.error("[reset-password]", err);
      setError(err?.message || "Could not update password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-md mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8">
          <KeyRound className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-display font-black text-3xl mb-2">Set a new password</h1>
          <p className="text-silver/70 text-sm">
            Enter your new password below to regain access to your account.
          </p>
        </div>

        {!ready ? (
          <div className="border border-border/60 bg-card p-6 rounded-lg text-center">
            <p className="text-sm text-silver/70 mb-4">
              This link is invalid or has expired. Request a new reset email.
            </p>
            <Link
              to="/account"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-md hover:opacity-90"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="border border-border/60 bg-card p-6 rounded-lg space-y-3"
          >
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
              minLength={8}
              className="w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono rounded-md focus:outline-none focus:border-primary"
            />
            <input
              required
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              minLength={8}
              className="w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono rounded-md focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                </span>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

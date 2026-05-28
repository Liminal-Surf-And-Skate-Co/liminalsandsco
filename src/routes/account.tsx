import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, LogOut, Shield } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Liminal Surf & Skate Co" },
      { name: "description", content: "Sign in to track orders and unlock loyalty rewards." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // already-signed-in users can stay on this page to see their account
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/account" },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-md mx-auto px-6 py-24">
        <div className="text-center mb-10">
          <User className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-display font-black text-4xl mb-3">
            {user ? "Your account" : mode === "signin" ? "Welcome back" : "Join the crew"}
          </h1>
          <p className="text-silver/70 text-sm">
            {user ? email || user.email : "Track orders, save your wishlist, earn loyalty rewards."}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-silver/50 font-mono text-xs">Loading…</p>
        ) : user ? (
          <div className="border border-border/60 bg-card p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-silver/60 font-mono text-xs uppercase tracking-widest">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-silver/60 font-mono text-xs uppercase tracking-widest">Role</span>
                <span>{isAdmin ? "Admin" : "Member"}</span>
              </div>
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90"
              >
                <Shield className="h-4 w-4" /> Open admin
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full border border-border/60 text-silver hover:border-primary font-mono text-xs uppercase tracking-widest py-3"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        ) : (
          <div className="border border-border/60 bg-card p-6">
            <div className="flex gap-2 mb-6">
              {(["signin", "signup"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setMode(k)}
                  className={`flex-1 font-mono text-[10px] uppercase tracking-widest px-3 py-2 border transition-colors ${
                    mode === k
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-silver hover:border-primary"
                  }`}
                >
                  {k === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
              />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 characters)"
                minLength={8}
                className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

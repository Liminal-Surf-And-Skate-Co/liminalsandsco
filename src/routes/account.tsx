import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-md mx-auto px-6 py-24">
        <div className="text-center mb-10">
          <User className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-display font-black text-4xl mb-3">
            {mode === "signin" ? "Welcome back" : "Join the crew"}
          </h1>
          <p className="text-silver/70 text-sm">
            Track orders, save your wishlist, earn loyalty rewards.
          </p>
        </div>

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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Accounts are coming soon — connect Lovable Cloud to enable real sign-in.");
            }}
            className="space-y-3"
          >
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
            />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-silver/50 text-center">
            Accounts coming soon
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

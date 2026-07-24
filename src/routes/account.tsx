// @ts-nocheck
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, LogOut, Shield, Gift, Clock, Settings, Circle as HelpCircle, Award, ChevronRight, Sparkles, Zap, Loader as Loader2, AlertCircle, Mail } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { useLoyalty, TIERS, type Reward } from "@/hooks/use-loyalty";
import { toast } from "sonner";
import { sanitizeError } from "@/lib/error-sanitize";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setAuthError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/account" },
        });
        if (error) throw error;
        toast.success("Account created — check your inbox to confirm.");
        setNotice("Check your inbox to confirm your email.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setNotice("If that email exists, a reset link is on its way.");
        toast.success("Password reset email sent.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err: any) {
      console.error("[auth]", err);
      setAuthError(err?.message || sanitizeError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleOAuth = async (provider: "google" | "discord") => {
    setAuthError(null);
    setBusy(true);
    try {
      if (provider === "google") {
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });
        if (result?.error) throw result.error;
      } else {
        // Discord: use Supabase directly (project-level provider config required).
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "discord",
          options: { redirectTo: window.location.origin + "/account" },
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error("[oauth]", provider, err);
      const msg = err?.message || String(err);
      setAuthError(
        msg.includes("provider is not enabled") || msg.includes("Unsupported provider")
          ? `${provider} sign-in isn't enabled yet. Enable it in your backend auth settings.`
          : msg,
      );
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
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {loading ? (
          <AccountSkeleton />
        ) : user ? (
          <DashboardView user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />
        ) : (
          <AuthView
            mode={mode}
            setMode={(m) => { setMode(m); setAuthError(null); setNotice(null); }}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            busy={busy}
            authError={authError}
            notice={notice}
            onSubmit={handleSubmit}
            onOAuth={handleOAuth}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

function DashboardView({
  user,
  isAdmin,
  onSignOut,
}: {
  user: { email: string | null; id: string };
  isAdmin: boolean;
  onSignOut: () => void;
}) {
  const { record, allRewards, loading, tierInfo, redeem, addPoints } = useLoyalty();
  const [activeTab, setActiveTab] = useState<"overview" | "rewards" | "settings">("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-border/40">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-black text-2xl md:text-3xl">{user.email || "Member"}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs font-mono text-silver/60 uppercase tracking-widest">
              {isAdmin ? "Admin" : "Member"}
            </span>
            {tierInfo && (
              <span
                className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: tierInfo.tierDef.color + "20", color: tierInfo.tierDef.color }}
              >
                <Award className="h-3 w-3" />
                {tierInfo.tierDef.label}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-md hover:opacity-90"
            >
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border/60 text-silver hover:border-primary text-xs font-mono uppercase tracking-widest rounded-md"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/40">
        {(
          [
            { key: "overview" as const, label: "Overview", icon: User },
            { key: "rewards" as const, label: "Rewards", icon: Gift },
            { key: "settings" as const, label: "Settings", icon: Settings },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-silver/60 hover:text-silver"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab user={user} record={record} tierInfo={tierInfo} loading={loading} addPoints={addPoints} />
      )}
      {activeTab === "rewards" && (
        <RewardsTab
          allRewards={allRewards}
          record={record}
          tierInfo={tierInfo}
          loading={loading}
          redeem={redeem}
        />
      )}
      {activeTab === "settings" && <SettingsTab user={user} />}
    </div>
  );
}

function OverviewTab({
  user,
  record,
  tierInfo,
  loading,
  addPoints,
}: {
  user: { email: string | null; id: string };
  record: { points: number; total_earned: number; total_redeemed: number } | null;
  tierInfo: ReturnType<typeof import("@/hooks/use-loyalty").getTierInfo> | null;
  loading: boolean;
  addPoints: { mutate: (args: { points: number }) => void; isPending: boolean };
}) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-border/60 bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-silver/60">Points</span>
          </div>
          <p className="text-2xl font-display font-bold">
            {loading ? "—" : record?.points ?? 0}
          </p>
        </div>
        <div className="border border-border/60 bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-silver/60">Earned</span>
          </div>
          <p className="text-2xl font-display font-bold">
            {loading ? "—" : record?.total_earned ?? 0}
          </p>
        </div>
        <div className="border border-border/60 bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-silver/60">Redeemed</span>
          </div>
          <p className="text-2xl font-display font-bold">
            {loading ? "—" : record?.total_redeemed ?? 0}
          </p>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="border border-border/60 bg-card rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Tier Progress</h2>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : tierInfo ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: tierInfo.tierDef.color + "20", color: tierInfo.tierDef.color }}
                >
                  <Award className="h-3.5 w-3.5" />
                  {tierInfo.tierDef.label}
                </span>
                {tierInfo.nextTier && (
                  <span className="text-xs text-silver/60">
                    → {tierInfo.nextTier.label} at {tierInfo.nextTier.min} pts
                  </span>
                )}
              </div>
              <span className="text-sm font-mono text-silver/60">{record?.points ?? 0} pts</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(0, Math.min(100, tierInfo.progress))}%`,
                  backgroundColor: tierInfo.tierDef.color,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-silver/40">
              {TIERS.map((t) => (
                <span key={t.key} className={t.key === tierInfo.tier ? "text-primary font-bold" : ""}>
                  {t.label}
                </span>
              ))}
            </div>
            {/* Dev/demo trigger */}
            <div className="pt-2 border-t border-border/30">
              <button
                onClick={() => addPoints.mutate({ points: 50 })}
                disabled={addPoints.isPending}
                className="text-xs font-mono text-primary/70 hover:text-primary underline underline-offset-2 disabled:opacity-50"
              >
                + Demo: Add 50 points
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-silver/60 mb-2">Start earning points with your first purchase!</p>
            <button
              onClick={() => addPoints.mutate({ points: 50 })}
              disabled={addPoints.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-md hover:opacity-90 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" /> Claim starter points
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="border border-border/60 bg-card rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {record ? (
            <>
              <div className="flex items-center gap-3 py-2 border-b border-border/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Points updated</p>
                  <p className="text-xs text-silver/60 font-mono">Balance: {record.points} pts</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-border/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Current tier: {getTierLabel(record.points)}</p>
                  <p className="text-xs text-silver/60 font-mono">Total earned: {record.total_earned} pts</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-silver/60 text-center py-4">No activity yet. Make a purchase to get started!</p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/wishlist"
          className="flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Wishlist</p>
            <p className="text-xs text-silver/60 font-mono">Saved items</p>
          </div>
          <ChevronRight className="h-4 w-4 text-silver/40" />
        </Link>
        <Link
          to="/cart"
          className="flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Cart</p>
            <p className="text-xs text-silver/60 font-mono">Checkout</p>
          </div>
          <ChevronRight className="h-4 w-4 text-silver/40" />
        </Link>
        <a
          href="/support"
          className="flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Support</p>
            <p className="text-xs text-silver/60 font-mono">Help & contact</p>
          </div>
          <ChevronRight className="h-4 w-4 text-silver/40" />
        </a>
        <Link
          to="/shop"
          className="flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Shop</p>
            <p className="text-xs text-silver/60 font-mono">Browse products</p>
          </div>
          <ChevronRight className="h-4 w-4 text-silver/40" />
        </Link>
      </div>
    </div>
  );
}

function RewardsTab({
  allRewards,
  record,
  tierInfo,
  loading,
  redeem,
}: {
  allRewards: Reward[] | undefined;
  record: { points: number; total_earned: number; total_redeemed: number } | null;
  tierInfo: ReturnType<typeof import("@/hooks/use-loyalty").getTierInfo> | null;
  loading: boolean;
  redeem: { mutate: (args: { reward: Reward }) => void; isPending: boolean };
}) {
  const points = record?.points ?? 0;
  const currentTier = tierInfo?.tier ?? "bronze";
  const tierOrder = ["bronze", "silver", "gold", "platinum"];
  const currentTierIndex = tierOrder.indexOf(currentTier);

  return (
    <div className="space-y-6">
      <div className="border border-border/60 bg-card rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Available Rewards</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : allRewards && allRewards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allRewards.map((reward) => {
              const rewardTierIndex = tierOrder.indexOf(reward.tier_unlocked);
              const canAfford = points >= reward.points_required;
              const unlocked = currentTierIndex >= rewardTierIndex;
              return (
                <div
                  key={reward.id}
                  className={`border rounded-lg p-4 transition-all ${
                    canAfford && unlocked
                      ? "border-primary/60 bg-primary/5 hover:border-primary"
                      : "border-border/40 bg-card/50 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold">{reward.title}</h3>
                    <span
                      className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: TIERS.find((t) => t.key === reward.tier_unlocked)?.color + "20",
                        color: TIERS.find((t) => t.key === reward.tier_unlocked)?.color,
                      }}
                    >
                      {reward.tier_unlocked}
                    </span>
                  </div>
                  <p className="text-xs text-silver/60 mb-3">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-silver/60">{reward.points_required} pts</span>
                    <button
                      onClick={() => canAfford && unlocked && redeem.mutate({ reward })}
                      disabled={!canAfford || !unlocked || redeem.isPending}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${
                        canAfford && unlocked
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "bg-muted text-silver/40 cursor-not-allowed"
                      }`}
                    >
                      {!unlocked
                        ? "Locked"
                        : !canAfford
                        ? "Need pts"
                        : redeem.isPending
                        ? "Redeeming..."
                        : "Redeem"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-silver/60 text-center py-8">No rewards available right now.</p>
        )}
      </div>
    </div>
  );
}

function SettingsTab({ user }: { user: { email: string | null; id: string } }) {
  return (
    <div className="space-y-6">
      <div className="border border-border/60 bg-card rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Account Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-silver/60 mb-1">
              Email
            </label>
            <p className="text-sm">{user.email || "—"}</p>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-silver/60 mb-1">
              User ID
            </label>
            <code className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">{user.id}</code>
          </div>
        </div>
      </div>

      <div className="border border-border/60 bg-card rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Support</h2>
        </div>
        <p className="text-sm text-silver/60 mb-4">
          Need help? Reach out to our crew for assistance with orders, rewards, or anything else.
        </p>
        <a
          href="mailto:support@liminalco.com"
          className="inline-flex items-center gap-2 px-4 py-2 border border-border/60 text-silver hover:border-primary text-xs font-mono uppercase tracking-widest rounded-md transition-colors"
        >
          <HelpCircle className="h-4 w-4" /> Contact Support
        </a>
      </div>
    </div>
  );
}

function AuthView({
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  busy,
  authError,
  notice,
  onSubmit,
  onOAuth,
}: {
  mode: "signin" | "signup" | "forgot";
  setMode: (m: "signin" | "signup" | "forgot") => void;
  email: string;
  setEmail: (s: string) => void;
  password: string;
  setPassword: (s: string) => void;
  busy: boolean;
  authError: string | null;
  notice: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onOAuth: (p: "google" | "discord") => void;
}) {
  const title =
    mode === "signin" ? "Welcome back" : mode === "signup" ? "Join the crew" : "Reset password";
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <User className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="font-display font-black text-3xl md:text-4xl mb-3">{title}</h1>
        <p className="text-silver/70 text-sm">
          {mode === "forgot"
            ? "Enter your email and we'll send a reset link."
            : "Track orders, save your wishlist, earn loyalty rewards."}
        </p>
      </div>

      <div className="border border-border/60 bg-card p-6 rounded-lg">
        {mode !== "forgot" && (
          <div className="flex gap-2 mb-5">
            {(["signin", "signup"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setMode(k)}
                className={`flex-1 font-mono text-[10px] uppercase tracking-widest px-3 py-2.5 border rounded-md transition-colors ${
                  mode === k
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 text-silver hover:border-primary"
                }`}
              >
                {k === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
        )}

        {mode !== "forgot" && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                type="button"
                onClick={() => onOAuth("google")}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 border border-border/60 rounded-md text-xs font-mono uppercase tracking-widest hover:border-primary disabled:opacity-50"
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                onClick={() => onOAuth("discord")}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 border border-border/60 rounded-md text-xs font-mono uppercase tracking-widest hover:border-primary disabled:opacity-50"
              >
                <DiscordIcon /> Discord
              </button>
            </div>
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
              <span className="relative bg-card px-2 text-[10px] font-mono uppercase tracking-widest text-silver/50">or with email</span>
            </div>
          </>
        )}

        {authError && (
          <div
            role="alert"
            className="mb-3 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="break-words">{authError}</span>
          </div>
        )}
        {notice && (
          <div
            role="status"
            className="mb-3 flex items-start gap-2 rounded-md border border-primary/40 bg-primary/10 p-3 text-xs text-primary"
          >
            <Mail className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="break-words">{notice}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          {mode !== "forgot" && (
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
              minLength={8}
              className="w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
              </span>
            ) : mode === "signin" ? (
              "Sign in"
            ) : mode === "signup" ? (
              "Create account"
            ) : (
              "Send reset link"
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-[11px] font-mono">
          {mode === "signin" ? (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-primary hover:underline"
            >
              Forgot password?
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="text-primary hover:underline"
            >
              ← Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.3l7.8 6.1C12.2 13.5 17.6 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.2-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.8c4.3-4 6.7-9.8 6.7-17.3z"/>
      <path fill="#FBBC05" d="M10.3 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.8-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.5 10.7l7.8-6.1z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.5l-7.4-5.8c-2.1 1.4-4.7 2.2-7.9 2.2-6.4 0-11.8-4-13.7-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3l-.191.365a18.29 18.29 0 0 1 3.317 1.093c-4.026-1.94-8.708-1.94-12.784 0A18.32 18.32 0 0 1 10.22 3.365L10.03 3a19.79 19.79 0 0 0-3.76 1.369C2.61 9.75 1.822 15 2.2 20.18c1.68 1.253 3.31 2.017 4.914 2.517.397-.54.75-1.116 1.056-1.719-.579-.219-1.131-.487-1.657-.804.14-.104.276-.212.408-.322 3.216 1.492 6.696 1.492 9.869 0 .133.11.269.218.408.322-.527.318-1.08.587-1.66.807.306.6.66 1.176 1.056 1.716 1.605-.5 3.235-1.264 4.916-2.518.446-6-.907-11.203-3.194-15.81zM8.834 15.62c-1.096 0-1.996-1.007-1.996-2.244s.882-2.243 1.996-2.243c1.115 0 2.014 1.006 1.996 2.243 0 1.237-.882 2.244-1.996 2.244zm6.332 0c-1.096 0-1.996-1.007-1.996-2.244s.882-2.243 1.996-2.243c1.115 0 2.014 1.006 1.996 2.243 0 1.237-.881 2.244-1.996 2.244z"/>
    </svg>
  );
}

function getTierLabel(points: number): string {
  if (points >= 1500) return "Platinum";
  if (points >= 500) return "Gold";
  if (points >= 100) return "Silver";
  return "Bronze";
}

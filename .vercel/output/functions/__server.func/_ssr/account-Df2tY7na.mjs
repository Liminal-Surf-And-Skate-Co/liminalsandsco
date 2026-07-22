import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { o as useAuth, N as Nav, F as Footer, q as sanitizeError } from "./router-BkwgZ6Uu.mjs";
import { s as supabase } from "./client-DYwJbDLa.mjs";
import { S as Skeleton, u as useLoyalty, T as TIERS } from "./use-loyalty-CKJsdNhs.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { p as User, a1 as Award, S as Shield, a2 as LogOut, G as Gift, _ as Settings, A as Loader, b as Sparkles, Z as Zap, C as Clock, k as ChevronRight, a3 as Circle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function AccountPage() {
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  useNavigate();
  reactExports.useEffect(() => {
  }, [loading, user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/account"
          }
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err) {
      toast.error(sanitizeError(err));
    } finally {
      setBusy(false);
    }
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(AccountSkeleton, {}) : user ? /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardView, { user, isAdmin, onSignOut: handleSignOut }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AuthView, { mode, setMode, email, setEmail, password, setPassword, busy, onSubmit: handleSubmit }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function AccountSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-lg" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-lg" })
  ] });
}
function DashboardView({
  user,
  isAdmin,
  onSignOut
}) {
  const {
    record,
    allRewards,
    loading,
    tierInfo,
    redeem,
    addPoints
  } = useLoyalty();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-7 w-7 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl md:text-3xl", children: user.email || "Member" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-silver/60 uppercase tracking-widest", children: isAdmin ? "Admin" : "Member" }),
          tierInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full", style: {
            backgroundColor: tierInfo.tierDef.color + "20",
            color: tierInfo.tierDef.color
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3 w-3" }),
            tierInfo.tierDef.label
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-md hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
          " Admin"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onSignOut, className: "inline-flex items-center gap-2 px-3 py-2 border border-border/60 text-silver hover:border-primary text-xs font-mono uppercase tracking-widest rounded-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          " Sign out"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 border-b border-border/40", children: [{
      key: "overview",
      label: "Overview",
      icon: User
    }, {
      key: "rewards",
      label: "Rewards",
      icon: Gift
    }, {
      key: "settings",
      label: "Settings",
      icon: Settings
    }].map(({
      key,
      label,
      icon: Icon
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(key), className: `flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${activeTab === key ? "border-primary text-primary" : "border-transparent text-silver/60 hover:text-silver"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: label })
    ] }, key)) }),
    activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { user, record, tierInfo, loading, addPoints }),
    activeTab === "rewards" && /* @__PURE__ */ jsxRuntimeExports.jsx(RewardsTab, { allRewards, record, tierInfo, loading, redeem }),
    activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTab, { user })
  ] });
}
function OverviewTab({
  user,
  record,
  tierInfo,
  loading,
  addPoints
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono uppercase tracking-widest text-silver/60", children: "Points" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold", children: loading ? "—" : record?.points ?? 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono uppercase tracking-widest text-silver/60", children: "Earned" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold", children: loading ? "—" : record?.total_earned ?? 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono uppercase tracking-widest text-silver/60", children: "Redeemed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold", children: loading ? "—" : record?.total_redeemed ?? 0 })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Tier Progress" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" })
      ] }) : tierInfo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full", style: {
              backgroundColor: tierInfo.tierDef.color + "20",
              color: tierInfo.tierDef.color
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3.5 w-3.5" }),
              tierInfo.tierDef.label
            ] }),
            tierInfo.nextTier && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-silver/60", children: [
              "→ ",
              tierInfo.nextTier.label,
              " at ",
              tierInfo.nextTier.min,
              " pts"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono text-silver/60", children: [
            record?.points ?? 0,
            " pts"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-700 ease-out", style: {
          width: `${Math.max(0, Math.min(100, tierInfo.progress))}%`,
          backgroundColor: tierInfo.tierDef.color
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between text-[10px] font-mono uppercase tracking-widest text-silver/40", children: TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: t.key === tierInfo.tier ? "text-primary font-bold" : "", children: t.label }, t.key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addPoints.mutate({
          points: 50
        }), disabled: addPoints.isPending, className: "text-xs font-mono text-primary/70 hover:text-primary underline underline-offset-2 disabled:opacity-50", children: "+ Demo: Add 50 points" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/60 mb-2", children: "Start earning points with your first purchase!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addPoints.mutate({
          points: 50
        }), disabled: addPoints.isPending, className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-md hover:opacity-90 disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          " Claim starter points"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Recent Activity" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: record ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2 border-b border-border/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Points updated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-silver/60 font-mono", children: [
              "Balance: ",
              record.points,
              " pts"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2 border-b border-border/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
              "Current tier: ",
              getTierLabel(record.points)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-silver/60 font-mono", children: [
              "Total earned: ",
              record.total_earned,
              " pts"
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/60 text-center py-4", children: "No activity yet. Make a purchase to get started!" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/wishlist", className: "flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Wishlist" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 font-mono", children: "Saved items" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-silver/40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", className: "flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Cart" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 font-mono", children: "Checkout" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-silver/40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/support", className: "flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Support" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 font-mono", children: "Help & contact" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-silver/40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Shop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 font-mono", children: "Browse products" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-silver/40" })
      ] })
    ] })
  ] });
}
function RewardsTab({
  allRewards,
  record,
  tierInfo,
  loading,
  redeem
}) {
  const points = record?.points ?? 0;
  const currentTier = tierInfo?.tier ?? "bronze";
  const tierOrder = ["bronze", "silver", "gold", "platinum"];
  const currentTierIndex = tierOrder.indexOf(currentTier);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4 md:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Available Rewards" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-lg" }, i)) }) : allRewards && allRewards.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: allRewards.map((reward) => {
      const rewardTierIndex = tierOrder.indexOf(reward.tier_unlocked);
      const canAfford = points >= reward.points_required;
      const unlocked = currentTierIndex >= rewardTierIndex;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border rounded-lg p-4 transition-all ${canAfford && unlocked ? "border-primary/60 bg-primary/5 hover:border-primary" : "border-border/40 bg-card/50 opacity-70"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: reward.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full", style: {
            backgroundColor: TIERS.find((t) => t.key === reward.tier_unlocked)?.color + "20",
            color: TIERS.find((t) => t.key === reward.tier_unlocked)?.color
          }, children: reward.tier_unlocked })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 mb-3", children: reward.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-silver/60", children: [
            reward.points_required,
            " pts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => canAfford && unlocked && redeem.mutate({
            reward
          }), disabled: !canAfford || !unlocked || redeem.isPending, className: `px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${canAfford && unlocked ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-silver/40 cursor-not-allowed"}`, children: !unlocked ? "Locked" : !canAfford ? "Need pts" : redeem.isPending ? "Redeeming..." : "Redeem" })
        ] })
      ] }, reward.id);
    }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/60 text-center py-8", children: "No rewards available right now." })
  ] }) });
}
function SettingsTab({
  user
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Account Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-mono uppercase tracking-widest text-silver/60 mb-1", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: user.email || "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-mono uppercase tracking-widest text-silver/60 mb-1", children: "User ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs font-mono bg-muted px-2 py-1 rounded break-all", children: user.id })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Support" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/60 mb-4", children: "Need help? Reach out to our crew for assistance with orders, rewards, or anything else." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:support@liminalco.com", className: "inline-flex items-center gap-2 px-4 py-2 border border-border/60 text-silver hover:border-primary text-xs font-mono uppercase tracking-widest rounded-md transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4" }),
        " Contact Support"
      ] })
    ] })
  ] });
}
function AuthView({
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  busy,
  onSubmit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-10 w-10 text-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-3xl md:text-4xl mb-3", children: mode === "signin" ? "Welcome back" : "Join the crew" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 text-sm", children: "Track orders, save your wishlist, earn loyalty rewards." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-6 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6", children: ["signin", "signup"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(k), className: `flex-1 font-mono text-[10px] uppercase tracking-widest px-3 py-2.5 border rounded-md transition-colors ${mode === k ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: k === "signin" ? "Sign in" : "Create account" }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email", className: "w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password (min 8 characters)", minLength: 8, className: "w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "h-4 w-4 animate-spin" }),
          " Loading..."
        ] }) : mode === "signin" ? "Sign in" : "Create account" })
      ] })
    ] })
  ] });
}
function getTierLabel(points) {
  if (points >= 1500) return "Platinum";
  if (points >= 500) return "Gold";
  if (points >= 100) return "Silver";
  return "Bronze";
}
export {
  AccountPage as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link, u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { f as useAuth, N as Nav, F as Footer, g as sanitizeError, b as useSiteSettings, h as useUpdateSetting, S as SETTING_KEYS, i as SETTING_LABELS } from "./router-BZBp0UBL.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-H7dh7fgY.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CoYR1wf1.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DYwJbDLa.mjs";
import { S as Skeleton, T as TIERS } from "./skeleton-BwPk7GRD.mjs";
import "../_libs/seroval.mjs";
import { S as Shield, O as ArrowLeft, Q as ChartBar, U as Users, g as Trophy, z as Settings, _ as DollarSign, P as Package, s as Mail, e as Calendar, u as Search, J as Loader, $ as CircleAlert, Z as Zap, G as Gift } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__query-core.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const claimFirstAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c"));
const adminExists = createServerFn({
  method: "GET"
}).handler(createSsrRpc("8b404eadc272d7d27f48745f2fd105c6bc74772c80d7e5eb87638d43cd197daa"));
function AdminPage() {
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/account"
    });
  }, [loading, user, navigate]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSkeleton, {}) })
    ] });
  }
  if (!user) return null;
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(NonAdminGate, { userId: user.id });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-border/40 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl md:text-3xl", children: "Admin Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/60 font-mono", children: "Manage users, rewards, and site settings" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/account", className: "inline-flex items-center gap-2 px-3 py-2 border border-border/60 text-silver hover:border-primary text-xs font-mono uppercase tracking-widest rounded-md transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Back"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 border-b border-border/40 mb-6 overflow-x-auto", children: [{
        key: "overview",
        label: "Overview",
        icon: ChartBar
      }, {
        key: "users",
        label: "Users",
        icon: Users
      }, {
        key: "loyalty",
        label: "Loyalty",
        icon: Trophy
      }, {
        key: "settings",
        label: "Settings",
        icon: Settings
      }].map(({
        key,
        label,
        icon: Icon
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(key), className: `flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === key ? "border-primary text-primary" : "border-transparent text-silver/60 hover:text-silver"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: label })
      ] }, key)) }),
      activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminOverview, {}),
      activeTab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminUsers, {}),
      activeTab === "loyalty" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLoyalty, {}),
      activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSettings, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function AdminSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-12 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" })
    ] })
  ] });
}
function AdminOverview() {
  const {
    data: metrics,
    isLoading
  } = useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: async () => {
      const {
        count: totalUsers
      } = await supabase.from("user_roles").select("*", {
        count: "exact",
        head: true
      });
      const {
        count: totalCustomers
      } = await supabase.from("customers").select("*", {
        count: "exact",
        head: true
      });
      const {
        count: totalOrders
      } = await supabase.from("orders").select("*", {
        count: "exact",
        head: true
      });
      const {
        count: totalProducts
      } = await supabase.from("products").select("*", {
        count: "exact",
        head: true
      });
      const {
        count: totalLoyalty
      } = await supabase.from("loyalty_points").select("*", {
        count: "exact",
        head: true
      });
      return {
        totalUsers,
        totalCustomers,
        totalOrders,
        totalProducts,
        totalLoyalty
      };
    }
  });
  const quickLinks = [{
    to: "/admin/products",
    label: "Products",
    icon: Package,
    desc: "Manage catalog"
  }, {
    to: "/admin/newsletters",
    label: "Newsletters",
    icon: Mail,
    desc: "Compose drops"
  }, {
    to: "/admin/events",
    label: "Events",
    icon: Calendar,
    desc: "Community events"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [{
      label: "Total Users",
      value: metrics?.totalUsers ?? 0,
      icon: Users,
      loading: isLoading
    }, {
      label: "Customers",
      value: metrics?.totalCustomers ?? 0,
      icon: Users,
      loading: isLoading
    }, {
      label: "Orders",
      value: metrics?.totalOrders ?? 0,
      icon: DollarSign,
      loading: isLoading
    }, {
      label: "Products",
      value: metrics?.totalProducts ?? 0,
      icon: Package,
      loading: isLoading
    }, {
      label: "Active Rewards",
      value: metrics?.totalLoyalty ?? 0,
      icon: Trophy,
      loading: isLoading
    }].map(({
      label,
      value,
      icon: Icon,
      loading
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono uppercase tracking-widest text-silver/60", children: label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16" }) : value })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: quickLinks.map(({
      to,
      label,
      icon: Icon,
      desc
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 font-mono", children: desc })
      ] })
    ] }, to)) })
  ] });
}
function AdminUsers() {
  const [search, setSearch] = reactExports.useState("");
  const {
    data: users,
    isLoading
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("user_roles").select("*, user_id").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const {
    data: loyaltyData
  } = useQuery({
    queryKey: ["admin", "loyalty"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("loyalty_points").select("*");
      if (error) throw error;
      return data ?? [];
    }
  });
  const filtered = users?.filter((u) => search === "" || u.user_id?.toLowerCase().includes(search.toLowerCase()) || u.role?.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-silver/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search users...", className: "w-full pl-9 pr-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-silver/60", children: [
        filtered?.length ?? 0,
        " users"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/60 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60", children: "User ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60", children: "Points" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60", children: "Tier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60", children: "Joined" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "h-5 w-5 animate-spin mx-auto text-silver/40" }) }) }) : filtered && filtered.length > 0 ? filtered.map((u) => {
        const lp = loyaltyData?.find((l) => l.user_id === u.user_id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/30 hover:bg-muted/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs truncate max-w-[150px] sm:max-w-[200px]", children: u.user_id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex px-2 py-0.5 text-[10px] font-mono uppercase rounded-full ${u.role === "admin" ? "bg-primary/20 text-primary" : "bg-muted text-silver/60"}`, children: u.role }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs", children: lp?.points ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase", style: {
            color: TIERS.find((t) => t.key === (lp?.tier ?? "bronze"))?.color
          }, children: lp?.tier ?? "bronze" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-silver/60", children: u.created_at ? new Date(u.created_at).toLocaleDateString() : "—" })
        ] }, u.id);
      }) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 5, className: "px-4 py-8 text-center text-silver/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 mx-auto mb-2 text-silver/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No users found" })
      ] }) }) })
    ] }) }) })
  ] });
}
function AdminLoyalty() {
  const [searchUserId, setSearchUserId] = reactExports.useState("");
  const [pointsToAdd, setPointsToAdd] = reactExports.useState("");
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const queryClient = useQueryClient();
  const {
    data: loyaltyData,
    isLoading
  } = useQuery({
    queryKey: ["admin", "loyalty"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("loyalty_points").select("*").order("points", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const {
    data: allRewards
  } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("rewards").select("*").order("points_required", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const adjustPoints = useMutation({
    mutationFn: async ({
      userId,
      delta
    }) => {
      const {
        data: existing
      } = await supabase.from("loyalty_points").select("*").eq("user_id", userId).maybeSingle();
      if (existing) {
        const newPoints = Math.max(0, existing.points + delta);
        const {
          error
        } = await supabase.from("loyalty_points").update({
          points: newPoints,
          tier: getTierFromPoints(newPoints),
          total_earned: delta > 0 ? existing.total_earned + delta : existing.total_earned,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("user_id", userId);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("loyalty_points").insert({
          user_id: userId,
          points: Math.max(0, delta),
          tier: getTierFromPoints(Math.max(0, delta)),
          total_earned: Math.max(0, delta),
          total_redeemed: 0
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "loyalty"]
      });
      queryClient.invalidateQueries({
        queryKey: ["loyalty"]
      });
      toast.success("Points updated");
      setPointsToAdd("");
      setSearchUserId("");
      setSelectedUser(null);
    },
    onError: (e) => toast.error(sanitizeError(e))
  });
  const filtered = loyaltyData?.filter((l) => searchUserId === "" || l.user_id?.toLowerCase().includes(searchUserId.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Adjust Points" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: searchUserId, onChange: (e) => setSearchUserId(e.target.value), placeholder: "User ID (UUID)", className: "flex-1 px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: pointsToAdd, onChange: (e) => setPointsToAdd(e.target.value), placeholder: "Points (+/-)", className: "px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary w-full sm:w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (!searchUserId || !pointsToAdd) return;
          adjustPoints.mutate({
            userId: searchUserId,
            delta: parseInt(pointsToAdd, 10)
          });
        }, disabled: adjustPoints.isPending || !searchUserId || !pointsToAdd, className: "px-4 py-2.5 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-md hover:opacity-90 disabled:opacity-50", children: adjustPoints.isPending ? "Updating..." : "Adjust" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Active Rewards" })
      ] }),
      allRewards && allRewards.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: allRewards.map((reward) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/40 rounded-lg p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: reward.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-primary/10 text-primary", children: [
            reward.points_required,
            " pts"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60 mt-1", children: reward.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-silver/40 mt-2 block", children: [
          reward.tier_unlocked,
          " tier"
        ] })
      ] }, reward.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-silver/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 mx-auto mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No rewards configured" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Loyalty Leaderboard" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-mono uppercase text-silver/60", children: "Rank" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-mono uppercase text-silver/60", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-mono uppercase text-silver/60", children: "Points" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-mono uppercase text-silver/60", children: "Tier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-mono uppercase text-silver/60", children: "Earned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-mono uppercase text-silver/60", children: "Redeemed" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-3 py-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "h-5 w-5 animate-spin mx-auto text-silver/40" }) }) }) : filtered && filtered.length > 0 ? filtered.slice(0, 20).map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/30 hover:bg-muted/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-bold text-primary", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs truncate max-w-[150px] sm:max-w-[200px]", children: l.user_id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-bold", children: l.points }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase", style: {
            color: TIERS.find((t) => t.key === l.tier)?.color
          }, children: l.tier }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-silver/60", children: l.total_earned }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-silver/60", children: l.total_redeemed })
        ] }, l.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 6, className: "px-3 py-6 text-center text-silver/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 mx-auto mb-2 text-silver/40" }),
          "No loyalty data yet"
        ] }) }) })
      ] }) })
    ] })
  ] });
}
function AdminSettings() {
  const {
    data: settings,
    isLoading
  } = useSiteSettings();
  const updateSetting = useUpdateSetting();
  const [draft, setDraft] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);
  const save = async (key) => {
    try {
      await updateSetting.mutateAsync({
        key,
        value: draft[key] ?? ""
      });
      toast.success(`Saved ${SETTING_LABELS[key]}`);
    } catch (e) {
      toast.error(sanitizeError(e));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Site Settings" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: SETTING_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: SETTING_LABELS[key] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: draft[key] ?? "", onChange: (e) => setDraft((d) => ({
          ...d,
          [key]: e.target.value
        })), placeholder: "—", className: "flex-1 px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => save(key), disabled: updateSetting.isPending || draft[key] === settings?.[key], className: "bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-40", children: "Save" })
      ] })
    ] }, key)) })
  ] });
}
function NonAdminGate({
  userId
}) {
  const queryClient = useQueryClient();
  const adminExistsFn = useServerFn(adminExists);
  const claimFn = useServerFn(claimFirstAdmin);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin_exists"],
    queryFn: () => adminExistsFn()
  });
  const claim = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: () => {
      toast.success("You're now an admin. Refreshing...");
      queryClient.invalidateQueries();
      setTimeout(() => window.location.reload(), 600);
    },
    onError: (e) => toast.error(sanitizeError(e))
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-md mx-auto px-4 md:px-6 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10 text-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-3xl mb-3", children: "Admin only" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/60 font-mono text-xs", children: "Checking..." }) : data?.exists ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 text-sm mb-2", children: "Your account isn't an admin yet. Share your user ID with an existing admin:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "block bg-card border border-border/60 p-3 text-xs font-mono break-all mb-4 rounded-md", children: userId })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 text-sm mb-6", children: "No admins exist yet. Claim the first admin slot." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => claim.mutate(), disabled: claim.isPending, className: "bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-40", children: claim.isPending ? "Claiming..." : "Make me admin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "block mt-8 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary", children: "Back to account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function getTierFromPoints(points) {
  if (points >= 1500) return "platinum";
  if (points >= 500) return "gold";
  if (points >= 100) return "silver";
  return "bronze";
}
export {
  AdminPage as component
};

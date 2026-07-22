// @ts-nocheck
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Shield, Package, Mail, Calendar, Settings, Users, Trophy, TrendingUp, ChartBar as BarChart3, Loader as Loader2, CircleAlert as AlertCircle, ChevronDown, Search, Award, Gift, Zap, ArrowLeft, DollarSign } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useSiteSettings, useUpdateSetting, SETTING_KEYS, SETTING_LABELS } from "@/lib/site-settings";
import { adminExists, claimFirstAdmin } from "@/lib/admin.functions";
import { toast } from "sonner";
import { sanitizeError } from "@/lib/error-sanitize";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { TIERS } from "@/hooks/use-loyalty";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "loyalty" | "settings">("overview");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <AdminSkeleton />
        </main>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return <NonAdminGate userId={user.id} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-border/40 mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="font-display font-black text-2xl md:text-3xl">Admin Dashboard</h1>
            <p className="text-sm text-silver/60 font-mono">Manage users, rewards, and site settings</p>
          </div>
          <Link
            to="/account"
            className="inline-flex items-center gap-2 px-3 py-2 border border-border/60 text-silver hover:border-primary text-xs font-mono uppercase tracking-widest rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border/40 mb-6 overflow-x-auto">
          {([
            { key: "overview" as const, label: "Overview", icon: BarChart3 },
            { key: "users" as const, label: "Users", icon: Users },
            { key: "loyalty" as const, label: "Loyalty", icon: Trophy },
            { key: "settings" as const, label: "Settings", icon: Settings },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
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

        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "loyalty" && <AdminLoyalty />}
        {activeTab === "settings" && <AdminSettings />}
      </main>
      <Footer />
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
    </div>
  );
}

function AdminOverview() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: async () => {
      const { count: totalUsers } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true });
      const { count: totalCustomers } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });
      const { count: totalOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      const { count: totalProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      const { count: totalLoyalty } = await supabase
        .from("loyalty_points")
        .select("*", { count: "exact", head: true });
      return { totalUsers, totalCustomers, totalOrders, totalProducts, totalLoyalty };
    },
  });

  const quickLinks = [
    { to: "/admin/products", label: "Products", icon: Package, desc: "Manage catalog" },
    { to: "/admin/newsletters", label: "Newsletters", icon: Mail, desc: "Compose drops" },
    { to: "/admin/events", label: "Events", icon: Calendar, desc: "Community events" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: metrics?.totalUsers ?? 0, icon: Users, loading: isLoading },
          { label: "Customers", value: metrics?.totalCustomers ?? 0, icon: Users, loading: isLoading },
          { label: "Orders", value: metrics?.totalOrders ?? 0, icon: DollarSign, loading: isLoading },
          { label: "Products", value: metrics?.totalProducts ?? 0, icon: Package, loading: isLoading },
          { label: "Active Rewards", value: metrics?.totalLoyalty ?? 0, icon: Trophy, loading: isLoading },
        ].map(({ label, value, icon: Icon, loading }) => (
          <div key={label} className="border border-border/60 bg-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-silver/60">{label}</span>
            </div>
            <p className="text-2xl font-display font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickLinks.map(({ to, label, icon: Icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 p-4 border border-border/60 bg-card rounded-lg hover:border-primary transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{label}</p>
              <p className="text-xs text-silver/60 font-mono">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AdminUsers() {
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*, user_id").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: loyaltyData } = useQuery({
    queryKey: ["admin", "loyalty"],
    queryFn: async () => {
      const { data, error } = await supabase.from("loyalty_points").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = users?.filter((u: any) =>
    search === "" || u.user_id?.toLowerCase().includes(search.toLowerCase()) || u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-silver/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary"
          />
        </div>
        <span className="text-xs font-mono text-silver/60">{filtered?.length ?? 0} users</span>
      </div>

      <div className="border border-border/60 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60">User ID</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60">Role</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60">Points</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60">Tier</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-silver/60">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-silver/40" />
                  </td>
                </tr>
              ) : filtered && filtered.length > 0 ? (
                filtered.map((u: any) => {
                  const lp = loyaltyData?.find((l: any) => l.user_id === u.user_id);
                  return (
                    <tr key={u.id} className="border-t border-border/30 hover:bg-muted/50">
                      <td className="px-4 py-3 font-mono text-xs truncate max-w-[150px] sm:max-w-[200px]">{u.user_id}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-mono uppercase rounded-full ${
                          u.role === "admin" ? "bg-primary/20 text-primary" : "bg-muted text-silver/60"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{lp?.points ?? 0}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold uppercase" style={{ color: TIERS.find((t) => t.key === (lp?.tier ?? "bronze"))?.color }}>
                          {lp?.tier ?? "bronze"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-silver/60">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-silver/60">
                    <AlertCircle className="h-5 w-5 mx-auto mb-2 text-silver/40" />
                    <p className="text-sm">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminLoyalty() {
  const [searchUserId, setSearchUserId] = useState("");
  const [pointsToAdd, setPointsToAdd] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: loyaltyData, isLoading } = useQuery({
    queryKey: ["admin", "loyalty"],
    queryFn: async () => {
      const { data, error } = await supabase.from("loyalty_points").select("*").order("points", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: allRewards } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rewards").select("*").order("points_required", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const adjustPoints = useMutation({
    mutationFn: async ({ userId, delta }: { userId: string; delta: number }) => {
      const { data: existing } = await supabase.from("loyalty_points").select("*").eq("user_id", userId).maybeSingle();
      if (existing) {
        const newPoints = Math.max(0, existing.points + delta);
        const { error } = await supabase
          .from("loyalty_points")
          .update({
            points: newPoints,
            tier: getTierFromPoints(newPoints),
            total_earned: delta > 0 ? existing.total_earned + delta : existing.total_earned,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("loyalty_points").insert({
          user_id: userId,
          points: Math.max(0, delta),
          tier: getTierFromPoints(Math.max(0, delta)),
          total_earned: Math.max(0, delta),
          total_redeemed: 0,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "loyalty"] });
      queryClient.invalidateQueries({ queryKey: ["loyalty"] });
      toast.success("Points updated");
      setPointsToAdd("");
      setSearchUserId("");
      setSelectedUser(null);
    },
    onError: (e) => toast.error(sanitizeError(e)),
  });

  const filtered = loyaltyData?.filter((l: any) =>
    searchUserId === "" || l.user_id?.toLowerCase().includes(searchUserId.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Adjust Points */}
      <div className="border border-border/60 bg-card rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Adjust Points</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            placeholder="User ID (UUID)"
            className="flex-1 px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            value={pointsToAdd}
            onChange={(e) => setPointsToAdd(e.target.value)}
            placeholder="Points (+/-)"
            className="px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary w-full sm:w-32"
          />
          <button
            onClick={() => {
              if (!searchUserId || !pointsToAdd) return;
              adjustPoints.mutate({ userId: searchUserId, delta: parseInt(pointsToAdd, 10) });
            }}
            disabled={adjustPoints.isPending || !searchUserId || !pointsToAdd}
            className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {adjustPoints.isPending ? "Updating..." : "Adjust"}
          </button>
        </div>
      </div>

      {/* Rewards List */}
      <div className="border border-border/60 bg-card rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Active Rewards</h2>
        </div>
        {allRewards && allRewards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allRewards.map((reward: any) => (
              <div key={reward.id} className="border border-border/40 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold">{reward.title}</h3>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {reward.points_required} pts
                  </span>
                </div>
                <p className="text-xs text-silver/60 mt-1">{reward.description}</p>
                <span className="text-[10px] font-mono text-silver/40 mt-2 block">{reward.tier_unlocked} tier</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-silver/60">
            <Gift className="h-5 w-5 mx-auto mb-2" />
            <p className="text-sm">No rewards configured</p>
          </div>
        )}
      </div>

      {/* Loyalty Leaderboard */}
      <div className="border border-border/60 bg-card rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Loyalty Leaderboard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-mono uppercase text-silver/60">Rank</th>
                <th className="text-left px-3 py-2 text-xs font-mono uppercase text-silver/60">User</th>
                <th className="text-left px-3 py-2 text-xs font-mono uppercase text-silver/60">Points</th>
                <th className="text-left px-3 py-2 text-xs font-mono uppercase text-silver/60">Tier</th>
                <th className="text-left px-3 py-2 text-xs font-mono uppercase text-silver/60">Earned</th>
                <th className="text-left px-3 py-2 text-xs font-mono uppercase text-silver/60">Redeemed</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-silver/40" />
                  </td>
                </tr>
              ) : filtered && filtered.length > 0 ? (
                filtered.slice(0, 20).map((l: any, i: number) => (
                  <tr key={l.id} className="border-t border-border/30 hover:bg-muted/50">
                    <td className="px-3 py-2 font-bold text-primary">{i + 1}</td>
                    <td className="px-3 py-2 font-mono text-xs truncate max-w-[150px] sm:max-w-[200px]">{l.user_id}</td>
                    <td className="px-3 py-2 font-bold">{l.points}</td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-bold uppercase" style={{ color: TIERS.find((t) => t.key === l.tier)?.color }}>
                        {l.tier}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-silver/60">{l.total_earned}</td>
                    <td className="px-3 py-2 text-xs text-silver/60">{l.total_redeemed}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-silver/60">
                    <AlertCircle className="h-5 w-5 mx-auto mb-2 text-silver/40" />
                    No loyalty data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSetting();
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  const save = async (key: string) => {
    try {
      await updateSetting.mutateAsync({
        key: key as keyof typeof SETTING_LABELS,
        value: draft[key] ?? "",
      });
      toast.success(`Saved ${SETTING_LABELS[key as keyof typeof SETTING_LABELS]}`);
    } catch (e) {
      toast.error(sanitizeError(e));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="font-display font-bold text-lg">Site Settings</h2>
      </div>
      <div className="space-y-4">
        {SETTING_KEYS.map((key) => (
          <div key={key} className="border border-border/60 bg-card rounded-lg p-4">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
              {SETTING_LABELS[key]}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={draft[key] ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                placeholder="—"
                className="flex-1 px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 rounded-md focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => save(key)}
                disabled={updateSetting.isPending || draft[key] === settings?.[key]}
                className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NonAdminGate({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const adminExistsFn = useServerFn(adminExists);
  const claimFn = useServerFn(claimFirstAdmin);
  const { data, isLoading } = useQuery({
    queryKey: ["admin_exists"],
    queryFn: () => adminExistsFn(),
  });
  const claim = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: () => {
      toast.success("You're now an admin. Refreshing...");
      queryClient.invalidateQueries();
      setTimeout(() => window.location.reload(), 600);
    },
    onError: (e) => toast.error(sanitizeError(e)),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-md mx-auto px-4 md:px-6 py-16 text-center">
        <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="font-display font-black text-3xl mb-3">Admin only</h1>
        {isLoading ? (
          <p className="text-silver/60 font-mono text-xs">Checking...</p>
        ) : data?.exists ? (
          <>
            <p className="text-silver/70 text-sm mb-2">
              Your account isn't an admin yet. Share your user ID with an existing admin:
            </p>
            <code className="block bg-card border border-border/60 p-3 text-xs font-mono break-all mb-4 rounded-md">
              {userId}
            </code>
          </>
        ) : (
          <>
            <p className="text-silver/70 text-sm mb-6">No admins exist yet. Claim the first admin slot.</p>
            <button
              onClick={() => claim.mutate()}
              disabled={claim.isPending}
              className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-md hover:opacity-90 disabled:opacity-40"
            >
              {claim.isPending ? "Claiming..." : "Make me admin"}
            </button>
          </>
        )}
        <Link
          to="/account"
          className="block mt-8 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary"
        >
          Back to account
        </Link>
      </main>
      <Footer />
    </div>
  );
}

function getTierFromPoints(points: number): string {
  if (points >= 1500) return "platinum";
  if (points >= 500) return "gold";
  if (points >= 100) return "silver";
  return "bronze";
}

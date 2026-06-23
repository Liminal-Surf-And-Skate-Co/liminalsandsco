import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Shield, Package, Mail, Calendar, Settings as SettingsIcon } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import {
  useSiteSettings,
  useUpdateSetting,
  SETTING_KEYS,
  SETTING_LABELS,
} from "@/lib/site-settings";
import { adminExists, claimFirstAdmin } from "@/lib/admin.functions";
import { toast } from "sonner";
import { sanitizeError } from "@/lib/error-sanitize";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSetting();
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="max-w-3xl mx-auto px-6 py-24 text-center text-silver/60 font-mono text-xs">
          Loading…
        </main>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return <NonAdminGate userId={user.id} />;
  }

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
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">Admin</p>
          <h1 className="font-display font-black text-5xl">Dashboard</h1>
          <p className="text-silver/70 text-sm mt-3">
            Manage products, newsletters, and site-wide settings.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <Link
            to="/admin/products"
            className="group block border border-border/60 bg-card hover:border-primary p-5 transition-colors"
          >
            <Package className="h-6 w-6 text-primary mb-3" />
            <h2 className="font-display font-bold text-xl mb-1">Products</h2>
            <p className="font-mono text-xs text-silver/60">
              Create, edit, and stock the shop catalog.
            </p>
          </Link>
          <Link
            to="/admin/newsletters"
            className="group block border border-border/60 bg-card hover:border-primary p-5 transition-colors"
          >
            <Mail className="h-6 w-6 text-primary mb-3" />
            <h2 className="font-display font-bold text-xl mb-1">Newsletters</h2>
            <p className="font-mono text-xs text-silver/60">
              Compose weekly drops and archive past sends.
            </p>
          </Link>
          <Link
            to="/admin/events"
            className="group block border border-border/60 bg-card hover:border-primary p-5 transition-colors"
          >
            <Calendar className="h-6 w-6 text-primary mb-3" />
            <h2 className="font-display font-bold text-xl mb-1">Events</h2>
            <p className="font-mono text-xs text-silver/60">
              Add, edit, and publish community events.
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="h-4 w-4 text-primary" />
          <h2 className="font-display font-bold text-2xl">Site settings</h2>
        </div>

        <div className="space-y-4">
          {SETTING_KEYS.map((key) => (
            <div key={key} className="border border-border/60 bg-card p-4">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                {SETTING_LABELS[key]}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft[key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  placeholder="—"
                  className="flex-1 px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => save(key)}
                  disabled={updateSetting.isPending || draft[key] === settings?.[key]}
                  className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 hover:opacity-90 disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border border-border/60 bg-card/40 p-6">
          <h2 className="font-display font-bold text-xl mb-2">Coming in next phases</h2>
          <ul className="text-silver/70 text-sm space-y-1 list-disc list-inside font-mono text-xs">
            <li>Products CRUD & mega-nav</li>
            <li>Events calendar</li>
            <li>Reviews & video submissions moderation</li>
            <li>Crew profiles</li>
            <li>Newsletter composer & subscriber list</li>
          </ul>
        </div>

        <Link
          to="/account"
          className="mt-8 inline-block font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary"
        >
          ← Back to account
        </Link>
      </main>
      <Footer />
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
      toast.success("You're now an admin. Refreshing…");
      queryClient.invalidateQueries();
      setTimeout(() => window.location.reload(), 600);
    },
    onError: (e) => toast.error(sanitizeError(e)),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-md mx-auto px-6 py-24 text-center">
        <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="font-display font-black text-3xl mb-3">Admin only</h1>

        {isLoading ? (
          <p className="text-silver/60 font-mono text-xs">Checking…</p>
        ) : data?.exists ? (
          <>
            <p className="text-silver/70 text-sm mb-2">
              Your account isn't an admin yet. Share your user ID with an existing admin:
            </p>
            <code className="block bg-card border border-border/60 p-3 text-xs font-mono break-all mb-4">
              {userId}
            </code>
          </>
        ) : (
          <>
            <p className="text-silver/70 text-sm mb-6">
              No admins exist yet. Claim the first admin slot for this site.
            </p>
            <button
              onClick={() => claim.mutate()}
              disabled={claim.isPending}
              className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-6 py-3 hover:opacity-90 disabled:opacity-40"
            >
              {claim.isPending ? "Claiming…" : "Make me admin"}
            </button>
          </>
        )}

        <Link
          to="/account"
          className="block mt-8 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary"
        >
          ← Back to account
        </Link>
      </main>
      <Footer />
    </div>
  );
}

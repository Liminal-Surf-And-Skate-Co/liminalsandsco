import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useSiteSettings, useUpdateSetting, SETTING_KEYS, SETTING_LABELS } from "@/lib/site-settings";
import { toast } from "sonner";

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
        <main className="max-w-3xl mx-auto px-6 py-24 text-center text-silver/60 font-mono text-xs">Loading…</main>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="max-w-md mx-auto px-6 py-24 text-center">
          <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-display font-black text-3xl mb-3">Admin only</h1>
          <p className="text-silver/70 text-sm mb-2">
            Your account isn't an admin yet. Your user ID:
          </p>
          <code className="block bg-card border border-border/60 p-3 text-xs font-mono break-all mb-4">
            {user.id}
          </code>
          <p className="text-silver/70 text-xs">
            Ask the project owner to grant you admin in Lovable Cloud → SQL editor:
          </p>
          <code className="block bg-card border border-border/60 p-3 text-xs font-mono break-all mt-2 text-left">
            insert into public.user_roles(user_id, role) values ('{user.id}', 'admin');
          </code>
        </main>
        <Footer />
      </div>
    );
  }

  const save = async (key: string) => {
    try {
      await updateSetting.mutateAsync({ key: key as any, value: draft[key] ?? "" });
      toast.success(`Saved ${SETTING_LABELS[key as keyof typeof SETTING_LABELS]}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">Admin</p>
          <h1 className="font-display font-black text-5xl">Site settings</h1>
          <p className="text-silver/70 text-sm mt-3">
            Update social links, contact emails, and integration URLs. Saved instantly.
          </p>
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

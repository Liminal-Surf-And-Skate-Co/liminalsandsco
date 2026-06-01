import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Mail } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useNewsletters, type Newsletter } from "@/lib/newsletters";

export const Route = createFileRoute("/admin/newsletters")({
  head: () => ({ meta: [{ title: "Admin · Newsletters — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: AdminNewslettersPage,
});

function AdminNewslettersPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: newsletters } = useNewsletters();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Newsletter> | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  const save = useMutation({
    mutationFn: async (n: Partial<Newsletter>) => {
      const payload: any = {
        subject: n.subject,
        excerpt: n.excerpt || null,
        body: n.body || "",
        sent_at: n.sent_at || new Date().toISOString(),
      };
      if (n.id) {
        const { error } = await supabase.from("newsletters").update(payload).eq("id", n.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("newsletters").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsletters"] });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message || "Save failed"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("newsletters").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["newsletters"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message || "Delete failed"),
  });

  if (loading) return <div className="min-h-screen bg-background"><Nav /><main className="py-24 text-center font-mono text-xs text-silver/60">Loading…</main></div>;
  if (!user) return null;
  if (!isAdmin) return (
    <div className="min-h-screen bg-background"><Nav />
      <main className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-silver/70">Admin only.</p>
        <Link to="/admin" className="font-mono text-[10px] uppercase tracking-widest text-primary mt-4 inline-block">← Admin home</Link>
      </main><Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2">Admin</p>
            <h1 className="font-display font-black text-4xl flex items-center gap-3"><Mail className="h-8 w-8" /> Newsletters</h1>
            <p className="text-silver/70 text-sm mt-2">Compose, archive, and publish to the blog news section.</p>
          </div>
          <button
            onClick={() => setEditing({ subject: "", body: "", excerpt: "", sent_at: new Date().toISOString() })}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-3 hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New issue
          </button>
        </div>

        <div className="grid gap-3">
          {(newsletters ?? []).map((n) => (
            <div key={n.id} className="border border-border/60 bg-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  {new Date(n.sent_at).toLocaleDateString("en-AU", { month: "short", day: "2-digit", year: "numeric" })}
                </p>
                <h3 className="font-display font-bold">{n.subject}</h3>
                {n.excerpt && <p className="text-xs text-silver/60 line-clamp-1">{n.excerpt}</p>}
              </div>
              <button onClick={() => setEditing(n)} className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-primary">Edit</button>
              <button onClick={() => { if (confirm("Delete this issue?")) del.mutate(n.id); }} className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <Link to="/admin" className="mt-10 inline-block font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary">← Admin home</Link>
      </main>

      {editing && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur flex justify-end">
          <div className="w-full max-w-xl h-full bg-background border-l border-border/60 overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border/60 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display font-black text-xl">{editing.id ? "Edit issue" : "New issue"}</h2>
              <button onClick={() => setEditing(null)} className="font-mono text-[10px] uppercase tracking-widest text-silver/60">Close</button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Subject">
                <input value={editing.subject ?? ""} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary" />
              </Field>
              <Field label="Excerpt (shown in archive)">
                <input value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary" />
              </Field>
              <Field label="Send date">
                <input
                  type="date"
                  value={(editing.sent_at ?? new Date().toISOString()).slice(0, 10)}
                  onChange={(e) => setEditing({ ...editing, sent_at: new Date(e.target.value).toISOString() })}
                  className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary"
                />
              </Field>
              <Field label="Body (plain text, blank line = paragraph break)">
                <textarea rows={14} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary font-mono" />
              </Field>
            </div>
            <div className="sticky bottom-0 bg-background border-t border-border/60 px-6 py-4 flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 font-mono text-xs uppercase tracking-widest px-4 py-3 border border-border/60 text-silver hover:border-primary">Cancel</button>
              <button
                onClick={() => save.mutate(editing)}
                disabled={save.isPending || !editing.subject}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-3 hover:opacity-90 disabled:opacity-40"
              >
                <Save className="h-4 w-4" /> {save.isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">{label}</label>
      {children}
    </div>
  );
}

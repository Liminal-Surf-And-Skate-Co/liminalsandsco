import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Mail, CalendarClock, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useNewsletters, nextFridayISO, type Newsletter, type NewsletterLink } from "@/lib/newsletters";

export const Route = createFileRoute("/admin/newsletters")({
  head: () => ({ meta: [{ title: "Admin · Newsletters — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: AdminNewslettersPage,
});

type EditState = Partial<Newsletter> & { _links?: NewsletterLink[] };

function AdminNewslettersPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: newsletters } = useNewsletters();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<EditState | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  const save = useMutation({
    mutationFn: async (n: EditState) => {
      const payload: any = {
        subject: n.subject,
        excerpt: n.excerpt || null,
        body: n.body || "",
        sent_at: n.sent_at || new Date().toISOString(),
        scheduled_for: n.scheduled_for || null,
        cover_image: n.cover_image || null,
        links: n.links ?? [],
        published: n.published ?? true,
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

  const newDraft = (): EditState => {
    const friday = nextFridayISO();
    return {
      subject: "", body: "", excerpt: "", cover_image: "",
      sent_at: friday, scheduled_for: friday,
      links: [], published: true,
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2">Admin</p>
            <h1 className="font-display font-black text-4xl flex items-center gap-3"><Mail className="h-8 w-8" /> Newsletters</h1>
            <p className="text-silver/70 text-sm mt-2">Compose, schedule for Friday, and publish to the blog news archive.</p>
          </div>
          <button
            onClick={() => setEditing(newDraft())}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-3 hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New issue
          </button>
        </div>

        <div className="grid gap-3">
          {(newsletters ?? []).map((n) => {
            const scheduled = n.scheduled_for && new Date(n.scheduled_for) > new Date();
            return (
              <div key={n.id} className="border border-border/60 bg-card p-4 flex items-center gap-4">
                {n.cover_image && (
                  <img src={n.cover_image} alt="" className="h-14 w-14 object-cover border border-border/40 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
                      {new Date(n.scheduled_for ?? n.sent_at).toLocaleDateString("en-AU", { month: "short", day: "2-digit", year: "numeric" })}
                    </p>
                    {scheduled && (
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/40 text-amber-300">
                        <CalendarClock className="h-2.5 w-2.5" /> Scheduled
                      </span>
                    )}
                    {!n.published && (
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase px-1.5 py-0.5 bg-silver/20 border border-silver/40 text-silver">
                        <EyeOff className="h-2.5 w-2.5" /> Draft
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold truncate">{n.subject}</h3>
                  {n.excerpt && <p className="text-xs text-silver/60 line-clamp-1">{n.excerpt}</p>}
                </div>
                <button onClick={() => setEditing(n)} className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-primary">Edit</button>
                <button onClick={() => { if (confirm("Delete this issue?")) del.mutate(n.id); }} className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            );
          })}
          {newsletters && newsletters.length === 0 && (
            <div className="border border-dashed border-border/60 p-12 text-center font-mono text-xs uppercase tracking-widest text-silver/60">
              No issues yet. Compose the first weekly letter.
            </div>
          )}
        </div>
        <Link to="/admin" className="mt-10 inline-block font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary">← Admin home</Link>
      </main>

      {editing && (
        <Composer
          value={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={() => save.mutate(editing)}
          saving={save.isPending}
        />
      )}
      <Footer />
    </div>
  );
}

function Composer({
  value, onChange, onClose, onSave, saving,
}: {
  value: EditState;
  onChange: (v: EditState) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const set = (patch: Partial<EditState>) => onChange({ ...value, ...patch });
  const links = value.links ?? [];
  const updateLink = (i: number, patch: Partial<NewsletterLink>) => {
    const next = links.slice();
    next[i] = { ...next[i], ...patch };
    set({ links: next });
  };
  const removeLink = (i: number) => set({ links: links.filter((_, idx) => idx !== i) });
  const addLink = () => set({ links: [...links, { label: "", url: "" }] });

  const scheduledDate = value.scheduled_for ? new Date(value.scheduled_for) : new Date();
  const dateValue = scheduledDate.toISOString().slice(0, 10);
  const timeValue = scheduledDate.toISOString().slice(11, 16);

  const updateSchedule = (date: string, time: string) => {
    const iso = new Date(`${date}T${time}:00`).toISOString();
    set({ scheduled_for: iso, sent_at: iso });
  };

  const isFriday = scheduledDate.getDay() === 5;

  return (
    <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur flex justify-end">
      <div className="w-full max-w-2xl h-full bg-background border-l border-border/60 overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border/60 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display font-black text-xl">{value.id ? "Edit issue" : "New issue"}</h2>
          <button onClick={onClose} className="font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary">Close</button>
        </div>
        <div className="p-6 space-y-5">
          <Field label="Subject">
            <input value={value.subject ?? ""} onChange={(e) => set({ subject: e.target.value })} className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary" />
          </Field>

          <Field label="Cover image URL (for blog archive)">
            <input value={value.cover_image ?? ""} onChange={(e) => set({ cover_image: e.target.value })} placeholder="https://…" className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary" />
            {value.cover_image && (
              <img src={value.cover_image} alt="Preview" className="mt-2 max-h-40 border border-border/40" />
            )}
          </Field>

          <Field label="Excerpt (shown in archive)">
            <input value={value.excerpt ?? ""} onChange={(e) => set({ excerpt: e.target.value })} className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Send / publish date">
              <input
                type="date"
                value={dateValue}
                onChange={(e) => updateSchedule(e.target.value, timeValue)}
                className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary"
              />
            </Field>
            <Field label="Time (24h, UTC)">
              <input
                type="time"
                value={timeValue}
                onChange={(e) => updateSchedule(dateValue, e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary"
              />
            </Field>
          </div>
          <div className="flex items-center justify-between -mt-2">
            <p className={`font-mono text-[10px] uppercase tracking-widest ${isFriday ? "text-primary" : "text-amber-400"}`}>
              {isFriday ? "✓ Friday" : "Not a Friday — adjust if needed"}
            </p>
            <button
              type="button"
              onClick={() => { const f = nextFridayISO(); set({ scheduled_for: f, sent_at: f }); }}
              className="font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70"
            >
              Snap to next Friday
            </button>
          </div>

          <Field label="Published">
            <button
              type="button"
              onClick={() => set({ published: !(value.published ?? true) })}
              className={`inline-flex items-center gap-2 px-3 py-2 border font-mono text-xs uppercase tracking-widest ${
                (value.published ?? true)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-silver"
              }`}
            >
              {(value.published ?? true) ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {(value.published ?? true) ? "Live in archive" : "Draft (hidden)"}
            </button>
          </Field>

          <Field label="Body (plain text · blank line = paragraph break · paste image URLs on their own line to embed)">
            <textarea rows={14} value={value.body ?? ""} onChange={(e) => set({ body: e.target.value })} className="w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary font-mono" />
          </Field>

          <Field label="Related links">
            <div className="space-y-2">
              {links.map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(i, { label: e.target.value })}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary"
                  />
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(i, { url: e.target.value })}
                    placeholder="https://…"
                    className="flex-[2] px-3 py-2 bg-card border border-border/60 text-sm text-silver focus:outline-none focus:border-primary"
                  />
                  <button onClick={() => removeLink(i)} className="h-9 w-9 flex items-center justify-center text-silver/60 hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-primary"
              >
                <Plus className="h-3 w-3" /> Add link
              </button>
            </div>
          </Field>
        </div>
        <div className="sticky bottom-0 bg-background border-t border-border/60 px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 font-mono text-xs uppercase tracking-widest px-4 py-3 border border-border/60 text-silver hover:border-primary">Cancel</button>
          <button
            onClick={onSave}
            disabled={saving || !value.subject}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-3 hover:opacity-90 disabled:opacity-40"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
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

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Plus, Trash2, Pencil, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { sanitizeError } from "@/lib/error-sanitize";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import {
  useEvents,
  useUpsertEvent,
  useDeleteEvent,
  EVENT_CATEGORY_LABELS,
  type CommunityEvent,
  type EventCategory,
  formatEventDate,
} from "@/lib/events";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [{ title: "Events Admin — Liminal" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminEventsPage,
});

const empty = {
  title: "",
  description: "",
  location: "",
  start_at: "",
  end_at: "",
  image_url: "",
  rsvp_url: "",
  category: "jam" as EventCategory,
  published: true,
};

function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
}

function AdminEventsPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: events = [], isLoading } = useEvents({ includeUnpublished: true });
  const upsert = useUpsertEvent();
  const del = useDeleteEvent();
  const [draft, setDraft] = useState<typeof empty & { id?: string }>(empty);
  const editing = Boolean(draft.id);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  if (loading || !user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="max-w-md mx-auto px-6 py-24 text-center text-silver/70 font-mono text-xs">
          Admins only.
        </main>
      </div>
    );
  }

  function startEdit(e: CommunityEvent) {
    setDraft({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      start_at: toLocalInput(e.start_at),
      end_at: toLocalInput(e.end_at),
      image_url: e.image_url ?? "",
      rsvp_url: e.rsvp_url ?? "",
      category: e.category,
      published: e.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    if (!draft.title || !draft.start_at) {
      toast.error("Title and start time are required");
      return;
    }
    try {
      await upsert.mutateAsync({
        ...draft,
        start_at: new Date(draft.start_at).toISOString(),
        end_at: draft.end_at ? new Date(draft.end_at).toISOString() : null,
      });
      toast.success(editing ? "Event updated" : "Event created");
      setDraft(empty);
    } catch (e) {
      toast.error(sanitizeError(e));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await del.mutateAsync(id);
      toast.success("Event deleted");
      if (draft.id === id) setDraft(empty);
    } catch (e) {
      toast.error(sanitizeError(e));
    }
  }

  async function togglePublished(e: CommunityEvent) {
    try {
      await upsert.mutateAsync({ ...e, published: !e.published });
      toast.success(e.published ? "Event hidden" : "Event published");
    } catch (err) {
      toast.error(sanitizeError(err));
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> Back to admin
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-4xl">Events</h1>
        </div>

        <form onSubmit={save} className="border border-border/60 bg-card p-6 mb-12 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl">
              {editing ? "Edit event" : "New event"}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={() => setDraft(empty)}
                className="font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Title *">
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className={inputCls}
                required
              />
            </Field>
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as EventCategory })}
                className={inputCls}
              >
                {Object.entries(EVENT_CATEGORY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Start *">
              <input
                type="datetime-local"
                value={draft.start_at}
                onChange={(e) => setDraft({ ...draft, start_at: e.target.value })}
                className={inputCls}
                required
              />
            </Field>
            <Field label="End">
              <input
                type="datetime-local"
                value={draft.end_at}
                onChange={(e) => setDraft({ ...draft, end_at: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Location" className="sm:col-span-2">
              <input
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                placeholder="Riverside Bowls, City"
                className={inputCls}
              />
            </Field>
            <Field label="Image URL" className="sm:col-span-2">
              <input
                value={draft.image_url}
                onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                placeholder="https://…"
                className={inputCls}
              />
            </Field>
            <Field label="RSVP URL (Discord, form, etc.)" className="sm:col-span-2">
              <input
                value={draft.rsvp_url}
                onChange={(e) => setDraft({ ...draft, rsvp_url: e.target.value })}
                placeholder="https://discord.gg/…"
                className={inputCls}
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={3}
                className={inputCls}
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 font-mono text-xs text-silver/80">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              className="accent-primary"
            />
            Published (visible to public)
          </label>

          <button
            type="submit"
            disabled={upsert.isPending}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-5 py-3 hover:opacity-90 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create event"}
          </button>
        </form>

        <h2 className="font-display font-bold text-2xl mb-4">All events ({events.length})</h2>
        {isLoading ? (
          <p className="font-mono text-xs text-silver/60">Loading…</p>
        ) : events.length === 0 ? (
          <p className="font-mono text-xs text-silver/60">
            No events yet — create your first above.
          </p>
        ) : (
          <ul className="divide-y divide-border/40 border-y border-border/40">
            {events.map((e) => {
              const { date, time } = formatEventDate(e.start_at);
              return (
                <li key={e.id} className="py-4 flex gap-4 items-center">
                  <div className="font-mono text-xs text-silver/70 w-32 shrink-0">
                    {date}
                    <br />
                    <span className="text-silver/50">{time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-primary">
                      {EVENT_CATEGORY_LABELS[e.category]}
                      {!e.published && " · HIDDEN"}
                    </p>
                    <p className="font-display font-bold truncate">{e.title}</p>
                    <p className="font-mono text-xs text-silver/60 truncate">{e.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublished(e)}
                      title={e.published ? "Hide" : "Publish"}
                      className="p-2 border border-border/60 hover:border-primary text-silver hover:text-primary"
                    >
                      {e.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(e)}
                      className="p-2 border border-border/60 hover:border-primary text-silver hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(e.id)}
                      className="p-2 border border-border/60 hover:border-destructive text-silver hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block font-mono text-[10px] uppercase tracking-widest text-primary mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

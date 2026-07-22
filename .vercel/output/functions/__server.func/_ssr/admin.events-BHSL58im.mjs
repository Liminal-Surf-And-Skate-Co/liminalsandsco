import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { o as useAuth, O as useEvents, Q as useUpsertEvent, T as useDeleteEvent, N as Nav, U as EVENT_CATEGORY_LABELS, V as formatEventDate, F as Footer, q as sanitizeError } from "./router-BkwgZ6Uu.mjs";
import { O as ArrowLeft, f as Calendar, d as Plus, a9 as Eye, aa as EyeOff, ab as Pencil, a7 as Trash2 } from "../_libs/lucide-react.mjs";
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
import "./client-DYwJbDLa.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/date-fns.mjs";
const empty = {
  title: "",
  description: "",
  location: "",
  start_at: "",
  end_at: "",
  image_url: "",
  rsvp_url: "",
  category: "jam",
  published: true
};
function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 6e4).toISOString().slice(0, 16);
}
function AdminEventsPage() {
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const {
    data: events = [],
    isLoading
  } = useEvents({
    includeUnpublished: true
  });
  const upsert = useUpsertEvent();
  const del = useDeleteEvent();
  const [draft, setDraft] = reactExports.useState(empty);
  const editing = Boolean(draft.id);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/account"
    });
  }, [loading, user, navigate]);
  if (loading || !user) return null;
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-md mx-auto px-6 py-24 text-center text-silver/70 font-mono text-xs", children: "Admins only." })
    ] });
  }
  function startEdit(e) {
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
      published: e.published
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  async function save(ev) {
    ev.preventDefault();
    if (!draft.title || !draft.start_at) {
      toast.error("Title and start time are required");
      return;
    }
    try {
      await upsert.mutateAsync({
        ...draft,
        start_at: new Date(draft.start_at).toISOString(),
        end_at: draft.end_at ? new Date(draft.end_at).toISOString() : null
      });
      toast.success(editing ? "Event updated" : "Event created");
      setDraft(empty);
    } catch (e) {
      toast.error(sanitizeError(e));
    }
  }
  async function remove(id) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await del.mutateAsync(id);
      toast.success("Event deleted");
      if (draft.id === id) setDraft(empty);
    } catch (e) {
      toast.error(sanitizeError(e));
    }
  }
  async function togglePublished(e) {
    try {
      await upsert.mutateAsync({
        ...e,
        published: !e.published
      });
      toast.success(e.published ? "Event hidden" : "Event published");
    } catch (err) {
      toast.error(sanitizeError(err));
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-5xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
        " Back to admin"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl", children: "Events" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "border border-border/60 bg-card p-6 mb-12 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl", children: editing ? "Edit event" : "New event" }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDraft(empty), className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary", children: "Cancel edit" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title *", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft.title, onChange: (e) => setDraft({
            ...draft,
            title: e.target.value
          }), className: inputCls, required: true }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: draft.category, onChange: (e) => setDraft({
            ...draft,
            category: e.target.value
          }), className: inputCls, children: Object.entries(EVENT_CATEGORY_LABELS).map(([v, l]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v, children: l }, v)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Start *", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: draft.start_at, onChange: (e) => setDraft({
            ...draft,
            start_at: e.target.value
          }), className: inputCls, required: true }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "End", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: draft.end_at, onChange: (e) => setDraft({
            ...draft,
            end_at: e.target.value
          }), className: inputCls }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Location", className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft.location, onChange: (e) => setDraft({
            ...draft,
            location: e.target.value
          }), placeholder: "Riverside Bowls, City", className: inputCls }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Image URL", className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft.image_url, onChange: (e) => setDraft({
            ...draft,
            image_url: e.target.value
          }), placeholder: "https://…", className: inputCls }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "RSVP URL (Discord, form, etc.)", className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft.rsvp_url, onChange: (e) => setDraft({
            ...draft,
            rsvp_url: e.target.value
          }), placeholder: "https://discord.gg/…", className: inputCls }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: draft.description, onChange: (e) => setDraft({
            ...draft,
            description: e.target.value
          }), rows: 3, className: inputCls }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 font-mono text-xs text-silver/80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: draft.published, onChange: (e) => setDraft({
            ...draft,
            published: e.target.checked
          }), className: "accent-primary" }),
          "Published (visible to public)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: upsert.isPending, className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-5 py-3 hover:opacity-90 disabled:opacity-40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " ",
          editing ? "Save changes" : "Create event"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-2xl mb-4", children: [
        "All events (",
        events.length,
        ")"
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60", children: "Loading…" }) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60", children: "No events yet — create your first above." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 border-y border-border/40", children: events.map((e) => {
        const {
          date,
          time
        } = formatEventDate(e.start_at);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-4 flex gap-4 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-silver/70 w-32 shrink-0", children: [
            date,
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-silver/50", children: time })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] uppercase tracking-widest text-primary", children: [
              EVENT_CATEGORY_LABELS[e.category],
              !e.published && " · HIDDEN"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold truncate", children: e.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60 truncate", children: e.location })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => togglePublished(e), title: e.published ? "Hide" : "Publish", className: "p-2 border border-border/60 hover:border-primary text-silver hover:text-primary", children: e.published ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startEdit(e), className: "p-2 border border-border/60 hover:border-primary text-silver hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(e.id), className: "p-2 border border-border/60 hover:border-destructive text-silver hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }, e.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const inputCls = "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary";
function Field({
  label,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `block ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-mono text-[10px] uppercase tracking-widest text-primary mb-1", children: label }),
    children
  ] });
}
export {
  AdminEventsPage as component
};

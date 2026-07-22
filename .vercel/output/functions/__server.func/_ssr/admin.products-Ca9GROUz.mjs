import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as useAuth, u as useProducts, g as sanitizeError, N as Nav, F as Footer, D as DEPARTMENT_LABELS, A as ALL_DEPARTMENTS } from "./router-BcrAlKxT.mjs";
import { s as supabase } from "./client-DYwJbDLa.mjs";
import { P as Package, d as Plus, a8 as Trash2, ad as Save } from "../_libs/lucide-react.mjs";
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
function AdminProductsPage() {
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const {
    data: products
  } = useProducts();
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/account"
    });
  }, [loading, user, navigate]);
  const saveMutation = useMutation({
    mutationFn: async (p) => {
      const payload = {
        slug: p.slug,
        title: p.title,
        department: p.department,
        product_type: p.product_type || null,
        target_group: p.target_group || "unisex",
        description: p.description || "",
        details: p.details ?? [],
        price: Number(p.price ?? 0),
        sale_price: p.sale_price ? Number(p.sale_price) : null,
        colour: p.colour || null,
        sizes: p.sizes ?? [],
        stock_count: Number(p.stock_count ?? 0),
        images: p.images ?? [],
        tags: p.tags ?? [],
        specs: p.specs ?? {},
        featured: Boolean(p.featured)
      };
      if (p.id) {
        const {
          error
        } = await supabase.from("products").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["products"]
      });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e) => toast.error(sanitizeError(e))
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["products"]
      });
      toast.success("Deleted");
    },
    onError: (e) => toast.error(sanitizeError(e))
  });
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-3xl mx-auto px-6 py-24 text-center text-silver/60 font-mono text-xs", children: "Loading…" })
    ] });
  }
  if (!user) return null;
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-md mx-auto px-6 py-24 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-silver/70", children: "Admin only." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "font-mono text-[10px] uppercase tracking-widest text-primary mt-4 inline-block", children: "← Admin home" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-6xl mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2", children: "Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-4xl flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8" }),
            " Products"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
          department: "skate",
          price: 0,
          stock_count: 0,
          sizes: [],
          images: [],
          tags: [],
          details: [],
          specs: {}
        }), className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-3 hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " New product"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: (products ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-4 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: [
            DEPARTMENT_LABELS[p.department],
            p.product_type ? ` · ${p.product_type}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-silver/60", children: [
            p.slug,
            " · $",
            p.price,
            p.sale_price ? ` → $${p.sale_price}` : "",
            " · stock ",
            p.stock_count
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(p), className: "font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-primary", children: "Edit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (confirm(`Delete "${p.title}"?`)) deleteMutation.mutate(p.id);
        }, className: "font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-destructive hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
      ] }, p.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "mt-10 inline-block font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary", children: "← Admin home" })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(EditDrawer, { product: editing, onClose: () => setEditing(null), onSave: (p) => saveMutation.mutate(p), saving: saveMutation.isPending }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function EditDrawer({
  product,
  onClose,
  onSave,
  saving
}) {
  const [draft, setDraft] = reactExports.useState(product);
  const set = (k, v) => setDraft((d) => ({
    ...d,
    [k]: v
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[70] bg-background/80 backdrop-blur flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xl h-full bg-background border-l border-border/60 overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 bg-background border-b border-border/60 px-6 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-xl", children: draft.id ? "Edit product" : "New product" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "font-mono text-[10px] uppercase tracking-widest text-silver/60", children: "Close" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft.title ?? "", onChange: (e) => set("title", e.target.value), className: INPUT }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Slug (URL)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft.slug ?? "", onChange: (e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")), className: INPUT, placeholder: "e.g. street-decks" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Department", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: draft.department ?? "skate", onChange: (e) => set("department", e.target.value), className: INPUT, children: ALL_DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d, children: DEPARTMENT_LABELS[d] }, d)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Type", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft.product_type ?? "", onChange: (e) => set("product_type", e.target.value), className: INPUT, placeholder: "e.g. deck, hoodie" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, value: draft.description ?? "", onChange: (e) => set("description", e.target.value), className: INPUT }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Price", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: draft.price ?? 0, onChange: (e) => set("price", Number(e.target.value)), className: INPUT }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sale price", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: draft.sale_price ?? "", onChange: (e) => set("sale_price", e.target.value ? Number(e.target.value) : null), className: INPUT }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Stock", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: draft.stock_count ?? 0, onChange: (e) => set("stock_count", Number(e.target.value)), className: INPUT }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sizes (comma separated)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: (draft.sizes ?? []).join(", "), onChange: (e) => set("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean)), className: INPUT, placeholder: "S, M, L, XL" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Image URLs (one per line)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, value: (draft.images ?? []).join("\n"), onChange: (e) => set("images", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)), className: INPUT, placeholder: "https://…" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tags (comma separated · use new, sale, limited, low_stock)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: (draft.tags ?? []).join(", "), onChange: (e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean)), className: INPUT }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Bullet details (one per line)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, value: (draft.details ?? []).join("\n"), onChange: (e) => set("details", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)), className: INPUT }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: 'Specs (JSON, e.g. {"width":"8.0"})', children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, value: JSON.stringify(draft.specs ?? {}, null, 2), onChange: (e) => {
        try {
          set("specs", JSON.parse(e.target.value));
        } catch {
        }
      }, className: `${INPUT} font-mono text-xs` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-silver/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: Boolean(draft.featured), onChange: (e) => set("featured", e.target.checked) }),
        "Featured on homepage"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 bg-background border-t border-border/60 px-6 py-4 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "flex-1 font-mono text-xs uppercase tracking-widest px-4 py-3 border border-border/60 text-silver hover:border-primary", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSave(draft), disabled: saving || !draft.title || !draft.slug, className: "flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-3 hover:opacity-90 disabled:opacity-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        " ",
        saving ? "Saving…" : "Save"
      ] })
    ] })
  ] }) });
}
const INPUT = "w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: label }),
    children
  ] });
}
export {
  AdminProductsPage as component
};

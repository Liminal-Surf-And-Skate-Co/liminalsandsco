import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Package } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, ALL_DEPARTMENTS, DEPARTMENT_LABELS, type Product } from "@/lib/products";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Admin · Products — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: products } = useProducts();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  const saveMutation = useMutation({
    mutationFn: async (p: Partial<Product>) => {
      const payload: any = {
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
        featured: Boolean(p.featured),
      };
      if (p.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message || "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message || "Delete failed"),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Nav />
        <main className="max-w-3xl mx-auto px-6 py-24 text-center text-silver/60 font-mono text-xs">Loading…</main>
      </div>
    );
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background"><Nav />
        <main className="max-w-md mx-auto px-6 py-24 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-silver/70">Admin only.</p>
          <Link to="/admin" className="font-mono text-[10px] uppercase tracking-widest text-primary mt-4 inline-block">← Admin home</Link>
        </main><Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2">Admin</p>
            <h1 className="font-display font-black text-4xl flex items-center gap-3"><Package className="h-8 w-8" /> Products</h1>
          </div>
          <button
            onClick={() => setEditing({ department: "skate", price: 0, stock_count: 0, sizes: [], images: [], tags: [], details: [], specs: {} })}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-3 hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New product
          </button>
        </div>

        <div className="grid gap-3">
          {(products ?? []).map((p) => (
            <div key={p.id} className="border border-border/60 bg-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary">{DEPARTMENT_LABELS[p.department]}{p.product_type ? ` · ${p.product_type}` : ""}</p>
                <h3 className="font-display font-bold">{p.title}</h3>
                <p className="font-mono text-xs text-silver/60">{p.slug} · ${p.price}{p.sale_price ? ` → $${p.sale_price}` : ""} · stock {p.stock_count}</p>
              </div>
              <button onClick={() => setEditing(p)} className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-primary">Edit</button>
              <button
                onClick={() => { if (confirm(`Delete "${p.title}"?`)) deleteMutation.mutate(p.id); }}
                className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-border/60 text-silver hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <Link to="/admin" className="mt-10 inline-block font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary">← Admin home</Link>
      </main>

      {editing && (
        <EditDrawer
          product={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => saveMutation.mutate(p)}
          saving={saveMutation.isPending}
        />
      )}
      <Footer />
    </div>
  );
}

function EditDrawer({ product, onClose, onSave, saving }: {
  product: Partial<Product>;
  onClose: () => void;
  onSave: (p: Partial<Product>) => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState<Partial<Product>>(product);
  const set = (k: keyof Product, v: any) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur flex justify-end">
      <div className="w-full max-w-xl h-full bg-background border-l border-border/60 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background border-b border-border/60 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display font-black text-xl">{draft.id ? "Edit product" : "New product"}</h2>
          <button onClick={onClose} className="font-mono text-[10px] uppercase tracking-widest text-silver/60">Close</button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Title"><input value={draft.title ?? ""} onChange={(e) => set("title", e.target.value)} className={INPUT} /></Field>
          <Field label="Slug (URL)"><input value={draft.slug ?? ""} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} className={INPUT} placeholder="e.g. street-decks" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <select value={draft.department ?? "skate"} onChange={(e) => set("department", e.target.value)} className={INPUT}>
                {ALL_DEPARTMENTS.map((d) => <option key={d} value={d}>{DEPARTMENT_LABELS[d]}</option>)}
              </select>
            </Field>
            <Field label="Type">
              <input value={draft.product_type ?? ""} onChange={(e) => set("product_type", e.target.value)} className={INPUT} placeholder="e.g. deck, hoodie" />
            </Field>
          </div>
          <Field label="Description"><textarea rows={4} value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} className={INPUT} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price"><input type="number" value={draft.price ?? 0} onChange={(e) => set("price", Number(e.target.value))} className={INPUT} /></Field>
            <Field label="Sale price"><input type="number" value={draft.sale_price ?? ""} onChange={(e) => set("sale_price", e.target.value ? Number(e.target.value) : null)} className={INPUT} /></Field>
            <Field label="Stock"><input type="number" value={draft.stock_count ?? 0} onChange={(e) => set("stock_count", Number(e.target.value))} className={INPUT} /></Field>
          </div>
          <Field label="Sizes (comma separated)">
            <input
              value={(draft.sizes ?? []).join(", ")}
              onChange={(e) => set("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              className={INPUT}
              placeholder="S, M, L, XL"
            />
          </Field>
          <Field label="Image URLs (one per line)">
            <textarea
              rows={3}
              value={(draft.images ?? []).join("\n")}
              onChange={(e) => set("images", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              className={INPUT}
              placeholder="https://…"
            />
          </Field>
          <Field label="Tags (comma separated · use new, sale, limited, low_stock)">
            <input
              value={(draft.tags ?? []).join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              className={INPUT}
            />
          </Field>
          <Field label="Bullet details (one per line)">
            <textarea
              rows={3}
              value={(draft.details ?? []).join("\n")}
              onChange={(e) => set("details", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              className={INPUT}
            />
          </Field>
          <Field label="Specs (JSON, e.g. {&quot;width&quot;:&quot;8.0&quot;})">
            <textarea
              rows={3}
              value={JSON.stringify(draft.specs ?? {}, null, 2)}
              onChange={(e) => { try { set("specs", JSON.parse(e.target.value)); } catch { /* ignore */ } }}
              className={`${INPUT} font-mono text-xs`}
            />
          </Field>
          <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-silver/80">
            <input type="checkbox" checked={Boolean(draft.featured)} onChange={(e) => set("featured", e.target.checked)} />
            Featured on homepage
          </label>
        </div>
        <div className="sticky bottom-0 bg-background border-t border-border/60 px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 font-mono text-xs uppercase tracking-widest px-4 py-3 border border-border/60 text-silver hover:border-primary">Cancel</button>
          <button
            onClick={() => onSave(draft)}
            disabled={saving || !draft.title || !draft.slug}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-3 hover:opacity-90 disabled:opacity-40"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const INPUT = "w-full px-3 py-2 bg-card border border-border/60 text-sm text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">{label}</label>
      {children}
    </div>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, Package, FileText, Mail, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGlobalSearch } from "@/lib/search";
import { productImage, effectivePrice, DEPARTMENT_LABELS } from "@/lib/products";

type Props = { compact?: boolean };

export function GlobalSearch({ compact = false }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const res = useGlobalSearch(q, 4);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    navigate({ to: "/search", search: { q: term } as any });
  };

  const close = () => setOpen(false);

  return (
    <div ref={containerRef} className={`relative ${compact ? "w-full" : "w-full max-w-md"}`}>
      <form onSubmit={submit}>
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-silver/50 pointer-events-none" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products, articles, events…"
          aria-label="Site-wide search"
          className="w-full h-9 pl-9 pr-9 bg-card/70 border border-border/60 text-xs font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-silver/50 hover:text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 mt-2 max-h-[70vh] overflow-y-auto bg-background border border-border/60 shadow-2xl z-50">
          {res.loading && res.total === 0 && (
            <div className="p-4 font-mono text-[10px] uppercase tracking-widest text-silver/60">
              Searching…
            </div>
          )}
          {!res.loading && res.total === 0 && (
            <div className="p-4 font-mono text-[11px] text-silver/60">No results for “{q}”.</div>
          )}

          {res.products.length > 0 && (
            <Section
              title="Products"
              icon={<Package className="h-3 w-3" />}
              count={res.products.length}
            >
              {res.products.map((p) => (
                <Link
                  key={p.id}
                  to="/shop/$slug"
                  params={{ slug: p.slug }}
                  onClick={close}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-card"
                >
                  <img
                    src={productImage(p)}
                    alt=""
                    className="h-10 w-10 object-cover bg-card border border-border/40"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-primary truncate">
                      {DEPARTMENT_LABELS[p.department]}
                    </p>
                    <p className="text-xs text-silver truncate">{p.title}</p>
                  </div>
                  <span className="font-mono text-[10px] text-silver/70 shrink-0">
                    ${effectivePrice(p)}
                  </span>
                </Link>
              ))}
            </Section>
          )}

          {res.posts.length > 0 && (
            <Section
              title="Articles"
              icon={<FileText className="h-3 w-3" />}
              count={res.posts.length}
            >
              {res.posts.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  onClick={close}
                  className="block px-3 py-2 hover:bg-card"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-primary">
                    {p.category}
                  </p>
                  <p className="text-xs text-silver truncate">{p.title}</p>
                </Link>
              ))}
            </Section>
          )}

          {res.newsletters.length > 0 && (
            <Section
              title="Weekly Letters"
              icon={<Mail className="h-3 w-3" />}
              count={res.newsletters.length}
            >
              {res.newsletters.map((n) => (
                <Link
                  key={n.id}
                  to="/blog/$slug"
                  params={{ slug: `newsletter-${n.id}` }}
                  onClick={close}
                  className="block px-3 py-2 hover:bg-card"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-primary">
                    {new Date(n.scheduled_for ?? n.sent_at).toLocaleDateString("en-AU", {
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-silver truncate">{n.subject}</p>
                </Link>
              ))}
            </Section>
          )}

          {res.events.length > 0 && (
            <Section
              title="Events"
              icon={<Calendar className="h-3 w-3" />}
              count={res.events.length}
            >
              {res.events.map((e) => (
                <Link
                  key={e.id}
                  to="/community"
                  hash="events"
                  onClick={close}
                  className="block px-3 py-2 hover:bg-card"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-primary">
                    {e.date}
                  </p>
                  <p className="text-xs text-silver truncate">{e.title}</p>
                </Link>
              ))}
            </Section>
          )}

          {res.total > 0 && (
            <button
              onClick={submit}
              className="block w-full text-center px-3 py-2.5 border-t border-border/60 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-card"
            >
              See all results →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/40 last:border-0">
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-silver/60">
          {icon} {title}
        </span>
        <span className="font-mono text-[9px] text-silver/40">{count}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

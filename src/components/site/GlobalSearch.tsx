import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, Package, FileText, Mail, Calendar, Search as SearchIcon, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useGlobalSearch, useRecentSearches, highlightText } from "@/lib/search";
import { productImage, effectivePrice, DEPARTMENT_LABELS } from "@/lib/products";
import { posts, type Post } from "@/lib/posts";
import type { Newsletter } from "@/lib/newsletters";
import type { Product } from "@/lib/products";

type SearchItem = {
  type: string;
  key: string;
  label: string;
  extra?: string;
  to?: string;
  params?: Record<string, string>;
  hash?: string;
  href?: string;
};

type SearchEvent = {
  id: string;
  title: string;
  date: string;
  detail: string;
  start_at: string;
  category: string;
};

function safeHtml(html: string) {
  return { __html: html };
}

type Props = { compact?: boolean; collapsible?: boolean };

export function GlobalSearch({ compact = false, collapsible = false }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(!collapsible);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const res = useGlobalSearch(q, 4);
  const [recents, addRecent] = useRecentSearches();

  const allItems = useMemo(() => {
    const items: SearchItem[] = [];
    res.products.forEach((p: Product) => items.push({ type: "product", key: `p-${p.id}`, label: p.title, extra: `${DEPARTMENT_LABELS[p.department]} · ${effectivePrice(p)}`, to: "/shop/$slug", params: { slug: p.slug } }));
    res.posts.forEach((p: Post) => items.push({ type: "article", key: `a-${p.slug}`, label: p.title, extra: p.category, to: "/blog/$slug", params: { slug: p.slug } }));
    res.newsletters.forEach((n: Newsletter) => items.push({ type: "newsletter", key: `n-${n.id}`, label: n.subject, extra: "Newsletter", to: "/blog/$slug", params: { slug: `newsletter-${n.id}` } }));
    res.events.forEach((e: SearchEvent) => items.push({ type: "event", key: `e-${e.id}`, label: e.title, extra: `${e.date} · ${e.category}`, to: "/community", hash: "events" }));
    return items;
  }, [res]);

  const openSearch = useCallback(() => {
    setExpanded(true);
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    if (collapsible) {
      setExpanded(false);
      setQ("");
    }
    inputRef.current?.blur();
  }, [collapsible]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        if (collapsible && !q) setExpanded(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [collapsible, q, openSearch, closeSearch]);


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !q.trim()) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev <= 0 ? allItems.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && allItems[selectedIndex]) {
        const item = allItems[selectedIndex];
        addRecent(q);
        setOpen(false);
        if (item.to) {
          navigate({ to: item.to, params: item.params, hash: item.hash });
        }
      } else {
        submit();
      }
    }
  };

  const submit = () => {
    const term = q.trim();
    if (!term) return;
    addRecent(term);
    setOpen(false);
    navigate({ to: "/search", search: { q: term } });
  };

  const hasResults = res.total > 0;
  const hasRecents = recents.length > 0 && !q.trim() && open;
  const showNoResults = q.trim() && !res.loading && res.total === 0 && !hasRecents;

  return (
    <div ref={containerRef} className={`relative flex justify-end ${compact ? "w-full" : "w-full max-w-md"}`}>
      {collapsible && !expanded ? (
        <button
          type="button"
          onClick={openSearch}
          aria-label="Open search (Cmd+K)"
          title="Search  ⌘K"
          className="h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors border border-border/60 rounded-md"
        >
          <Search className="h-4 w-4" />
        </button>
      ) : (
        <form onSubmit={submit} className="relative w-full transition-all duration-200 ease-out">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-silver/50 pointer-events-none" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, articles, events..."
            aria-label="Site-wide search"
            className="w-full h-9 pl-9 pr-16 bg-card/70 border border-border/60 rounded-md text-xs font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="text-silver/50 hover:text-primary p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {collapsible && (
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="text-silver/50 hover:text-primary p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {!q && !collapsible && (
              <kbd className="hidden sm:inline font-mono text-[9px] text-silver/40 border border-border/40 rounded px-1">⌘K</kbd>
            )}
          </div>
        </form>
      )}


      {open && (hasResults || hasRecents || showNoResults) && (
        <div className="absolute left-0 right-0 mt-2 max-h-[70vh] overflow-y-auto bg-background border border-border/60 shadow-2xl z-50">
          {/* Recent searches */}
          {hasRecents && (
            <Section title="Recent Searches" icon={<SearchIcon className="h-3 w-3" />} count={recents.length}>
              {recents.map((r) => (
                <button
                  key={r}
                  onClick={() => { setQ(r); setOpen(true); }}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-card text-left text-xs font-mono text-silver"
                >
                  <SearchIcon className="h-3 w-3 text-silver/50" />
                  <span>{r}</span>
                </button>
              ))}
            </Section>
          )}

          {/* No results */}
          {showNoResults && (
            <div className="p-6 text-center border-b border-border/40 last:border-0">
              <SearchIcon className="h-8 w-8 text-silver/40 mx-auto mb-3" />
              <p className="font-mono text-sm text-silver/70 mb-1">
                No results for <span className="text-primary">"{q}"</span>
              </p>
              <p className="text-xs text-silver/50 mb-4">Try a different keyword or browse our categories.</p>
              {hasRecents && (
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2">Recent searches</p>
                  {recents.slice(0, 3).map((r) => (
                    <button
                      key={r}
                      onClick={() => { setQ(r); setOpen(true); }}
                      className="block w-full text-xs text-primary hover:underline py-1"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <Link to="/shop" className="px-3 py-1.5 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">Shop All</Link>
                <Link to="/shop" search={{ dept: "skate" }} className="px-3 py-1.5 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">Skate</Link>
                <Link to="/shop" search={{ dept: "surf" }} className="px-3 py-1.5 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">Surf</Link>
                <Link to="/blog" className="px-3 py-1.5 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors">Blog</Link>
              </div>
            </div>
          )}

          {/* Results */}
          {res.loading && res.total === 0 && (
            <div className="p-4 font-mono text-[10px] uppercase tracking-widest text-silver/60">
              Searching...
            </div>
          )}

          {res.products.length > 0 && (
            <Section title="Products" icon={<Package className="h-3 w-3" />} count={res.products.length}>
              {res.products.map((p, i) => (
                <Link
                  key={p.id}
                  to="/shop/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => { setOpen(false); addRecent(q); }}
                  className={`flex items-center gap-3 px-3 py-2 hover:bg-card ${selectedIndex === i ? "bg-primary/10" : ""}`}
                >
                  <img src={productImage(p)} alt="" className="h-10 w-10 object-cover bg-card border border-border/40" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-primary truncate">
                      {DEPARTMENT_LABELS[p.department]}
                    </p>
                    <p className="text-xs text-silver truncate" dangerouslySetInnerHTML={safeHtml(highlightText(p.title, q))} />
                  </div>
                  <span className="font-mono text-[10px] text-silver/70 shrink-0">${effectivePrice(p)}</span>
                </Link>
              ))}
            </Section>
          )}

          {res.posts.length > 0 && (
            <Section title="Articles" icon={<FileText className="h-3 w-3" />} count={res.posts.length}>
              {res.posts.map((p, i) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => { setOpen(false); addRecent(q); }}
                  className={`block px-3 py-2 hover:bg-card ${selectedIndex === res.products.length + i ? "bg-primary/10" : ""}`}
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-primary">{p.category}</p>
                  <p className="text-xs text-silver truncate" dangerouslySetInnerHTML={safeHtml(highlightText(p.title, q))} />
                  <p className="text-[10px] text-silver/60 line-clamp-1" dangerouslySetInnerHTML={safeHtml(highlightText(p.excerpt, q))} />
                </Link>
              ))}
            </Section>
          )}

          {res.newsletters.length > 0 && (
            <Section title="Weekly Letters" icon={<Mail className="h-3 w-3" />} count={res.newsletters.length}>
              {res.newsletters.map((n, i) => (
                <Link
                  key={n.id}
                  to="/blog/$slug"
                  params={{ slug: `newsletter-${n.id}` }}
                  onClick={() => { setOpen(false); addRecent(q); }}
                  className={`block px-3 py-2 hover:bg-card ${selectedIndex === res.products.length + res.posts.length + i ? "bg-primary/10" : ""}`}
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-primary">
                    {new Date(n.scheduled_for ?? n.sent_at).toLocaleDateString("en-AU", { month: "short", day: "2-digit" })}
                  </p>
                  <p className="text-xs text-silver truncate" dangerouslySetInnerHTML={safeHtml(highlightText(n.subject, q))} />
                  {n.excerpt && <p className="text-[10px] text-silver/60 line-clamp-1" dangerouslySetInnerHTML={safeHtml(highlightText(n.excerpt, q))} />}
                </Link>
              ))}
            </Section>
          )}

          {res.events.length > 0 && (
            <Section title="Events" icon={<Calendar className="h-3 w-3" />} count={res.events.length}>
              {res.events.map((e, i) => (
                <Link
                  key={e.id}
                  to="/community"
                  hash="events"
                  onClick={() => { setOpen(false); addRecent(q); }}
                  className={`block px-3 py-2 hover:bg-card ${selectedIndex === res.products.length + res.posts.length + res.newsletters.length + i ? "bg-primary/10" : ""}`}
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-primary">{e.date}</p>
                  <p className="text-xs text-silver truncate" dangerouslySetInnerHTML={safeHtml(highlightText(e.title, q))} />
                  {e.detail && <p className="text-[10px] text-silver/60 line-clamp-1" dangerouslySetInnerHTML={safeHtml(highlightText(e.detail, q))} />}
                </Link>
              ))}
            </Section>
          )}

          {res.total > 0 && (
            <button
              onClick={() => { setOpen(false); addRecent(q); navigate({ to: "/search", search: { q } }); }}
              className="block w-full text-center px-3 py-2.5 border-t border-border/60 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-card"
            >
              See all results <ChevronRight className="h-3 w-3 inline" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, icon, count, children }: { title: string; icon: React.ReactNode; count: number; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/40 last:border-0">
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-silver/60">{icon} {title}</span>
        <span className="font-mono text-[9px] text-silver/40">{count}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

// Need useMemo for the component


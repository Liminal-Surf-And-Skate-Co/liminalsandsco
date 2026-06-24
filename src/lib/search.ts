import { useMemo, useState } from "react";
import { useProducts, type Product } from "@/lib/products";
import { useNewsletters, type Newsletter } from "@/lib/newsletters";
import { useEvents } from "@/lib/events";
import { posts, type Post } from "@/lib/posts";

export type SearchResults = {
  products: Product[];
  posts: Post[];
  newsletters: Newsletter[];
  events: { id: string; title: string; date: string; detail: string; start_at: string; category: string }[];
  total: number;
  loading: boolean;
};

function match(haystacks: (string | null | undefined)[], term: string) {
  return haystacks.some((h) => (h ?? "").toLowerCase().includes(term));
}

export function highlightText(text: string, term: string): string {
  if (!term) return text;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(re, "<mark>$1</mark>");
}

export function useRecentSearches(): [string[], (s: string) => void] {
  const [recents, setRecents] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("recent_searches") || "[]").slice(0, 5);
    } catch {
      return [];
    }
  });
  const add = (s: string) => {
    if (!s.trim()) return;
    const next = [s, ...recents.filter((r) => r.toLowerCase() !== s.toLowerCase())].slice(0, 5);
    setRecents(next);
    localStorage.setItem("recent_searches", JSON.stringify(next));
  };
  return [recents, add];
}

export function useGlobalSearch(query: string, limitPerGroup = 20): SearchResults {
  const { data: products, isLoading: lp } = useProducts();
  const { data: newsletters, isLoading: ln } = useNewsletters();
  const { data: events, isLoading: le } = useEvents({ upcomingOnly: false });

  return useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return { products: [], posts: [], newsletters: [], events: [], total: 0, loading: lp || ln || le };
    }

    const prod = (products ?? [])
      .filter((p) =>
        match(
          [p.title, p.description, p.product_type, p.colour, p.target_group, ...(p.tags ?? [])],
          term,
        ),
      )
      .slice(0, limitPerGroup);

    const art = posts
      .filter((p) => match([p.title, p.excerpt, p.category, ...p.body], term))
      .slice(0, limitPerGroup);

    const news = (newsletters ?? [])
      .filter((n) => match([n.subject, n.excerpt, n.body], term))
      .slice(0, limitPerGroup);

    const ev = (events ?? [])
      .filter((e) => match([e.title, e.description, e.location, e.category], term))
      .slice(0, limitPerGroup)
      .map((e) => ({
        id: e.id,
        title: e.title,
        date: new Date(e.start_at).toLocaleDateString("en-AU", { month: "short", day: "2-digit" }),
        detail: e.description || "",
        start_at: e.start_at,
        category: e.category,
      }));

    return {
      products: prod,
      posts: art,
      newsletters: news,
      events: ev,
      total: prod.length + art.length + news.length + ev.length,
      loading: lp || ln || le,
    };
  }, [query, products, newsletters, events, lp, ln, le, limitPerGroup]);
}

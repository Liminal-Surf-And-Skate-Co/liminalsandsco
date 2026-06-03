import { useMemo } from "react";
import { useProducts, type Product } from "@/lib/products";
import { useNewsletters, type Newsletter } from "@/lib/newsletters";
import { posts, type Post } from "@/lib/posts";
import { COMMUNITY_EVENTS, type CommunityEvent } from "@/lib/community-data";

export type SearchResults = {
  products: Product[];
  posts: Post[];
  newsletters: Newsletter[];
  events: CommunityEvent[];
  total: number;
  loading: boolean;
};

function match(haystacks: (string | null | undefined)[], term: string) {
  return haystacks.some((h) => (h ?? "").toLowerCase().includes(term));
}

export function useGlobalSearch(query: string, limitPerGroup = 20): SearchResults {
  const { data: products, isLoading: lp } = useProducts();
  const { data: newsletters, isLoading: ln } = useNewsletters();

  return useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return { products: [], posts: [], newsletters: [], events: [], total: 0, loading: lp || ln };
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

    const ev = COMMUNITY_EVENTS
      .filter((e) => match([e.title, e.detail, e.date], term))
      .slice(0, limitPerGroup);

    return {
      products: prod,
      posts: art,
      newsletters: news,
      events: ev,
      total: prod.length + art.length + news.length + ev.length,
      loading: lp || ln,
    };
  }, [query, products, newsletters, lp, ln, limitPerGroup]);
}

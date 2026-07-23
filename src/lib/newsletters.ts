import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError } from "@/lib/error-sanitize";

export type NewsletterLink = { label: string; url: string };

export type Newsletter = {
  id: string;
  subject: string;
  excerpt: string | null;
  body: string;
  sent_at: string;
  scheduled_for: string | null;
  cover_image: string | null;
  links: NewsletterLink[];
  published: boolean;
};

export function normalizeNewsletter(row: Record<string, unknown>): Newsletter {
  return {
    id: row.id as string,
    subject: row.subject as string,
    excerpt: (row.excerpt ?? null) as string | null,
    body: (row.body ?? "") as string,
    sent_at: row.sent_at as string,
    scheduled_for: (row.scheduled_for ?? null) as string | null,
    cover_image: (row.cover_image ?? null) as string | null,
    links: Array.isArray(row.links) ? (row.links as NewsletterLink[]) : [],
    published: Boolean(row.published ?? true),
  };
}

export async function fetchNewsletters(): Promise<Newsletter[]> {
  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .order("sent_at", { ascending: false });
  if (error) throw new Error(sanitizeError(error));
  return (data ?? []).map(normalizeNewsletter);
}

export function useNewsletters() {
  return useQuery({
    queryKey: ["newsletters"],
    queryFn: fetchNewsletters,
    staleTime: 60_000,
  });
}

/**
 * Given a date, return the next Friday at 09:00 local time (or same day if Friday).
 * Used as a sensible default for newsletter scheduling.
 */
export function nextFridayISO(from = new Date()): string {
  const d = new Date(from);
  const day = d.getDay(); // 0 Sun … 5 Fri
  const delta = (5 - day + 7) % 7; // days until Friday
  d.setDate(d.getDate() + delta);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

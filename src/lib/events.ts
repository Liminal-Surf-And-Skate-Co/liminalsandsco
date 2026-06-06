import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type EventCategory = "jam" | "cleanup" | "comp" | "party" | "other";

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  jam: "Skate Jam",
  cleanup: "Beach Cleanup",
  comp: "Surf Comp",
  party: "Shop Party",
  other: "Other",
};

export type CommunityEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  rsvp_url: string | null;
  category: EventCategory;
  published: boolean;
  created_at: string;
  updated_at: string;
};

function normalize(row: any): CommunityEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    location: row.location ?? "",
    start_at: row.start_at,
    end_at: row.end_at ?? null,
    image_url: row.image_url ?? null,
    rsvp_url: row.rsvp_url ?? null,
    category: (row.category || "other") as EventCategory,
    published: Boolean(row.published),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function useEvents(opts?: { includeUnpublished?: boolean; upcomingOnly?: boolean }) {
  return useQuery({
    queryKey: ["events", opts],
    queryFn: async () => {
      let q = supabase.from("events").select("*").order("start_at", { ascending: true });
      if (!opts?.includeUnpublished) q = q.eq("published", true);
      if (opts?.upcomingOnly) q = q.gte("start_at", new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString());
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(normalize);
    },
    staleTime: 30_000,
  });
}

export function useUpsertEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: Partial<CommunityEvent> & { id?: string }) => {
      const payload = {
        title: e.title,
        description: e.description ?? "",
        location: e.location ?? "",
        start_at: e.start_at,
        end_at: e.end_at || null,
        image_url: e.image_url || null,
        rsvp_url: e.rsvp_url || null,
        category: e.category || "jam",
        published: e.published ?? true,
      };
      if (e.id) {
        const { error } = await supabase.from("events").update(payload).eq("id", e.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

function gcalFormat(iso: string): string {
  // YYYYMMDDTHHmmssZ
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
}

export function googleCalendarUrl(e: Pick<CommunityEvent, "title" | "description" | "location" | "start_at" | "end_at">): string {
  const start = gcalFormat(e.start_at);
  const end = gcalFormat(e.end_at || new Date(new Date(e.start_at).getTime() + 2 * 60 * 60 * 1000).toISOString());
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${start}/${end}`,
    details: e.description || "",
    location: e.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function formatEventDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
}

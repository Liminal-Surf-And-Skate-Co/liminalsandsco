// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError } from "@/lib/error-sanitize";

export type SpotPin = {
  id: string;
  user_id: string;
  title: string;
  notes: string;
  kind: "surf" | "skate";
  lat: number;
  lng: number;
  photo_url: string | null;
  tide_tips: string;
  created_at: string;
  updated_at: string;
};

export type VideoClip = {
  id: string;
  user_id: string;
  title: string;
  category: "skate" | "surf";
  video_url: string;
  votes: number;
  approved: boolean;
  created_at: string;
  updated_at: string;
};

export function useSpotPins() {
  return useQuery({
    queryKey: ["spot_pins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spot_pins")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return (data ?? []) as SpotPin[];
    },
    staleTime: 30_000,
  });
}

export function useCreateSpotPin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Omit<SpotPin, "id" | "user_id" | "created_at" | "updated_at">,
    ) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in to add a pin.");
      const { error } = await supabase.from("spot_pins").insert({
        ...input,
        user_id: u.user.id,
      });
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["spot_pins"] }),
  });
}

export function useDeleteSpotPin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("spot_pins").delete().eq("id", id);
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["spot_pins"] }),
  });
}

export function useVideoClips() {
  return useQuery({
    queryKey: ["video_clips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_clips")
        .select("*")
        .eq("approved", true)
        .order("votes", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return (data ?? []) as VideoClip[];
    },
    staleTime: 30_000,
  });
}

export function useSubmitVideoClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Omit<VideoClip, "id" | "user_id" | "votes" | "approved" | "created_at" | "updated_at">,
    ) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in to submit a clip.");
      const { error } = await supabase.from("video_clips").insert({
        ...input,
        user_id: u.user.id,
        votes: 0,
        approved: false,
      });
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["video_clips"] }),
  });
}

export function useVoteVideoClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: existing, error: fetchErr } = await supabase
        .from("video_clips")
        .select("votes")
        .eq("id", id)
        .maybeSingle();
      if (fetchErr) throw new Error(sanitizeError(fetchErr));
      const next = (existing?.votes ?? 0) + 1;
      const { error } = await supabase
        .from("video_clips")
        .update({ votes: next })
        .eq("id", id);
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["video_clips"] }),
  });
}

// Haversine distance in km
export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function sortByDistance(
  pins: SpotPin[],
  userLat: number,
  userLng: number,
): (SpotPin & { distance: number })[] {
  return pins
    .map((p) => ({ ...p, distance: haversine(userLat, userLng, p.lat, p.lng) }))
    .sort((a, b) => a.distance - b.distance);
}

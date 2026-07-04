// @ts-nocheck — DB types are generated; some referenced tables are pending migrations.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export const TIERS: { key: LoyaltyTier; label: string; min: number; color: string; next: number }[] = [
  { key: "bronze", label: "Bronze", min: 0, color: "#cd7f32", next: 100 },
  { key: "silver", label: "Silver", min: 100, color: "#c0c0c0", next: 500 },
  { key: "gold", label: "Gold", min: 500, color: "#ffd700", next: 1500 },
  { key: "platinum", label: "Platinum", min: 1500, color: "#e5e4e2", next: 3000 },
];

export function getTier(points: number): LoyaltyTier {
  if (points >= 1500) return "platinum";
  if (points >= 500) return "gold";
  if (points >= 100) return "silver";
  return "bronze";
}

export function getTierInfo(points: number) {
  const tier = getTier(points);
  const tierDef = TIERS.find((t) => t.key === tier)!;
  const nextTier = TIERS.find((t) => t.min > points);
  const progress = nextTier ? ((points - tierDef.min) / (nextTier.min - tierDef.min)) * 100 : 100;
  return { tier, tierDef, nextTier, progress };
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  tier_unlocked: string;
  available: boolean;
  created_at: string;
}

export interface LoyaltyRecord {
  id: string;
  user_id: string;
  points: number;
  tier: string;
  total_earned: number;
  total_redeemed: number;
  updated_at: string;
}

export function useLoyalty() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: record, isLoading: loadingRecord } = useQuery({
    queryKey: ["loyalty", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as LoyaltyRecord | null;
    },
    enabled: !!user,
  });

  const { data: allRewards, isLoading: loadingRewards } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("available", true)
        .order("points_required", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Reward[];
    },
  });

  const redeem = useMutation({
    mutationFn: async ({ reward }: { reward: Reward }) => {
      if (!user || !record) throw new Error("Not signed in");
      if (record.points < reward.points_required) throw new Error("Not enough points");
      const { error } = await supabase
        .from("loyalty_points")
        .update({
          points: record.points - reward.points_required,
          total_redeemed: record.total_redeemed + reward.points_required,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
      if (error) throw error;
      return { ok: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty"] });
    },
  });

  const addPoints = useMutation({
    mutationFn: async ({ points }: { points: number }) => {
      if (!user) throw new Error("Not signed in");
      const { data: existing } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (existing) {
        const newPoints = existing.points + points;
        const newTier = getTier(newPoints);
        const { error } = await supabase
          .from("loyalty_points")
          .update({
            points: newPoints,
            tier: newTier,
            total_earned: existing.total_earned + points,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const tier = getTier(points);
        const { error } = await supabase.from("loyalty_points").insert({
          user_id: user.id,
          points,
          tier,
          total_earned: points,
          total_redeemed: 0,
        });
        if (error) throw error;
      }
      return { ok: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty"] });
    },
  });

  return {
    record,
    allRewards,
    loading: loadingRecord || loadingRewards,
    redeem,
    addPoints,
    tierInfo: record ? getTierInfo(record.points) : null,
  };
}

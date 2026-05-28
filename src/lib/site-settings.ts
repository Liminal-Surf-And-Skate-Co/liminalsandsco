import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SettingKey =
  | "discord_invite_url"
  | "instagram_url"
  | "youtube_url"
  | "tiktok_url"
  | "facebook_url"
  | "contact_email_primary"
  | "contact_email_secondary"
  | "discord_webhook_url";

export const SETTING_KEYS: SettingKey[] = [
  "discord_invite_url",
  "instagram_url",
  "youtube_url",
  "tiktok_url",
  "facebook_url",
  "contact_email_primary",
  "contact_email_secondary",
  "discord_webhook_url",
];

export const SETTING_LABELS: Record<SettingKey, string> = {
  discord_invite_url: "Discord invite URL",
  instagram_url: "Instagram URL",
  youtube_url: "YouTube URL",
  tiktok_url: "TikTok URL",
  facebook_url: "Facebook URL",
  contact_email_primary: "Primary contact email",
  contact_email_secondary: "Secondary contact email",
  discord_webhook_url: "Discord webhook URL (for custom order notifications)",
};

export type SettingsMap = Record<SettingKey, string>;

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SettingsMap> => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const map = Object.fromEntries(SETTING_KEYS.map((k) => [k, ""])) as SettingsMap;
      for (const row of data || []) {
        if ((SETTING_KEYS as string[]).includes(row.key)) {
          map[row.key as SettingKey] = row.value || "";
        }
      }
      return map;
    },
    staleTime: 60_000,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: SettingKey; value: string }) => {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] }),
  });
}

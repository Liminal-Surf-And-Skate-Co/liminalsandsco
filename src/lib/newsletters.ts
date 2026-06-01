import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Newsletter = {
  id: string;
  subject: string;
  excerpt: string | null;
  body: string;
  sent_at: string;
};

export async function fetchNewsletters(): Promise<Newsletter[]> {
  const { data, error } = await supabase
    .from("newsletters")
    .select("id,subject,excerpt,body,sent_at")
    .order("sent_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Newsletter[];
}

export function useNewsletters() {
  return useQuery({
    queryKey: ["newsletters"],
    queryFn: fetchNewsletters,
    staleTime: 60_000,
  });
}

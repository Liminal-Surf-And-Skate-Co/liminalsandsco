import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string;
  photos: string[];
  approved: boolean;
  created_at: string;
};

export function useProductReviews(productId: string | undefined) {
  return useQuery({
    queryKey: ["product_reviews", productId],
    enabled: !!productId,
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({
        ...row,
        photos: Array.isArray(row.photos) ? row.photos.filter(Boolean) : [],
      })) as Review[];
    },
    staleTime: 30_000,
  });
}

export type NewReview = {
  product_id: string;
  rating: number;
  title?: string;
  body: string;
  photos: string[];
};

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewReview) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in to leave a review.");
      const { error } = await supabase.from("product_reviews").insert({
        ...input,
        user_id: u.user.id,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["product_reviews", vars.product_id] }),
  });
}

/** Uploads a file to the review-photos bucket under <user_id>/<rand>.<ext> and returns its public URL. */
export async function uploadReviewPhoto(file: File): Promise<string> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Please sign in to upload photos.");
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${u.user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("review-photos").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("review-photos").getPublicUrl(path);
  return data.publicUrl;
}

export function averageRating(reviews: Review[] | undefined): { avg: number; count: number } {
  if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
  const valid = reviews.filter((r) => Number.isFinite(r.rating));
  if (valid.length === 0) return { avg: 0, count: 0 };
  const sum = valid.reduce((a, r) => a + r.rating, 0);
  return { avg: sum / valid.length, count: valid.length };
}

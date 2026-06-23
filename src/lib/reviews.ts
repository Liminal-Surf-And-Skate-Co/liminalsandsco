import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError } from "@/lib/error-sanitize";

const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 7; // 7 days

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

/** Photos may have been stored as either storage paths or full URLs. Returns the storage path or null if it's already a usable URL we can't re-sign. */
function extractPath(value: string): string | null {
  if (!value) return null;
  const match = value.match(/\/review-photos\/(.+?)(?:\?|$)/);
  if (match) return decodeURIComponent(match[1]);
  if (value.startsWith("http")) return null;
  return value;
}

async function signPhotos(values: string[]): Promise<string[]> {
  const out: string[] = [];
  for (const v of values) {
    const path = extractPath(v);
    if (!path) {
      out.push(v);
      continue;
    }
    const { data, error } = await supabase.storage
      .from("review-photos")
      .createSignedUrl(path, SIGNED_URL_EXPIRY);
    if (!error && data?.signedUrl) out.push(data.signedUrl);
  }
  return out;
}

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
      if (error) throw new Error(sanitizeError(error));
      const rows = (data ?? []).map((row) => ({
        ...row,
        photos: Array.isArray(row.photos) ? row.photos.filter(Boolean) : [],
      })) as Review[];
      return Promise.all(rows.map(async (r) => ({ ...r, photos: await signPhotos(r.photos) })));
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
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["product_reviews", vars.product_id] }),
  });
}

/** Uploads a file to the (private) review-photos bucket; returns the storage path. URLs are signed on read. */
export async function uploadReviewPhoto(file: File): Promise<string> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Please sign in to upload photos.");
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${u.user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("review-photos").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(sanitizeError(error));
  return path;
}

/** Used by the composer to preview a freshly-uploaded image before posting. */
export async function signReviewPhoto(path: string): Promise<string | null> {
  const real = extractPath(path);
  if (!real) return path;
  const { data, error } = await supabase.storage
    .from("review-photos")
    .createSignedUrl(real, SIGNED_URL_EXPIRY);
  if (error) return null;
  return data.signedUrl;
}

export function averageRating(reviews: Review[] | undefined): { avg: number; count: number } {
  if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
  const valid = reviews.filter((r) => Number.isFinite(r.rating));
  if (valid.length === 0) return { avg: 0, count: 0 };
  const sum = valid.reduce((a, r) => a + r.rating, 0);
  return { avg: sum / valid.length, count: valid.length };
}

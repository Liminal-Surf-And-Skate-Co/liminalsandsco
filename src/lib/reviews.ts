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

const ALLOWED_REVIEW_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_REVIEW_PHOTO_EXTS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_REVIEW_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

function validateReviewPhoto(file: File): void {
  // Reject SVG and HTML explicitly to prevent XSS / content injection
  const lowerName = file.name.toLowerCase();
  if (
    lowerName.endsWith(".svg") ||
    lowerName.endsWith(".svgz") ||
    lowerName.endsWith(".html") ||
    lowerName.endsWith(".htm") ||
    lowerName.endsWith(".xhtml")
  ) {
    throw new Error("SVG and HTML files are not allowed for review photos.");
  }

  // Validate extension against allowlist
  const hasAllowedExt = ALLOWED_REVIEW_PHOTO_EXTS.some((ext) => lowerName.endsWith(ext));
  if (!hasAllowedExt) {
    throw new Error("Only .jpg, .jpeg, .png, and .webp files are allowed.");
  }

  // Validate MIME type against allowlist (do not rely solely on file.type)
  const declaredType = file.type.toLowerCase().trim();
  if (!ALLOWED_REVIEW_PHOTO_TYPES.includes(declaredType)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
  }

  // Validate file size
  if (file.size > MAX_REVIEW_PHOTO_BYTES) {
    throw new Error("File too large. Maximum size is 5 MB.");
  }
}

/** Uploads a file to the (private) review-photos bucket; returns the storage path. URLs are signed on read. */
export async function uploadReviewPhoto(file: File): Promise<string> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Please sign in to upload photos.");

  validateReviewPhoto(file);

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

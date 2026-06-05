import { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useProductReviews,
  useCreateReview,
  uploadReviewPhoto,
  signReviewPhoto,
  averageRating,
  type Review,
} from "@/lib/reviews";

type PhotoEntry = { path: string; preview: string };

function Stars({ value, onChange, size = 4 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const cls = `h-${size} w-${size}`;
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={onChange ? () => onChange(i) : undefined}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          disabled={!onChange}
        >
          <Star className={`${cls} ${i <= value ? "fill-primary text-primary" : "text-silver/30"}`} />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useProductReviews(productId);
  const create = useCreateReview();
  const { avg, count } = averageRating(reviews);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErr(null);
    setUploading(true);
    try {
      const next: PhotoEntry[] = [];
      for (const f of Array.from(files).slice(0, 4 - photos.length)) {
        const path = await uploadReviewPhoto(f);
        const preview = (await signReviewPhoto(path)) ?? "";
        next.push({ path, preview });
      }
      setPhotos((p) => [...p, ...next]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await create.mutateAsync({
        product_id: productId,
        rating,
        title: title || undefined,
        body,
        photos: photos.map((p) => p.path),
      });
      setTitle("");
      setBody("");
      setPhotos([]);
      setRating(5);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <section className="mt-16 border-t border-border/40 pt-12">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-display font-black text-2xl lg:text-3xl">Crew reviews</h2>
          {count > 0 ? (
            <div className="flex items-center gap-2 mt-2">
              <Stars value={Math.round(avg)} />
              <span className="font-mono text-[11px] uppercase tracking-widest text-silver/70">
                {avg.toFixed(1)} · {count} review{count === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p className="font-mono text-[11px] uppercase tracking-widest text-silver/50 mt-2">No reviews yet — be the first.</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Composer */}
        <div className="lg:col-span-1">
          <div className="border border-border/60 bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">Leave a review</p>
            {!user ? (
              <p className="font-mono text-xs text-silver/70">
                <a href="/account" className="text-primary underline-offset-4 hover:underline">Sign in</a> to share your setup.
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <Stars value={rating} onChange={setRating} size={5} />
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Headline (optional)"
                  className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary"
                />
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="How does it ride? Sizing? Setup tips?"
                  className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary"
                />

                {/* Photo uploader */}
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-border/60 hover:border-primary font-mono text-[10px] uppercase tracking-widest text-silver">
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "Uploading…" : `Add photos (${photos.length}/4)`}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      disabled={uploading || photos.length >= 4}
                      onChange={(e) => onFiles(e.target.files)}
                    />
                  </label>
                  {photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {photos.map((entry, i) => (
                        <div key={entry.path} className="relative aspect-square">
                          <img src={entry.preview} alt="" className="w-full h-full object-cover border border-border/60" />
                          <button
                            type="button"
                            onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 h-5 w-5 bg-background/80 border border-border/60 flex items-center justify-center"
                            aria-label="Remove photo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {err && <p className="font-mono text-[10px] text-red-400">{err}</p>}

                <button
                  type="submit"
                  disabled={create.isPending}
                  className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 disabled:opacity-50"
                >
                  {create.isPending ? "Posting…" : "Post review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-5">
          {isLoading ? (
            <p className="font-mono text-xs text-silver/60">Loading reviews…</p>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((r) => <ReviewCard key={r.id} review={r} />)
          ) : (
            <div className="border border-dashed border-border/60 p-8 text-center font-mono text-xs uppercase tracking-widest text-silver/50">
              No reviews yet
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <Stars value={review.rating} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      {review.title && <h3 className="font-display font-bold text-base mb-2">{review.title}</h3>}
      {review.body && <p className="text-sm text-silver/90 leading-relaxed whitespace-pre-wrap">{review.body}</p>}
      {review.photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {review.photos.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden border border-border/60">
              <img src={url} alt="" className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

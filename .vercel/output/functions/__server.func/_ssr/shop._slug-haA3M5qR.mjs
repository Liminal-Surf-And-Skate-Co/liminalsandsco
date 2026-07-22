import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { Q as Route, T as useProduct, u as useProducts, m as useWishlist, l as useCart, N as Nav, F as Footer, U as productGallery, B as isOutOfStock, V as isLowStock, e as effectivePrice, D as DEPARTMENT_LABELS, p as productImage, g as sanitizeError, f as useAuth } from "./router-BZBp0UBL.mjs";
import { P as ProductBadges } from "./ProductBadges-DHuWtHXn.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DYwJbDLa.mjs";
import "../_libs/sonner.mjs";
import { O as ArrowLeft, at as Star, au as Minus, d as Plus, o as ShoppingCart, H as Heart, h as Upload, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 7;
function extractPath(value) {
  const match = value.match(/\/storage\/v1\/object\/[^/]+\/review-photos\/(.+)/);
  if (match) return decodeURIComponent(match[1]);
  if (value.startsWith("review-photos/")) return value;
  return null;
}
function useProductReviews(productId) {
  return useQuery({
    queryKey: ["product_reviews", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase.from("product_reviews").select("*").eq("product_id", productId).eq("approved", true).order("created_at", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return data ?? [];
    },
    staleTime: 3e4
  });
}
function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in to leave a review.");
      const { error } = await supabase.from("product_reviews").insert({
        ...input,
        user_id: u.user.id
      });
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["product_reviews", vars.product_id] })
  });
}
const useCreateReview = useSubmitReview;
const ALLOWED_REVIEW_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_REVIEW_PHOTO_EXTS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_REVIEW_PHOTO_BYTES = 5 * 1024 * 1024;
function validateReviewPhoto(file) {
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".svg") || lowerName.endsWith(".svgz") || lowerName.endsWith(".html") || lowerName.endsWith(".htm") || lowerName.endsWith(".xhtml")) {
    throw new Error("SVG and HTML files are not allowed for review photos.");
  }
  const hasAllowedExt = ALLOWED_REVIEW_PHOTO_EXTS.some(
    (ext) => lowerName.endsWith(ext)
  );
  if (!hasAllowedExt) {
    throw new Error("Only .jpg, .jpeg, .png, and .webp files are allowed.");
  }
  const declaredType = file.type.toLowerCase().trim();
  if (!ALLOWED_REVIEW_PHOTO_TYPES.includes(declaredType)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
    );
  }
  if (file.size > MAX_REVIEW_PHOTO_BYTES) {
    throw new Error("File too large. Maximum size is 5 MB.");
  }
}
async function uploadReviewPhoto(file) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Please sign in to upload photos.");
  validateReviewPhoto(file);
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Please sign in to upload photos.");
  const form = new FormData();
  form.append("file", file);
  const url = `${"https://ickbmruzgyajupljfrto.supabase.co"}/functions/v1/review-photo-upload`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      Apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2JtcnV6Z3lhanVwbGpmcnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTQxMjIsImV4cCI6MjA5NzMzMDEyMn0.tL3LrkGDmBUNqTB-COQhMVXVtJvORxnr94EwuR2BcSg"
    },
    body: form
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || "Upload failed.");
  }
  if (typeof body.path !== "string") {
    throw new Error("Unexpected response from upload server.");
  }
  return body.path;
}
async function signReviewPhoto(path) {
  const real = extractPath(path);
  if (!real) return path;
  const { data, error } = await supabase.storage.from("review-photos").createSignedUrl(real, SIGNED_URL_EXPIRY);
  if (error) return null;
  return data.signedUrl;
}
function averageRating(reviews) {
  if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
  const valid = reviews.filter((r) => Number.isFinite(r.rating));
  if (valid.length === 0) return { avg: 0, count: 0 };
  const sum = valid.reduce((a, r) => a + r.rating, 0);
  return { avg: sum / valid.length, count: valid.length };
}
function Stars({
  value,
  onChange,
  size = 4
}) {
  const cls = `h-${size} w-${size}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: onChange ? () => onChange(i) : void 0,
      "aria-label": `${i} star${i > 1 ? "s" : ""}`,
      className: onChange ? "cursor-pointer" : "cursor-default",
      disabled: !onChange,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Star,
        {
          className: `${cls} ${i <= value ? "fill-primary text-primary" : "text-silver/30"}`
        }
      )
    },
    i
  )) });
}
function ProductReviews({ productId }) {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useProductReviews(productId);
  const create = useCreateReview();
  const { avg, count } = averageRating(reviews);
  const [rating, setRating] = reactExports.useState(5);
  const [title, setTitle] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const [photos, setPhotos] = reactExports.useState([]);
  const [uploading, setUploading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const onFiles = async (files) => {
    if (!files || files.length === 0) return;
    setErr(null);
    setUploading(true);
    try {
      const next = [];
      for (const f of Array.from(files).slice(0, 4 - photos.length)) {
        const path = await uploadReviewPhoto(f);
        const preview = await signReviewPhoto(path) ?? "";
        next.push({ path, preview });
      }
      setPhotos((p) => [...p, ...next]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await create.mutateAsync({
        product_id: productId,
        rating,
        title: title || null,
        body,
        photos: photos.map((p) => p.path)
      });
      setTitle("");
      setBody("");
      setPhotos([]);
      setRating(5);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : String(e2));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-16 border-t border-border/40 pt-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between mb-6 flex-wrap gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl lg:text-3xl", children: "Crew reviews" }),
      count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stars, { value: Math.round(avg) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] uppercase tracking-widest text-silver/70", children: [
          avg.toFixed(1),
          " · ",
          count,
          " review",
          count === 1 ? "" : "s"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] uppercase tracking-widest text-silver/50 mt-2", children: "No reviews yet — be the first." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-4", children: "Leave a review" }),
        !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-silver/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/account", className: "text-primary underline-offset-4 hover:underline", children: "Sign in" }),
          " ",
          "to share your setup."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stars, { value: rating, onChange: setRating, size: 5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: title,
              onChange: (e) => setTitle(e.target.value),
              placeholder: "Headline (optional)",
              className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              required: true,
              rows: 4,
              value: body,
              onChange: (e) => setBody(e.target.value),
              placeholder: "How does it ride? Sizing? Setup tips?",
              className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-border/60 hover:border-primary font-mono text-[10px] uppercase tracking-widest text-silver", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
              uploading ? "Uploading…" : `Add photos (${photos.length}/4)`,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "file",
                  accept: "image/*",
                  multiple: true,
                  hidden: true,
                  disabled: uploading || photos.length >= 4,
                  onChange: (e) => onFiles(e.target.files)
                }
              )
            ] }),
            photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 mt-3", children: photos.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: entry.preview,
                  alt: "",
                  className: "w-full h-full object-cover border border-border/60"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setPhotos((p) => p.filter((_, idx) => idx !== i)),
                  className: "absolute top-1 right-1 h-5 w-5 bg-background/80 border border-border/60 flex items-center justify-center",
                  "aria-label": "Remove photo",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                }
              )
            ] }, entry.path)) })
          ] }),
          err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-red-400", children: err }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: create.isPending,
              className: "w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 disabled:opacity-50",
              children: create.isPending ? "Posting…" : "Post review"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-5", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60", children: "Loading reviews…" }) : reviews && reviews.length > 0 ? reviews.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewCard, { review: r }, r.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-dashed border-border/60 p-8 text-center font-mono text-xs uppercase tracking-widest text-silver/50", children: "No reviews yet" }) })
    ] })
  ] });
}
function ReviewCard({ review }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "border border-border/60 bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stars, { value: review.rating }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: new Date(review.created_at).toLocaleDateString() })
    ] }),
    review.title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base mb-2", children: review.title }),
    review.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/90 leading-relaxed whitespace-pre-wrap", children: review.body }),
    review.photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 mt-4", children: review.photos.map((url) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: url,
        target: "_blank",
        rel: "noreferrer",
        className: "block aspect-square overflow-hidden border border-border/60",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "w-full h-full object-cover" })
      },
      url
    )) })
  ] });
}
function ProductPage() {
  const {
    slug
  } = Route.useParams();
  const {
    data: product,
    isLoading,
    error
  } = useProduct(slug);
  const {
    data: allProducts
  } = useProducts();
  const [activeImg, setActiveImg] = reactExports.useState(0);
  const [size, setSize] = reactExports.useState("");
  const [qty, setQty] = reactExports.useState(1);
  const [sent, setSent] = reactExports.useState(false);
  const [mode, setMode] = reactExports.useState("inquiry");
  const [message, setMessage] = reactExports.useState("");
  const {
    has: wishHas,
    toggle: wishToggle
  } = useWishlist();
  const {
    add: cartAdd
  } = useCart();
  const related = reactExports.useMemo(() => product ? recommendRelated(product, allProducts ?? []) : [], [product, allProducts]);
  const {
    data: reviews
  } = useProductReviews(product?.id);
  const {
    avg,
    count
  } = averageRating(reviews);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-3xl mx-auto px-6 py-32 text-center font-mono text-sm text-silver/60", children: "Loading…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] });
  }
  if (error || !product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-3xl mx-auto px-6 py-32 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl mb-4", children: "Piece not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "font-mono text-xs uppercase tracking-widest text-primary", children: "← Back to the shop" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] });
  }
  const saved = wishHas(product.slug);
  const gallery = productGallery(product);
  const onSale = product.sale_price !== null && product.sale_price < product.price;
  const oos = isOutOfStock(product);
  const low = !oos && isLowStock(product);
  const price = effectivePrice(product);
  const needsSize = product.sizes && product.sizes.length > 0;
  const handleAddToCart = () => {
    if (needsSize && !size) {
      alert("Please choose a size first.");
      return;
    }
    for (let i = 0; i < qty; i++) cartAdd(product.slug);
  };
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/70 hover:text-primary mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
        " Back to shop"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: gallery[activeImg], alt: product.title, className: "w-full h-full object-cover" }) }) }),
          gallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 mt-2", children: gallery.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveImg(i), className: `aspect-square overflow-hidden border-2 transition-colors ${activeImg === i ? "border-primary" : "border-border/60 hover:border-silver"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "", className: "w-full h-full object-cover" }) }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-3", children: [
            DEPARTMENT_LABELS[product.department],
            product.product_type ? ` · ${product.product_type}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl lg:text-5xl leading-none mb-4", children: product.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-4 w-4 ${i <= Math.round(avg) ? "fill-primary text-primary" : "text-silver/30"}` }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#reviews", className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary", children: count > 0 ? `${avg.toFixed(1)} · ${count} review${count === 1 ? "" : "s"}` : "No reviews yet" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-baseline gap-3 mb-2", children: onSale ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-2xl text-primary", children: [
              "$",
              product.sale_price
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-lg text-silver/50 line-through", children: [
              "$",
              product.price
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-2xl text-silver", children: [
            "$",
            price
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest mb-8", children: oos ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-silver/60", children: "Out of stock" }) : low ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-300", children: [
            "Only ",
            product.stock_count,
            " left"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "In stock" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/90 leading-relaxed mb-8", children: product.description }),
          needsSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: product.sizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSize(s), className: `px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: s }, s)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Quantity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center border border-border/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((q) => Math.max(1, q - 1)), className: "h-10 w-10 flex items-center justify-center text-silver hover:text-primary", "aria-label": "Decrease", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12 text-center font-mono text-sm", children: qty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((q) => Math.min(product.stock_count || 99, q + 1)), className: "h-10 w-10 flex items-center justify-center text-silver hover:text-primary", "aria-label": "Increase", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAddToCart, disabled: oos, className: "flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity disabled:opacity-40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }),
              " ",
              oos ? "Out of stock" : "Add to cart"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => wishToggle(product.slug), "aria-label": saved ? "Remove from wishlist" : "Save to wishlist", className: `h-12 w-12 flex items-center justify-center border transition-colors ${saved ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-silver hover:border-primary"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-5 w-5 ${saved ? "fill-primary" : ""}` }) })
          ] }),
          product.details.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "border-y border-border/60 divide-y divide-border/60 mb-6", children: product.details.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-3 font-mono text-xs uppercase tracking-widest text-silver/80", children: [
            "— ",
            d
          ] }, d)) }),
          Object.keys(product.specs).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card/40 p-5 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-3", children: "Specifications" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "grid grid-cols-2 gap-y-2 text-xs font-mono", children: Object.entries(product.specs).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contents", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-silver/60 uppercase tracking-widest", children: k.replace(/_/g, " ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-silver", children: String(v) })
            ] }, k)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-5", children: [["inquiry", "Inquire"], ["custom", "Custom order"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(k), className: `flex-1 font-mono text-[10px] uppercase tracking-widest px-3 py-2 border transition-colors ${mode === k ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: label }, k)) }),
            sent ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-primary py-6 text-center", children: "Thanks — we'll be in touch within 48 hours." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", placeholder: "Your email", className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, value: message, onChange: (e) => setMessage(e.target.value), rows: 4, placeholder: mode === "custom" ? "Tell us about the custom build — dimensions, colours, timeline…" : "Questions about this piece? Stock, sizing, shipping…", className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity", children: mode === "custom" ? "Send custom request" : "Send inquiry" })
            ] })
          ] })
        ] })
      ] }),
      related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-20 border-t border-border/40 pt-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl lg:text-3xl mb-2", children: "You might also need" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] uppercase tracking-widest text-silver/60 mb-6", children: relatedHeading(product) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: related.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop/$slug", params: {
          slug: r.slug
        }, className: "group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProductBadges, { product: r }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: productImage(r), alt: r.title, loading: "lazy", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-1", children: DEPARTMENT_LABELS[r.department] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base mb-1", children: r.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-silver", children: [
              "$",
              effectivePrice(r)
            ] })
          ] })
        ] }, r.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "reviews", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductReviews, { productId: product.id }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function recommendRelated(current, all) {
  const others = all.filter((p) => p.id !== current.id);
  const type = (current.product_type ?? "").toLowerCase();
  let targetTypes = [];
  if (current.department === "skate" && type.includes("deck")) {
    targetTypes = ["trucks", "wheels", "bearings", "grip", "parts", "rails"];
  } else if (current.department === "skate" && type.includes("complete")) {
    targetTypes = ["wheels", "bearings", "grip", "stickers"];
  } else if (current.department === "surf" && (type.includes("surfboard") || type.includes("shortboard") || type.includes("longboard") || type.includes("fish") || type.includes("softtop"))) {
    targetTypes = ["fins", "leash", "surf-wax", "traction", "boardbag"];
  } else if (current.department === "surf" && type.includes("wetsuit")) {
    targetTypes = ["rashguard", "surf-wax", "boardbag"];
  }
  if (targetTypes.length > 0) {
    const matched = others.filter((p) => p.department === current.department && targetTypes.includes((p.product_type ?? "").toLowerCase()));
    if (matched.length > 0) return matched.slice(0, 4);
  }
  return others.filter((p) => p.department === current.department).slice(0, 4);
}
function relatedHeading(p) {
  const t = (p.product_type ?? "").toLowerCase();
  if (p.department === "skate" && t.includes("deck")) return "Trucks, wheels & bearings to finish the build";
  if (p.department === "surf" && (t.includes("board") || t.includes("fish") || t.includes("softtop"))) return "Fins, leashes & wax for this board";
  return "More from the same department";
}
export {
  ProductPage as component
};

import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-DYwJbDLa.mjs";
import { z as zodValidator, f as fallback } from "../_libs/tanstack__zod-adapter.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { X, M as MessageCircle, E as ExternalLink, F as FileText, R as RotateCcw, C as Clock, P as Package, a as Check, T as TriangleAlert, S as Shield, b as Sparkles, W as Waves, c as Skull, d as Plus, e as MapPin, N as Navigation, f as Calendar, g as CalendarPlus, U as Users, h as Trophy, V as Video, i as Upload, B as BookOpen, j as Target, k as ChevronRight, I as Info, l as Wrench, Z as Zap, m as Sun, D as Droplets, n as ChevronDown, H as Heart, o as ShoppingCart, p as User, q as Menu, r as Instagram, Y as Youtube, s as Mail, L as Lock, t as ThumbsUp, u as Search, v as Truck } from "../_libs/lucide-react.mjs";
import { f as format, p as parseISO } from "../_libs/date-fns.mjs";
import { s as stringType, o as objectType, n as numberType, e as enumType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const SENSITIVE_PATTERNS = [
  /relation/i,
  /table/i,
  /column/i,
  /constraint/i,
  /index/i,
  /foreign key/i,
  /primary key/i,
  /unique/i,
  /violates/i,
  /duplicate key/i,
  /null value/i,
  /insert/i,
  /update/i,
  /delete/i,
  /select/i,
  /supabase/i,
  /postgres/i,
  /postgresql/i,
  /pg_/i,
  /public\./i,
  /private\./i,
  /auth\./i,
  /function/i,
  /permission denied/i,
  /rls/i,
  /row level security/i,
  /policy/i
];
const GENERIC_MESSAGES = {
  "Invalid login credentials": "Invalid email or password",
  "Email not confirmed": "Please verify your email address first",
  "User already registered": "An account with this email already exists",
  "Password should be at least": "Password is too short",
  "Unable to validate email": "Invalid email address"
};
function sanitizeError(error) {
  if (!error) return "Something went wrong";
  if (typeof error === "string") {
    return sanitizeMessage(error);
  }
  if (error instanceof Error) {
    return sanitizeMessage(error.message);
  }
  if (typeof error === "object" && error !== null) {
    const obj = error;
    if (typeof obj.message === "string") {
      return sanitizeMessage(obj.message);
    }
    if (typeof obj.error === "string") {
      return sanitizeMessage(obj.error);
    }
    if (typeof obj.error_description === "string") {
      return sanitizeMessage(obj.error_description);
    }
  }
  return "Something went wrong";
}
function sanitizeMessage(message) {
  for (const [key, value] of Object.entries(GENERIC_MESSAGES)) {
    if (message.includes(key)) {
      return value;
    }
  }
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(message)) {
      return "Something went wrong. Please try again.";
    }
  }
  if (message.length > 200) {
    return "Something went wrong. Please try again.";
  }
  return message;
}
const SETTING_KEYS = [
  "discord_invite_url",
  "instagram_url",
  "youtube_url",
  "tiktok_url",
  "facebook_url",
  "contact_email_primary",
  "contact_email_secondary"
];
const SETTING_LABELS = {
  discord_invite_url: "Discord invite URL",
  instagram_url: "Instagram URL",
  youtube_url: "YouTube URL",
  tiktok_url: "TikTok URL",
  facebook_url: "Facebook URL",
  contact_email_primary: "Primary contact email",
  contact_email_secondary: "Secondary contact email"
};
function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw new Error(sanitizeError(error));
      const map = Object.fromEntries(SETTING_KEYS.map((k) => [k, ""]));
      for (const row of data || []) {
        if (SETTING_KEYS.includes(row.key)) {
          map[row.key] = row.value || "";
        }
      }
      return map;
    },
    staleTime: 6e4
  });
}
function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }) => {
      const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: (/* @__PURE__ */ new Date()).toISOString() }, { onConflict: "key" });
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] })
  });
}
function LiamChatWidget() {
  const [open, setOpen] = reactExports.useState(false);
  const { data: settings } = useSiteSettings();
  const discordUrl = settings?.discord_invite_url;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        className: "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-silver text-background shadow-lg flex items-center justify-center hover:bg-primary transition-colors group",
        "aria-label": "Ask Liam",
        children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" })
        ] })
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-24 right-6 z-50 w-72 border border-border/60 bg-card shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-silver/10 flex items-center justify-center border border-silver/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-sm text-silver", children: "LL" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm", children: "Liam's Dispatch" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-silver/50", children: "Ask Liam anything" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/80", children: "Hey, I'm Liam. Need gear advice, a stoke check, or just want to chat about last swell? Hit me up on Discord." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/50 italic", children: `"The waves wait for no one. But I'll answer your DMs within 24 hours."` }),
        discordUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: discordUrl,
            target: "_blank",
            rel: "noreferrer noopener",
            className: "flex items-center justify-center gap-2 w-full bg-silver text-background font-mono text-xs uppercase tracking-widest py-3 hover:bg-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
              "Chat on Discord",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-silver/40", children: "Discord link coming soon" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "mailto:contact@liminalsandsco.com",
            className: "block text-center text-xs text-silver/60 hover:text-primary transition-colors",
            children: "contact@liminalsandsco.com"
          }
        ) })
      ] })
    ] })
  ] });
}
const appCss = "/assets/styles-DnQtrSSD.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  const safeMessage = sanitizeError(error);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: safeMessage }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$o = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Liminal S & S Co" },
      {
        name: "description",
        content: "Liminal Surf and Skate Company offers custom hand-crafted skateboards and surfboards, apparel, and accessories."
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Liminal S & S Co" },
      {
        property: "og:description",
        content: "Liminal Surf and Skate Company offers custom hand-crafted skateboards and surfboards, apparel, and accessories."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Liminal S & S Co" },
      {
        name: "twitter:description",
        content: "Liminal Surf and Skate Company offers custom hand-crafted skateboards and surfboards, apparel, and accessories."
      },
      {
        property: "og:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fddfa0e7-b38c-47dc-be33-0a65c5757b14/id-preview-03df4814--fdc75a8e-d934-460e-8005-76599c902cb3.lovable.app-1779942966019.png"
      },
      {
        name: "twitter:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fddfa0e7-b38c-47dc-be33-0a65c5757b14/id-preview-03df4814--fdc75a8e-d934-460e-8005-76599c902cb3.lovable.app-1779942966019.png"
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$o.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthSync, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LiamChatWidget, {})
  ] });
}
function AuthSync() {
  const router2 = useRouter();
  const queryClient = useQueryClient();
  reactExports.useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      router2.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  return null;
}
const $$splitComponentImporter$f = () => import("./wishlist-CwclbKo4.mjs");
const Route$n = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{
      title: "Wishlist — Liminal Surf & Skate Co"
    }, {
      name: "description",
      content: "Your saved pieces — boards, gear, and one-offs waiting for payday."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./support-wxXpjVi7.mjs");
const Route$m = createFileRoute("/support")({
  head: () => ({
    meta: [{
      title: "Support — Liminal Surf & Skate Co"
    }, {
      name: "description",
      content: "Help center: size charts, shipping info, returns, wetsuit care, skate gear FAQs, and how to reach us."
    }, {
      property: "og:title",
      content: "Support — Liminal Surf & Skate Co"
    }, {
      property: "og:description",
      content: "FAQs, contact, and policies for Liminal customers."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const PRICE_MIN = 0;
const PRICE_MAX = 2e3;
const $$splitComponentImporter$d = () => import("./shop-BgEdzlMb.mjs");
const csvSchema = fallback(stringType(), "").default("");
const shopSearchSchema = objectType({
  q: fallback(stringType(), "").default(""),
  sort: fallback(enumType(["newest", "oldest", "price-asc", "price-desc"]), "newest").default("newest"),
  dept: fallback(enumType(["skate", "surf", "clothing", "accessories", "other", "all"]), "all").default("all"),
  type: fallback(stringType(), "").default(""),
  category: fallback(stringType(), "").default(""),
  colour: csvSchema,
  // CSV
  gender: csvSchema,
  // CSV
  size: csvSchema,
  // CSV
  min: fallback(numberType().min(0), PRICE_MIN).default(PRICE_MIN),
  max: fallback(numberType().min(0), PRICE_MAX).default(PRICE_MAX)
});
const Route$l = createFileRoute("/shop")({
  validateSearch: zodValidator(shopSearchSchema),
  head: () => ({
    meta: [{
      title: "Shop — Liminal Surf & Skate Co"
    }, {
      name: "description",
      content: "Surfboards, skateboards, apparel, footwear, accessories and hand-crafted pieces from Liminal."
    }, {
      property: "og:title",
      content: "Shop — Liminal Surf & Skate Co"
    }, {
      property: "og:description",
      content: "Everything we make, in one place."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./search-Q2Mvtnjg.mjs");
const schema = objectType({
  q: fallback(stringType(), "").default("")
});
const Route$k = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: ({
    match: match2
  }) => {
    const q = match2.search.q ?? "";
    const title = q ? `Search: ${q} — Liminal` : "Search — Liminal";
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: "Search products, articles, weekly letters and community events at Liminal Surf & Skate Co."
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const logo = "/assets/liminal-logo-C9sbFkzm.png";
const KEY$1 = "liminal:wishlist";
const EVT$1 = "liminal:wishlist-change";
function read$1() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY$1) || "[]");
  } catch {
    return [];
  }
}
function write$1(slugs) {
  localStorage.setItem(KEY$1, JSON.stringify(slugs));
  window.dispatchEvent(new Event(EVT$1));
}
function useWishlist() {
  const [slugs, setSlugs] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setSlugs(read$1());
    const sync = () => setSlugs(read$1());
    window.addEventListener(EVT$1, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT$1, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const has = reactExports.useCallback((slug) => slugs.includes(slug), [slugs]);
  const toggle = reactExports.useCallback((slug) => {
    const cur = read$1();
    write$1(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  }, []);
  const remove = reactExports.useCallback((slug) => {
    write$1(read$1().filter((s) => s !== slug));
  }, []);
  return { slugs, has, toggle, remove, count: slugs.length };
}
const KEY = "liminal:cart";
const EVT = "liminal:cart-change";
function read() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
}
function useCart() {
  const [items, setItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const add = reactExports.useCallback((slug, qty = 1) => {
    const cur = read();
    const idx = cur.findIndex((i) => i.slug === slug);
    if (idx >= 0) cur[idx].qty += qty;
    else cur.push({ slug, qty });
    write(cur);
  }, []);
  const setQty = reactExports.useCallback((slug, qty) => {
    const cur = read().map((i) => i.slug === slug ? { ...i, qty } : i).filter((i) => i.qty > 0);
    write(cur);
  }, []);
  const remove = reactExports.useCallback((slug) => {
    write(read().filter((i) => i.slug !== slug));
  }, []);
  const clear = reactExports.useCallback(() => write([]), []);
  const count = items.reduce((n, i) => n + i.qty, 0);
  return { items, add, setQty, remove, clear, count };
}
const deck = "/assets/hero-deck-iRQg6PUY.jpg";
const surfboard = "/assets/craft-surfboard-CZf2zqPv.jpg";
const apparel = "/assets/apparel-BcarbnMa.jpg";
const accessories = "/assets/accessories-ctHW1Lcp.jpg";
const DEPARTMENT_LABELS = {
  skate: "Skate",
  surf: "Surf",
  clothing: "Clothing",
  accessories: "Accessories"
};
const ALL_DEPARTMENTS = ["skate", "surf", "clothing", "accessories"];
const PLACEHOLDER = {
  skate: deck,
  surf: surfboard,
  clothing: apparel,
  accessories
};
function productImage(p, idx = 0) {
  if (p.images && p.images.length > 0) return p.images[Math.min(idx, p.images.length - 1)];
  return PLACEHOLDER[p.department] ?? deck;
}
function productGallery(p) {
  if (p.images && p.images.length > 0) return p.images;
  return [PLACEHOLDER[p.department] ?? deck];
}
function effectivePrice(p) {
  return p.sale_price && p.sale_price > 0 && p.sale_price < p.price ? p.sale_price : p.price;
}
function isLowStock(p) {
  return p.stock_count > 0 && p.stock_count <= 3;
}
function isOutOfStock(p) {
  return p.stock_count <= 0;
}
function normalize$2(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department || "other",
    product_type: row.product_type ?? null,
    target_group: row.target_group ?? "unisex",
    description: row.description ?? "",
    details: Array.isArray(row.details) ? row.details : [],
    price: Number(row.price ?? 0),
    sale_price: row.sale_price !== null && row.sale_price !== void 0 ? Number(row.sale_price) : null,
    colour: row.colour ?? null,
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    stock_count: Number(row.stock_count ?? 0),
    images: Array.isArray(row.images) ? row.images : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    specs: row.specs && typeof row.specs === "object" && !Array.isArray(row.specs) ? row.specs : {},
    featured: Boolean(row.featured),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}
async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(sanitizeError(error));
  return (data ?? []).map(normalize$2);
}
async function fetchProductBySlug(slug) {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(sanitizeError(error));
  return data ? normalize$2(data) : null;
}
function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 3e4
  });
}
function useProduct(slug) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => fetchProductBySlug(slug),
    staleTime: 3e4
  });
}
const SORT_LABELS = {
  newest: "Newest added",
  oldest: "Oldest added",
  "price-asc": "Price: low → high",
  "price-desc": "Price: high → low"
};
function sortProducts(list, sort) {
  const copy = list.slice();
  copy.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return effectivePrice(a) - effectivePrice(b);
      case "price-desc":
        return effectivePrice(b) - effectivePrice(a);
      case "oldest":
        return a.created_at.localeCompare(b.created_at);
      case "newest":
      default:
        return b.created_at.localeCompare(a.created_at);
    }
  });
  return copy;
}
const MEGA_MENU = {
  skate: {
    allLabel: "Shop All Skate",
    columns: [
      {
        title: "Decks",
        links: [
          { label: "Shop All", type: "deck" },
          { label: "Featured Decks", type: "deck", category: "featured" },
          { label: "Logo Decks", type: "deck", category: "logo" },
          { label: "Pro Models", type: "deck", category: "pro" },
          { label: "Reissues", type: "deck", category: "reissue" },
          { label: "Shaped Decks", type: "deck", category: "shaped" }
        ]
      },
      {
        title: "Tech Decks",
        links: [
          { label: "Shop All", type: "deck", category: "tech" },
          { label: "VX™ Technology", type: "deck", category: "vx" }
        ]
      },
      {
        title: "Completes",
        links: [
          { label: "Shop All", type: "complete" },
          { label: "Street / Park", type: "complete", category: "street" },
          { label: "Cruisers & Longboards", type: "cruiser" }
        ]
      },
      {
        title: "Accessories",
        links: [
          { label: "Shop All", type: "skate-accessory" },
          { label: "Trucks", type: "trucks" },
          { label: "Wheels & Bearings", type: "wheels" },
          { label: "Grip Tape", type: "grip" },
          { label: "Rails", type: "rails" },
          { label: "Parts", type: "parts" },
          { label: "Curb Wax", type: "curb-wax" },
          { label: "Stickers", type: "stickers" }
        ]
      }
    ]
  },
  surf: {
    allLabel: "Shop All Surf",
    columns: [
      {
        title: "Surfboards",
        links: [
          { label: "Shop All", type: "surfboard" },
          { label: "Shortboards", type: "shortboard" },
          { label: "Longboards", type: "longboard" },
          { label: "Fish & Funboards", type: "fish" },
          { label: "Soft Tops / Foamies", type: "softtop" }
        ]
      },
      {
        title: "Wetsuits & Neoprene",
        links: [
          { label: "Shop All", type: "wetsuit" },
          { label: "Fullsuits (3/2 & 4/3)", type: "wetsuit", category: "fullsuit" },
          { label: "Springsuits", type: "wetsuit", category: "spring" },
          { label: "Rash Guards & UV", type: "rashguard" }
        ]
      },
      {
        title: "Hardware",
        links: [
          { label: "Shop All", type: "surf-accessory" },
          { label: "Fins", type: "fins" },
          { label: "Leashes", type: "leash" },
          { label: "Traction Pads", type: "traction" },
          { label: "Surf Wax", type: "surf-wax" },
          { label: "Board Bags & Socks", type: "boardbag" }
        ]
      }
    ]
  },
  clothing: {
    allLabel: "Shop All Clothing",
    columns: [
      {
        title: "Mens",
        links: [
          { label: "Shop All", category: "men" },
          { label: "Tees", type: "tee", category: "men" },
          { label: "Sweatshirts", type: "sweatshirt", category: "men" },
          { label: "Hoodies", type: "hoodie", category: "men" },
          { label: "Pants", type: "pants", category: "men" },
          { label: "Shorts", type: "shorts", category: "men" }
        ]
      },
      {
        title: "Womens",
        links: [
          { label: "Shop All", category: "women" },
          { label: "Tees", type: "tee", category: "women" },
          { label: "Sweatshirts", type: "sweatshirt", category: "women" },
          { label: "Hoodies", type: "hoodie", category: "women" }
        ]
      },
      {
        title: "Boys",
        links: [
          { label: "Shop All", category: "boys" },
          { label: "Tees", type: "tee", category: "boys" },
          { label: "Sweatshirts", type: "sweatshirt", category: "boys" },
          { label: "Hoodies", type: "hoodie", category: "boys" },
          { label: "Pants", type: "pants", category: "boys" },
          { label: "Shorts", type: "shorts", category: "boys" }
        ]
      },
      {
        title: "Girls",
        links: [
          { label: "Shop All", category: "girls" },
          { label: "Tees", type: "tee", category: "girls" },
          { label: "Dresses", type: "dress", category: "girls" },
          { label: "Sweatshirts", type: "sweatshirt", category: "girls" },
          { label: "Hoodies", type: "hoodie", category: "girls" },
          { label: "Pants", type: "pants", category: "girls" },
          { label: "Shorts", type: "shorts", category: "girls" }
        ]
      }
    ]
  },
  accessories: {
    allLabel: "Shop All Accessories",
    columns: [
      {
        title: "Accessories",
        links: [
          { label: "Shop All" },
          { label: "Socks", type: "socks" },
          { label: "Bags & Backpacks", type: "bag" },
          { label: "Headwear", type: "headwear" },
          { label: "Footwear", type: "footwear" },
          { label: "Beach", type: "beach" },
          { label: "School Essentials", type: "school" },
          { label: "Stickers", type: "stickers" }
        ]
      },
      {
        title: "Lifestyle",
        links: [
          { label: "Fashion", type: "fashion" },
          { label: "Jewellery", type: "jewellery" },
          { label: "Artisan Products", type: "artisan" }
        ]
      }
    ]
  }
};
const COLOURS = [
  "black",
  "blue",
  "brown",
  "grey",
  "pink",
  "red",
  "white",
  "yellow",
  "multi",
  "orange",
  "purple"
];
const GENDERS = ["men", "women", "unisex", "boys", "girls"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "S/M", "L/XL", "2-8"];
const DECK_SPEC_FIELDS = [
  { key: "deck_width", label: "Deck Width" },
  { key: "deck_length", label: "Deck Length" },
  { key: "deck_nose_length", label: "Nose Length" },
  { key: "deck_shape", label: "Deck Shape" },
  { key: "deck_type", label: "Deck Type" },
  { key: "deck_wheelbase", label: "Wheelbase" }
];
const SURF_SPEC_FIELDS = [
  { key: "wetsuit_thickness", label: "Wetsuit Thickness" },
  { key: "fin_setup", label: "Fin Setup" }
];
function normalize$1(row) {
  return {
    id: row.id,
    subject: row.subject,
    excerpt: row.excerpt ?? null,
    body: row.body ?? "",
    sent_at: row.sent_at,
    scheduled_for: row.scheduled_for ?? null,
    cover_image: row.cover_image ?? null,
    links: Array.isArray(row.links) ? row.links : [],
    published: Boolean(row.published ?? true)
  };
}
async function fetchNewsletters() {
  const { data, error } = await supabase.from("newsletters").select("*").order("sent_at", { ascending: false });
  if (error) throw new Error(sanitizeError(error));
  return (data ?? []).map(normalize$1);
}
function useNewsletters() {
  return useQuery({
    queryKey: ["newsletters"],
    queryFn: fetchNewsletters,
    staleTime: 6e4
  });
}
function nextFridayISO(from = /* @__PURE__ */ new Date()) {
  const d = new Date(from);
  const day = d.getDay();
  const delta = (5 - day + 7) % 7;
  d.setDate(d.getDate() + delta);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}
const EVENT_CATEGORY_LABELS = {
  jam: "Skate Jam",
  cleanup: "Beach Cleanup",
  comp: "Surf Comp",
  party: "Shop Party",
  other: "Other"
};
function normalize(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    location: row.location ?? "",
    start_at: row.start_at,
    end_at: row.end_at,
    image_url: row.image_url,
    rsvp_url: row.rsvp_url,
    category: row.category || "other",
    published: Boolean(row.published),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}
function useEvents(opts) {
  return useQuery({
    queryKey: ["events", opts],
    queryFn: async () => {
      let q = supabase.from("events").select("*").order("start_at", { ascending: true });
      if (!opts?.includeUnpublished) q = q.eq("published", true);
      if (opts?.upcomingOnly)
        q = q.gte("start_at", new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString());
      const { data, error } = await q;
      if (error) throw new Error(sanitizeError(error));
      return (data ?? []).map(normalize);
    },
    staleTime: 3e4
  });
}
function useUpsertEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e) => {
      const payload = {
        title: e.title,
        description: e.description ?? "",
        location: e.location ?? "",
        start_at: e.start_at,
        end_at: e.end_at || null,
        image_url: e.image_url || null,
        rsvp_url: e.rsvp_url || null,
        category: e.category || "jam",
        published: e.published ?? true
      };
      if (e.id) {
        const { error } = await supabase.from("events").update(payload).eq("id", e.id);
        if (error) throw new Error(sanitizeError(error));
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw new Error(sanitizeError(error));
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] })
  });
}
function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] })
  });
}
function gcalFormat(iso) {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
}
function googleCalendarUrl(e) {
  const start = gcalFormat(e.start_at);
  const end = gcalFormat(
    e.end_at || new Date(new Date(e.start_at).getTime() + 2 * 60 * 60 * 1e3).toISOString()
  );
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${start}/${end}`,
    details: e.description || "",
    location: e.location || ""
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
function formatEventDate(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(void 0, { weekday: "short", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" })
  };
}
const posts = [
  {
    slug: "between-wave-and-concrete",
    title: "Between the Wave and the Concrete",
    excerpt: "Why we started Liminal — a love letter to the in-between hours and the people who live there.",
    date: "2026-05-12",
    readTime: "4 min",
    category: "Workshop Notes",
    body: [
      "There's an hour around dusk where the parking lot empties and the swell goes glassy. That hour is where Liminal lives.",
      "We never wanted to be a brand. We wanted a bench, a few good blanks, and the freedom to make boards that felt right under our feet.",
      "Every deck that leaves the workshop is signed by hand. Not for marketing. For accountability. If it rides wrong, we want to know."
    ]
  },
  {
    slug: "shaping-a-deck-by-hand",
    title: "Shaping a Deck by Hand: A Slow Process",
    excerpt: "From blank to ride-ready in seven days. A walk-through of how a single Liminal deck comes together.",
    date: "2026-05-02",
    readTime: "6 min",
    category: "Craft",
    body: [
      "Day one is selection. We sort blanks by grain, density, and weight. About a third never make the cut.",
      "Days two through four are the shape — planer, spokeshave, sandpaper, repeat. We chase a concave, not a number.",
      "Day five is graphics. Day six, seal. Day seven, you ride it. Oh yeah, not bad."
    ]
  },
  {
    slug: "five-spots-we-keep-coming-back-to",
    title: "Five Spots We Keep Coming Back To",
    excerpt: "From a forgotten harbor wall to a sunrise reef — the places that shaped how Liminal thinks about boards.",
    date: "2026-04-18",
    readTime: "5 min",
    category: "Field Notes",
    body: [
      "We don't share GPS coordinates. We share the feeling. These five places have shaped almost every board we've made.",
      "Some are reef. Some are concrete banks. All of them ask a different question of the deck under your feet.",
      "If you've found your own version of these, you already understand what we're trying to build."
    ]
  }
];
const getPost = (slug) => posts.find((p) => p.slug === slug);
function match(haystacks, term) {
  return haystacks.some((h) => (h ?? "").toLowerCase().includes(term));
}
function highlightText(text, term) {
  if (!term) return text;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(re, "<mark>$1</mark>");
}
function useRecentSearches() {
  const [recents, setRecents] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recent_searches") || "[]").slice(0, 5);
    } catch {
      return [];
    }
  });
  const add = (s) => {
    if (!s.trim()) return;
    const next = [s, ...recents.filter((r) => r.toLowerCase() !== s.toLowerCase())].slice(0, 5);
    setRecents(next);
    localStorage.setItem("recent_searches", JSON.stringify(next));
  };
  return [recents, add];
}
function useGlobalSearch(query, limitPerGroup = 20) {
  const { data: products, isLoading: lp } = useProducts();
  const { data: newsletters, isLoading: ln } = useNewsletters();
  const { data: events, isLoading: le } = useEvents({ upcomingOnly: false });
  return reactExports.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return { products: [], posts: [], newsletters: [], events: [], total: 0, loading: lp || ln || le };
    }
    const prod = (products ?? []).filter(
      (p) => match(
        [p.title, p.description, p.product_type, p.colour, p.target_group, ...p.tags ?? []],
        term
      )
    ).slice(0, limitPerGroup);
    const art = posts.filter((p) => match([p.title, p.excerpt, p.category, ...p.body], term)).slice(0, limitPerGroup);
    const news = (newsletters ?? []).filter((n) => match([n.subject, n.excerpt, n.body], term)).slice(0, limitPerGroup);
    const ev = (events ?? []).filter((e) => match([e.title, e.description, e.location, e.category], term)).slice(0, limitPerGroup).map((e) => ({
      id: e.id,
      title: e.title,
      date: new Date(e.start_at).toLocaleDateString("en-AU", { month: "short", day: "2-digit" }),
      detail: e.description || "",
      start_at: e.start_at,
      category: e.category
    }));
    return {
      products: prod,
      posts: art,
      newsletters: news,
      events: ev,
      total: prod.length + art.length + news.length + ev.length,
      loading: lp || ln || le
    };
  }, [query, products, newsletters, events, lp, ln, le, limitPerGroup]);
}
function safeHtml(html) {
  return { __html: html };
}
function GlobalSearch({ compact = false }) {
  const [q, setQ] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const [selectedIndex, setSelectedIndex] = reactExports.useState(-1);
  const containerRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const navigate = useNavigate();
  const res = useGlobalSearch(q, 4);
  const [recents, addRecent] = useRecentSearches();
  const allItems = reactExports.useMemo(() => {
    const items = [];
    res.products.forEach((p) => items.push({ type: "product", key: `p-${p.id}`, label: p.title, extra: `${DEPARTMENT_LABELS[p.department]} · ${effectivePrice(p)}`, to: "/shop/$slug", params: { slug: p.slug } }));
    res.posts.forEach((p) => items.push({ type: "article", key: `a-${p.slug}`, label: p.title, extra: p.category, to: "/blog/$slug", params: { slug: p.slug } }));
    res.newsletters.forEach((n) => items.push({ type: "newsletter", key: `n-${n.id}`, label: n.subject, extra: "Newsletter", to: "/blog/$slug", params: { slug: `newsletter-${n.id}` } }));
    res.events.forEach((e) => items.push({ type: "event", key: `e-${e.id}`, label: e.title, extra: `${e.date} · ${e.category}`, to: "/community", hash: "events" }));
    return items;
  }, [res]);
  reactExports.useEffect(() => {
    const onClick = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  const handleKeyDown = (e) => {
    if (!open || !q.trim()) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => prev <= 0 ? allItems.length - 1 : prev - 1);
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && allItems[selectedIndex]) {
        const item = allItems[selectedIndex];
        addRecent(q);
        setOpen(false);
        if (item.to) {
          navigate({ to: item.to, params: item.params, hash: item.hash });
        }
      } else {
        submit();
      }
    }
  };
  const submit = () => {
    const term = q.trim();
    if (!term) return;
    addRecent(term);
    setOpen(false);
    navigate({ to: "/search", search: { q: term } });
  };
  const hasResults = res.total > 0;
  const hasRecents = recents.length > 0 && !q.trim() && open;
  const showNoResults = q.trim() && !res.loading && res.total === 0 && !hasRecents;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: `relative ${compact ? "w-full" : "w-full max-w-md"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-silver/50 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          value: q,
          onChange: (e) => {
            setQ(e.target.value);
            setOpen(true);
            setSelectedIndex(-1);
          },
          onFocus: () => setOpen(true),
          onKeyDown: handleKeyDown,
          placeholder: "Search products, articles, events...",
          "aria-label": "Site-wide search",
          className: "w-full h-9 pl-9 pr-9 bg-card/70 border border-border/60 text-xs font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        }
      ),
      q && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setQ("");
            inputRef.current?.focus();
          },
          "aria-label": "Clear search",
          className: "absolute right-2 top-1/2 -translate-y-1/2 text-silver/50 hover:text-primary",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    open && (hasResults || hasRecents || showNoResults) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 mt-2 max-h-[70vh] overflow-y-auto bg-background border border-border/60 shadow-2xl z-50", children: [
      hasRecents && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Recent Searches", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3" }), count: recents.length, children: recents.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setQ(r);
            setOpen(true);
          },
          className: "flex items-center gap-2 w-full px-3 py-2 hover:bg-card text-left text-xs font-mono text-silver",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 text-silver/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r })
          ]
        },
        r
      )) }),
      showNoResults && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center border-b border-border/40 last:border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-silver/40 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-silver/70 mb-1", children: [
          "No results for ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
            '"',
            q,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/50 mb-4", children: "Try a different keyword or browse our categories." }),
        hasRecents && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2", children: "Recent searches" }),
          recents.slice(0, 3).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setQ(r);
                setOpen(true);
              },
              className: "block w-full text-xs text-primary hover:underline py-1",
              children: r
            },
            r
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-4 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "px-3 py-1.5 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Shop All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", search: { dept: "skate" }, className: "px-3 py-1.5 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Skate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", search: { dept: "surf" }, className: "px-3 py-1.5 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Surf" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "px-3 py-1.5 border border-border/60 text-xs font-mono text-silver hover:border-primary hover:text-primary transition-colors", children: "Blog" })
        ] })
      ] }),
      res.loading && res.total === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 font-mono text-[10px] uppercase tracking-widest text-silver/60", children: "Searching..." }),
      res.products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Products", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3 w-3" }), count: res.products.length, children: res.products.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/shop/$slug",
          params: { slug: p.slug },
          onClick: () => {
            setOpen(false);
            addRecent(q);
          },
          className: `flex items-center gap-3 px-3 py-2 hover:bg-card ${selectedIndex === i ? "bg-primary/10" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: productImage(p), alt: "", className: "h-10 w-10 object-cover bg-card border border-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-primary truncate", children: DEPARTMENT_LABELS[p.department] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver truncate", dangerouslySetInnerHTML: safeHtml(highlightText(p.title, q)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-silver/70 shrink-0", children: [
              "$",
              effectivePrice(p)
            ] })
          ]
        },
        p.id
      )) }),
      res.posts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Articles", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3" }), count: res.posts.length, children: res.posts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/blog/$slug",
          params: { slug: p.slug },
          onClick: () => {
            setOpen(false);
            addRecent(q);
          },
          className: `block px-3 py-2 hover:bg-card ${selectedIndex === res.products.length + i ? "bg-primary/10" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-primary", children: p.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver truncate", dangerouslySetInnerHTML: safeHtml(highlightText(p.title, q)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-silver/60 line-clamp-1", dangerouslySetInnerHTML: safeHtml(highlightText(p.excerpt, q)) })
          ]
        },
        p.slug
      )) }),
      res.newsletters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Weekly Letters", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }), count: res.newsletters.length, children: res.newsletters.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/blog/$slug",
          params: { slug: `newsletter-${n.id}` },
          onClick: () => {
            setOpen(false);
            addRecent(q);
          },
          className: `block px-3 py-2 hover:bg-card ${selectedIndex === res.products.length + res.posts.length + i ? "bg-primary/10" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-primary", children: new Date(n.scheduled_for ?? n.sent_at).toLocaleDateString("en-AU", { month: "short", day: "2-digit" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver truncate", dangerouslySetInnerHTML: safeHtml(highlightText(n.subject, q)) }),
            n.excerpt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-silver/60 line-clamp-1", dangerouslySetInnerHTML: safeHtml(highlightText(n.excerpt, q)) })
          ]
        },
        n.id
      )) }),
      res.events.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Events", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }), count: res.events.length, children: res.events.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/community",
          hash: "events",
          onClick: () => {
            setOpen(false);
            addRecent(q);
          },
          className: `block px-3 py-2 hover:bg-card ${selectedIndex === res.products.length + res.posts.length + res.newsletters.length + i ? "bg-primary/10" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-primary", children: e.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver truncate", dangerouslySetInnerHTML: safeHtml(highlightText(e.title, q)) }),
            e.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-silver/60 line-clamp-1", dangerouslySetInnerHTML: safeHtml(highlightText(e.detail, q)) })
          ]
        },
        e.id
      )) }),
      res.total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setOpen(false);
            addRecent(q);
            navigate({ to: "/search", search: { q } });
          },
          className: "block w-full text-center px-3 py-2.5 border-t border-border/60 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-card",
          children: [
            "See all results ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 inline" })
          ]
        }
      )
    ] })
  ] });
}
function Section({ title, icon, count, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/40 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 pt-2.5 pb-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-silver/60", children: [
        icon,
        " ",
        title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] text-silver/40", children: count })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children })
  ] });
}
function LiamBrandBadge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-l border-silver/20 pl-4 ml-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-silver/10 flex items-center justify-center border border-silver/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-[10px] text-silver", children: "LL" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xl:inline font-mono text-[8px] uppercase tracking-widest text-silver/50", children: "LIAM'S WATCHING" })
  ] });
}
function Nav() {
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();
  const [open, setOpen] = reactExports.useState(null);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [mobileDept, setMobileDept] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Liminal Surf & Skate Co", className: "h-10 w-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm tracking-widest hidden sm:inline text-silver", children: "LIMINAL" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LiamBrandBadge, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-silver/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/shop",
            className: "hover:text-primary transition-colors",
            activeOptions: { exact: true },
            activeProps: { className: "text-primary" },
            children: "Shop"
          }
        ),
        ALL_DEPARTMENTS.map((dept) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative",
            onMouseEnter: () => setOpen(dept),
            onMouseLeave: () => setOpen((d) => d === dept ? null : d),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/shop",
                  search: { dept },
                  className: "inline-flex items-center gap-1 hover:text-primary transition-colors",
                  children: [
                    DEPARTMENT_LABELS[dept],
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
                  ]
                }
              ),
              open === dept && /* @__PURE__ */ jsxRuntimeExports.jsx(MegaPanel, { dept, onPick: () => setOpen(null) })
            ]
          },
          dept
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/about",
            className: "hover:text-primary transition-colors",
            activeProps: { className: "text-primary" },
            children: "Crew"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/community",
            className: "hover:text-primary transition-colors",
            activeProps: { className: "text-primary" },
            children: "Community"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/academy",
            className: "hover:text-primary transition-colors flex items-center gap-1",
            activeProps: { className: "text-primary" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3 w-3" }),
              " Academy"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/graveyard",
            className: "hover:text-primary transition-colors flex items-center gap-1",
            activeProps: { className: "text-primary" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { className: "h-3 w-3" }),
              " Graveyard"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/blog",
            className: "hover:text-primary transition-colors",
            activeProps: { className: "text-primary" },
            children: "Blog"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/wishlist",
            "aria-label": "Wishlist",
            className: "relative h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5" }),
              wishCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono flex items-center justify-center", children: wishCount })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/cart",
            "aria-label": "Cart",
            className: "relative h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5" }),
              cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono flex items-center justify-center", children: cartCount })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/account",
            "aria-label": "Account",
            className: "h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setMobileOpen(true),
            "aria-label": "Open menu",
            className: "lg:hidden h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-silver hover:text-primary transition-colors rounded-md active:bg-primary/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 py-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalSearch, {}) }) }) }),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[60] bg-background lg:hidden flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-16 px-6 flex items-center justify-between border-b border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm tracking-widest text-silver", children: "LIMINAL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setMobileOpen(false),
            "aria-label": "Close menu",
            className: "h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-silver hover:text-primary transition-colors rounded-md active:bg-primary/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto px-6 py-4 font-mono text-sm uppercase tracking-widest text-silver", children: [
        [
          { to: "/shop", label: "Shop" },
          { to: "/about", label: "Crew" },
          { to: "/community", label: "Community" },
          { to: "/blog", label: "Blog" },
          { to: "/support", label: "Support" }
        ].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            onClick: () => setMobileOpen(false),
            className: "block py-3.5 min-h-[44px] hover:text-primary border-b border-border/30 active:bg-primary/10",
            children: l.label
          },
          l.to
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: "Departments" }),
          ALL_DEPARTMENTS.map((dept) => {
            const isOpen = mobileDept === dept;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setMobileDept(isOpen ? null : dept),
                  className: "w-full flex items-center justify-between py-3 hover:text-primary",
                  children: [
                    DEPARTMENT_LABELS[dept],
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronDown,
                      {
                        className: `h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`
                      }
                    )
                  ]
                }
              ),
              isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-3 pl-3 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/shop",
                    search: { dept },
                    onClick: () => setMobileOpen(false),
                    className: "block py-2.5 text-xs text-primary min-h-[44px]",
                    children: [
                      MEGA_MENU[dept].allLabel,
                      " →"
                    ]
                  }
                ),
                MEGA_MENU[dept].columns.flatMap(
                  (col) => col.links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/shop",
                      search: {
                        dept,
                        ...link.type ? { type: link.type } : {},
                        ...link.category ? { category: link.category } : {}
                      },
                      onClick: () => setMobileOpen(false),
                      className: "block py-1.5 text-xs text-silver/80 hover:text-primary",
                      children: [
                        col.title,
                        " · ",
                        link.label
                      ]
                    },
                    `${col.title}-${link.label}-${link.type ?? ""}`
                  ))
                )
              ] })
            ] }, dept);
          })
        ] })
      ] })
    ] })
  ] });
}
function MegaPanel({ dept, onPick }) {
  const menu = MEGA_MENU[dept];
  const cols = menu.columns.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 -translate-x-1/2 top-full pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-background border border-border/60 shadow-2xl p-6",
      style: { width: `min(90vw, ${Math.max(cols * 220, 320)}px)` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid gap-6",
            style: { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` },
            children: menu.columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-3", children: col.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: col.links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/shop",
                  search: {
                    dept,
                    ...link.type ? { type: link.type } : {},
                    ...link.category ? { category: link.category } : {}
                  },
                  onClick: onPick,
                  className: "text-xs font-mono text-silver hover:text-primary normal-case tracking-normal",
                  children: link.label
                }
              ) }, `${link.label}-${link.type ?? ""}-${link.category ?? ""}`)) })
            ] }, col.title))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 pt-4 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/shop",
            search: { dept },
            onClick: onPick,
            className: "font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70",
            children: [
              menu.allLabel,
              " →"
            ]
          }
        ) })
      ]
    }
  ) });
}
const LIAM_PLACEHOLDER = `[ LIAM THE LLAMA BRAND CONTAINER — MASCOT IMAGE PLACEHOLDER ]`;
function LiamBadge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 bg-silver/10 border border-silver/30 rounded-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full bg-silver/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-[8px] text-silver", children: "LL" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-widest text-silver/70", children: "Liam SAYS HI" })
  ] });
}
function Footer() {
  const { data: settings } = useSiteSettings();
  const socials = [
    { key: "instagram_url", label: "Instagram", url: settings?.instagram_url, Icon: Instagram },
    { key: "youtube_url", label: "YouTube", url: settings?.youtube_url, Icon: Youtube },
    {
      key: "tiktok_url",
      label: "TikTok",
      url: settings?.tiktok_url,
      // lucide doesn't ship a TikTok icon; reuse a music-y glyph
      Icon: MessageCircle
    },
    {
      key: "discord_invite_url",
      label: "Discord",
      url: settings?.discord_invite_url,
      Icon: MessageCircle
    }
  ].filter((s) => s.url);
  const emailPrimary = settings?.contact_email_primary;
  const emailSecondary = settings?.contact_email_secondary;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border/40 mt-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Liminal", className: "h-16 w-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LiamBadge, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-primary mb-3", children: "Oh Yeah Not Bad!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/60 text-sm max-w-xs leading-relaxed", children: "Hand-crafted surf and skate from a one-bench workshop. Made between the wave and the concrete." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-silver/30 mt-3", children: LIAM_PLACEHOLDER })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-4", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-silver/70 text-sm", children: [
          emailPrimary && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `mailto:${emailPrimary}`,
              className: "hover:text-primary transition-colors inline-flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
                " ",
                emailPrimary
              ]
            }
          ) }),
          emailSecondary && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `mailto:${emailSecondary}`,
              className: "hover:text-primary transition-colors inline-flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
                " ",
                emailSecondary
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/support", className: "hover:text-primary transition-colors", children: "Support hub" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-4", children: "Follow" }),
        socials.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/40 text-xs font-mono", children: "Links coming soon" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-silver/70 text-sm", children: socials.map(({ key, label, url, Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: url,
            target: "_blank",
            rel: "noreferrer noopener",
            className: "hover:text-primary transition-colors inline-flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
              " ",
              label
            ]
          }
        ) }, key)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40 bg-card/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-silver/70 font-mono text-[10px] uppercase tracking-widest", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 text-primary" }),
        "Secure SSL checkout · Your data stays encrypted"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-silver/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 border border-border/60", children: "Visa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 border border-border/60", children: "Mastercard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 border border-border/60", children: "Amex" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 border border-border/60", children: "Apple Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 border border-border/60", children: "Google Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 border border-border/60", children: "Afterpay" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-silver/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Liminal Surf & Skate Co · Est. 26"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "flex flex-wrap items-center gap-x-5 gap-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/support", className: "hover:text-primary transition-colors", children: "Support" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/privacy", className: "hover:text-primary transition-colors", children: "Privacy Policy" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/terms", className: "hover:text-primary transition-colors", children: "Terms of Service" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/returns", className: "hover:text-primary transition-colors", children: "Returns Policy" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/liability", className: "hover:text-primary transition-colors", children: "Activity Waiver" }) })
      ] })
    ] }) })
  ] });
}
function useAuth() {
  const [user, setUser] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let mounted = true;
    const checkAdmin = async (uid) => {
      if (!uid) {
        if (mounted) setIsAdmin(false);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
      if (mounted) setIsAdmin(Boolean(data));
    };
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setTimeout(() => checkAdmin(session?.user?.id ?? null), 0);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      checkAdmin(session?.user?.id ?? null).finally(() => {
        if (mounted) setLoading(false);
      });
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  return { user, isAdmin, loading };
}
function useBoardGraveyard() {
  return useQuery({
    queryKey: ["board_graveyard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("board_graveyard").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return data ?? [];
    }
  });
}
function useCreateBoardMemorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in to memorialize your board");
      if (input.description.length > 500) {
        throw new Error("Description must be 500 characters or less");
      }
      if (input.trick_attempted.length > 200) {
        throw new Error("Trick name must be 200 characters or less");
      }
      const { data, error } = await supabase.from("board_graveyard").insert({
        user_id: user.id,
        board_type: input.board_type,
        image_url: input.image_url || null,
        trick_attempted: input.trick_attempted,
        spot_tagged: input.spot_tagged,
        memory_date: input.memory_date,
        description: input.description,
        board_name: input.board_name || null
      }).select().single();
      if (error) throw new Error(sanitizeError(error));
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["board_graveyard"] })
  });
}
function useDeleteBoardMemorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("board_graveyard").delete().eq("id", id);
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["board_graveyard"] })
  });
}
const Route$j = createFileRoute("/graveyard")({
  head: () => ({
    meta: [
      { title: "The Board Graveyard — Liminal Surf & Skate Co" },
      {
        name: "description",
        content: "A memorial to snapped decks, creased surfboards, and the tricks that did them in. Pay your respects."
      }
    ]
  }),
  component: GraveyardPage
});
const LIAM_QUOTES = [
  "Every snapped deck tells a story. Liam remembers them all.",
  "The boards we've lost, the tricks we've attempted. Liam honors their sacrifice.",
  "A graveyard of dreams? Nah, a museum of commitment. Liam approves.",
  "The concrete always wins eventually. Liam respects the battle scars.",
  "These boards gave their lives for your progression. Liam salutes them."
];
function GraveyardPage() {
  const { user } = useAuth();
  const { data: memorials, isLoading } = useBoardGraveyard();
  const createMemorial = useCreateBoardMemorial();
  const deleteMemorial = useDeleteBoardMemorial();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [filter, setFilter] = reactExports.useState("all");
  const [submitted, setSubmitted] = reactExports.useState(false);
  const filtered = memorials?.filter((m) => filter === "all" || m.board_type === filter) ?? [];
  const skaterCount = memorials?.filter((m) => m.board_type === "skate").length ?? 0;
  const surferCount = memorials?.filter((m) => m.board_type === "surf").length ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border/40 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-silver/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { className: "h-8 w-8 text-silver" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2", children: "R.I.P. Decks & Boards" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-4xl lg:text-6xl leading-none", children: [
              "THE BOARD",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stroke", children: "GRAVEYARD" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 text-lg max-w-2xl mb-8", children: LIAM_QUOTES[Math.floor(Math.random() * LIAM_QUOTES.length)] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border border-border/60", children: ["all", "skate", "surf"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilter(f),
              className: `px-4 py-2 font-mono text-[10px] uppercase tracking-widest ${filter === f ? "bg-primary text-primary-foreground" : "text-silver/70 hover:text-primary"}`,
              children: f === "all" ? `All (${memorials?.length ?? 0})` : f === "skate" ? `Skate (${skaterCount})` : `Surf (${surferCount})`
            },
            f
          )) }),
          user && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowForm(true),
              className: "inline-flex items-center gap-2 bg-silver text-background font-mono text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-primary transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                " Memorialize a Board"
              ]
            }
          )
        ] })
      ] }) }),
      showForm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg border border-border/60 bg-card p-6 relative max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setShowForm(false);
              setSubmitted(false);
            },
            className: "absolute top-4 right-4 text-silver/50 hover:text-primary",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
          }
        ),
        submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { className: "h-16 w-16 text-silver mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl mb-2", children: "Rest in Peace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 font-mono text-sm mb-6", children: "Your board has been memorialized. Liam salutes its sacrifice." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setShowForm(false);
                setSubmitted(false);
              },
              className: "font-mono text-xs uppercase tracking-widest text-primary hover:opacity-70",
              children: "Back to the graveyard"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          MemorialForm,
          {
            onSubmit: async (data) => {
              await createMemorial.mutateAsync(data);
              setSubmitted(true);
            },
            isLoading: createMemorial.isPending
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 font-mono text-sm text-silver/60", children: "Loading the archives..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-border/60 bg-card p-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { className: "h-12 w-12 text-silver/40 mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-2", children: "The graveyard is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/60 font-mono text-sm mb-6", children: "No boards have been memorialized yet. Be the first to honor a fallen deck or surfboard." }),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowForm(true),
            className: "inline-flex items-center gap-2 bg-silver text-background font-mono text-xs uppercase tracking-widest px-6 py-3 hover:bg-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Add Memorial"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/account",
            className: "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:opacity-70",
            children: "Sign in to add a memorial"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filtered.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        MemorialCard,
        {
          memorial: m,
          isOwner: user?.id === m.user_id,
          onDelete: () => deleteMemorial.mutate(m.id)
        },
        m.id
      )) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border/40 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-silver/10 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-2xl text-silver", children: "LL" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { className: "font-display text-xl lg:text-2xl leading-tight mb-4", children: `"Every snap is a badge of honor. If you haven't broken a board, you haven't been trying hard enough."` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-silver/50", children: "— Liam the Llama" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function MemorialForm({
  onSubmit,
  isLoading
}) {
  const [boardType, setBoardType] = reactExports.useState("skate");
  const [boardName, setBoardName] = reactExports.useState("");
  const [trick, setTrick] = reactExports.useState("");
  const [spot, setSpot] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = reactExports.useState("");
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      board_type: boardType,
      board_name: boardName || void 0,
      trick_attempted: trick,
      spot_tagged: spot,
      memory_date: date,
      description,
      image_url: imageUrl || void 0
    });
  };
  const remainingChars = 500 - description.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { className: "h-5 w-5 text-silver" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "Memorialize a Fallen Board" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Board Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setBoardType("skate"),
            className: `flex-1 py-2 font-mono text-xs uppercase tracking-widest border ${boardType === "skate" ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver"}`,
            children: "Skateboard"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setBoardType("surf"),
            className: `flex-1 py-2 font-mono text-xs uppercase tracking-widest border ${boardType === "surf" ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver"}`,
            children: "Surfboard"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Board Name (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: boardName,
          onChange: (e) => setBoardName(e.target.value),
          placeholder: "The Destroyer, Old Faithful...",
          className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Trick or Maneuver Attempted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          required: true,
          value: trick,
          onChange: (e) => setTrick(e.target.value.slice(0, 200)),
          placeholder: "Kickflip down the El Toro stairs...",
          className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Spot / Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          required: true,
          value: spot,
          onChange: (e) => setSpot(e.target.value),
          placeholder: "North Point, Riverside Bowls...",
          className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Date of Sacrifice" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          required: true,
          type: "date",
          value: date,
          onChange: (e) => setDate(e.target.value),
          className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: [
        "How it happened (",
        remainingChars,
        " chars remaining)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          required: true,
          value: description,
          onChange: (e) => setDescription(e.target.value.slice(0, 500)),
          rows: 4,
          placeholder: "Tell the story of how this board met its end...",
          className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary resize-none"
        }
      ),
      remainingChars < 50 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-amber-500 mt-1", children: [
        remainingChars,
        " characters remaining"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Photo URL (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "url",
          value: imageUrl,
          onChange: (e) => setImageUrl(e.target.value),
          placeholder: "https://...",
          className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-silver/40 mt-1", children: "Accepted formats: .webp, .jpg, .jpeg, .png" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        disabled: isLoading,
        className: "w-full bg-silver text-background font-mono text-xs uppercase tracking-widest py-3 hover:bg-primary transition-colors disabled:opacity-50",
        children: isLoading ? "Memorializing..." : "Lay to Rest"
      }
    )
  ] });
}
function MemorialCard({
  memorial,
  isOwner,
  onDelete
}) {
  const formatDate = (d) => {
    try {
      return format(parseISO(d), "MMM d, yyyy");
    } catch {
      return d;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group border border-border/60 bg-card hover:border-silver/50 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-background relative", children: [
      memorial.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: memorial.image_url,
          alt: memorial.board_name || "Fallen board",
          className: "w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-silver/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { className: "h-16 w-16 text-silver/30" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 font-mono text-[9px] uppercase tracking-widest bg-background/90 text-silver px-2 py-1", children: memorial.board_type }),
      isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onDelete,
          className: "absolute top-3 right-3 h-7 w-7 flex items-center justify-center bg-background/90 border border-border/60 text-silver/50 hover:text-red-500 hover:border-red-500",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      memorial.board_name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1", children: memorial.board_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-2 leading-tight", children: memorial.trick_attempted }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[11px] font-mono text-silver/60 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          formatDate(memorial.memory_date)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
          memorial.spot_tagged
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/80 line-clamp-3", children: memorial.description })
    ] })
  ] });
}
function useSpotPins() {
  return useQuery({
    queryKey: ["spot_pins"],
    queryFn: async () => {
      const { data, error } = await supabase.from("spot_pins").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return data ?? [];
    },
    staleTime: 3e4
  });
}
function useCreateSpotPin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in to add a pin.");
      const { error } = await supabase.from("spot_pins").insert({
        ...input,
        user_id: u.user.id
      });
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["spot_pins"] })
  });
}
function useDeleteSpotPin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("spot_pins").delete().eq("id", id);
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["spot_pins"] })
  });
}
function useVideoClips() {
  return useQuery({
    queryKey: ["video_clips"],
    queryFn: async () => {
      const { data, error } = await supabase.from("video_clips").select("*").eq("approved", true).order("votes", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return data ?? [];
    },
    staleTime: 3e4
  });
}
function useSubmitVideoClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in to submit a clip.");
      const { error } = await supabase.from("video_clips").insert({
        ...input,
        user_id: u.user.id,
        votes: 0,
        approved: false
      });
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["video_clips"] })
  });
}
function haversine$1(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function sortByDistance(pins, userLat, userLng) {
  return pins.map((p) => ({ ...p, distance: haversine$1(userLat, userLng, p.lat, p.lng) })).sort((a, b) => a.distance - b.distance);
}
const DEFAULT_CENTER = { lat: -27.93, lng: 153.41 };
const AU_BOUNDS = {
  north: -10,
  south: -44,
  east: 154,
  west: 112
};
const Route$i = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Liminal Surf & Skate Co" },
      {
        name: "description",
        content: "Local spots, events, ride shares, video clips, and community map — the hub for our skate & surf community."
      }
    ]
  }),
  component: CommunityPage
});
const rides = [
  { user: "Maya R.", route: "City → North Point", when: "Sat 5:30am", seats: 2 },
  { user: "Theo K.", route: "Westside → Riverside Bowls", when: "Sun 3pm", seats: 3 },
  { user: "Jules P.", route: "Downtown → Harbour Wall", when: "Weekdays 6am", seats: 1 }
];
function CommunityPage() {
  const { data: settings } = useSiteSettings();
  const DISCORD_URL = settings?.discord_invite_url || "";
  const [activePin, setActivePin] = reactExports.useState(null);
  const [showPinForm, setShowPinForm] = reactExports.useState(false);
  const [view, setView] = reactExports.useState("grid");
  const [userLoc, setUserLoc] = reactExports.useState(null);
  const [locError, setLocError] = reactExports.useState(null);
  const { user } = useAuth();
  const { data: spotPins = [], isLoading: pinsLoading } = useSpotPins();
  const { data: videoClips = [] } = useVideoClips();
  const { data: events = [], isLoading: eventsLoading } = useEvents({ upcomingOnly: true });
  const createPin = useCreateSpotPin();
  const deletePin = useDeleteSpotPin();
  const submitClip = useSubmitVideoClip();
  const [clipSubmitted, setClipSubmitted] = reactExports.useState(false);
  const [mapCenter, setMapCenter] = reactExports.useState(DEFAULT_CENTER);
  const [showVideoForm, setShowVideoForm] = reactExports.useState(false);
  const groupedByMonth = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const e of events) {
      const d = new Date(e.start_at);
      const key = d.toLocaleDateString(void 0, { month: "long", year: "numeric" });
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [events]);
  reactExports.useEffect(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (loc.lat >= AU_BOUNDS.south && loc.lat <= AU_BOUNDS.north && loc.lng >= AU_BOUNDS.west && loc.lng <= AU_BOUNDS.east) {
          setUserLoc(loc);
          setMapCenter(loc);
        } else {
          setLocError("Outside Australia, showing default location");
        }
      },
      (err) => {
        console.log("Geolocation error:", err);
        setLocError("Location unavailable, showing default");
      },
      { enableHighAccuracy: false, timeout: 1e4, maximumAge: 6e5 }
    );
  }, []);
  const sortedSpots = reactExports.useMemo(() => {
    if (!userLoc || spotPins.length === 0) return spotPins.map((p) => ({ ...p, distance: null }));
    return sortByDistance(spotPins, userLoc.lat, userLoc.lng);
  }, [spotPins, userLoc]);
  const staticSpots = [
    { name: "North Point Reef", kind: "Surf", status: "3–4ft, glassy", note: "Dawn patrol looking clean. Mid-tide is the move.", lat: -27.93, lng: 153.41 },
    { name: "Harbour Wall", kind: "Surf", status: "Flat", note: "Wind switch this afternoon, maybe knee-high by dusk.", lat: -33.87, lng: 151.21 },
    { name: "Riverside Bowls", kind: "Skate", status: "Dry", note: "Some debris in the deep end — bring a broom.", lat: -37.81, lng: 144.96 },
    { name: "School Yard Banks", kind: "Skate", status: "Dry", note: "Quiet after 6pm. Lights stay on til 10.", lat: -34.93, lng: 138.6 },
    { name: "Byron Point", kind: "Surf", status: "2–3ft, onshore", note: "Best before 10am. Lefts on the point.", lat: -28.65, lng: 153.62 },
    { name: "Margaret River", kind: "Surf", status: "4–6ft, offshore", note: "Serious waves. Intermediate+.", lat: -33.95, lng: 115.07 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border/40 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "The Crew" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-5xl lg:text-7xl leading-none mb-6", children: [
          "COMMUNITY,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stroke", children: "NOT CONTENT." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 text-lg max-w-2xl", children: "Local spots, ride-shares, jams, video clips, and the people who keep the scene alive. Pull up, say hi, share a wave." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-8", children: [
          DISCORD_URL && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: DISCORD_URL, target: "_blank", rel: "noreferrer noopener", className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-6 py-3 hover:opacity-90 transition-opacity", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
            " Join the Discord"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => document.getElementById("map")?.scrollIntoView({ behavior: "smooth" }), className: "inline-flex items-center gap-2 border border-primary text-primary font-mono text-xs uppercase tracking-widest px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            " Explore the Map"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl", children: "Local Spot Checks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3 w-3" }),
            userLoc ? "Using your location" : "Showing Australia-wide"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5", children: [
          sortedSpots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SpotCard, { spot: s, onClick: () => {
            setActivePin(s);
            document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
          } }, s.id)),
          staticSpots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(StaticSpotCard, { spot: s, userLoc }, s.name))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "map", className: "py-20 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-3 flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl", children: "Australia Spot Map" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: [
            "Click anywhere to add a pin · ",
            spotPins.length,
            " community pins"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 mb-6 max-w-2xl text-sm", children: "Pinned by the crew — favourite breaks, hidden street spots, and the parks worth the drive. Best tides, smoothest concrete, when to skip it." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AustraliaMap,
              {
                pins: spotPins,
                activePin,
                onPinClick: setActivePin,
                onMapClick: setShowPinForm,
                userLoc,
                mapCenter
              }
            ),
            locError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-silver/50 mt-2", children: locError })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: [
                spotPins.length,
                " community pins"
              ] }),
              user && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setShowPinForm(true),
                  className: "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                    " Add pin"
                  ]
                }
              )
            ] }),
            activePin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-primary bg-card p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  activePin.kind === "surf" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Waves, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: activePin.kind })
                ] }),
                user && user.id === activePin.user_id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      deletePin.mutate(activePin.id);
                      setActivePin(null);
                    },
                    className: "text-silver/50 hover:text-red-500",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-1", children: activePin.title }),
              activePin.photo_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: activePin.photo_url, alt: "", className: "w-full h-32 object-cover mb-2 border border-border/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/80 mb-2", children: activePin.notes }),
              activePin.tide_tips && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary/80 border-l-2 border-primary pl-2", children: activePin.tide_tips }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] text-silver/40 mt-2", children: [
                activePin.lat.toFixed(3),
                ", ",
                activePin.lng.toFixed(3)
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-dashed border-border/40 bg-card p-4 text-center font-mono text-xs text-silver/60", children: "Select a pin on the map to see details" }),
            showPinForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
              PinForm,
              {
                onSubmit: async (data) => {
                  await createPin.mutateAsync(data);
                  setShowPinForm(false);
                },
                onCancel: () => setShowPinForm(false),
                initialLat: mapCenter.lat,
                initialLng: mapCenter.lng
              }
            ),
            sortedSpots.slice(0, 8).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setActivePin(p),
                className: `w-full text-left border p-3 transition-colors ${activePin?.id === p.id ? "border-primary bg-card" : "border-border/60 bg-card hover:border-primary/60"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    p.kind === "surf" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Waves, { className: "h-3 w-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: p.kind }),
                    p.distance !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px] text-silver/50", children: [
                      p.distance.toFixed(1),
                      " km"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm", children: p.title })
                ]
              },
              p.id
            ))
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "events", className: "py-20 border-b border-border/40 scroll-mt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-8 flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl", children: "Events Calendar" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 border border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("grid"), className: `font-mono text-[10px] uppercase tracking-widest px-3 py-2 ${view === "grid" ? "bg-primary text-primary-foreground" : "text-silver/70 hover:text-primary"}`, children: "Grid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("list"), className: `font-mono text-[10px] uppercase tracking-widest px-3 py-2 ${view === "list" ? "bg-primary text-primary-foreground" : "text-silver/70 hover:text-primary"}`, children: "List" })
          ] })
        ] }),
        eventsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60", children: "Loading events..." }) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-border/60 bg-card p-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-8 w-8 text-silver/40 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-silver/70 mb-2", children: "No upcoming events yet." }),
          DISCORD_URL && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: DISCORD_URL, target: "_blank", rel: "noreferrer noopener", className: "font-mono text-[10px] uppercase tracking-widest text-primary hover:underline", children: "Hear about new events on Discord →" })
        ] }) : view === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: events.map((e) => {
          const { date, time } = formatEventDate(e.start_at);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group border border-border/60 bg-card overflow-hidden flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[16/10] bg-background overflow-hidden relative", children: [
              e.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: e.image_url, alt: e.title, loading: "lazy", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-silver/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-primary/60" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 font-mono text-[9px] uppercase tracking-widest bg-background/90 text-primary px-2 py-1 border border-primary/40", children: EVENT_CATEGORY_LABELS[e.category] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex-1 flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl mb-2 leading-tight", children: e.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 font-mono text-xs text-silver/70 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-primary" }),
                  date,
                  " · ",
                  time
                ] }),
                e.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-primary" }),
                  e.location
                ] })
              ] }),
              e.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/80 mb-4 line-clamp-3 flex-1", children: e.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-auto pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: e.rsvp_url || DISCORD_URL || "#", target: "_blank", rel: "noreferrer noopener", className: "flex-1 inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest px-3 py-2 hover:opacity-90", children: [
                  "RSVP ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: googleCalendarUrl(e), target: "_blank", rel: "noreferrer noopener", className: "inline-flex items-center justify-center gap-1 border border-primary text-primary font-mono text-[10px] uppercase tracking-widest px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors", title: "Add to Google Calendar", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { className: "h-3 w-3" }),
                  " GCal"
                ] })
              ] })
            ] })
          ] }, e.id);
        }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: groupedByMonth.map(([month, list]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-3", children: month }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 border-y border-border/40", children: list.map((e) => {
            const { date, time } = formatEventDate(e.start_at);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "grid md:grid-cols-12 gap-4 py-5 items-center px-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 font-mono text-xs uppercase tracking-widest text-silver/80", children: [
                date,
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-silver/50", children: time })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-primary mb-1", children: EVENT_CATEGORY_LABELS[e.category] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-bold text-lg text-silver mb-1", children: e.title }),
                e.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-silver/60 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                  e.location
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-4 flex md:justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: e.rsvp_url || DISCORD_URL || "#", target: "_blank", rel: "noreferrer noopener", className: "font-mono text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-3 py-2 hover:opacity-90", children: "RSVP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: googleCalendarUrl(e), target: "_blank", rel: "noreferrer noopener", className: "font-mono text-[10px] uppercase tracking-widest border border-primary text-primary px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { className: "h-3 w-3" }),
                  " GCal"
                ] })
              ] })
            ] }, e.id);
          }) })
        ] }, month)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl", children: "Ride Share & Skate Buddies" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: [
          rides.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: r.user }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-1", children: r.route }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/80 mb-1", children: r.when }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: [
              r.seats,
              " seat",
              r.seats === 1 ? "" : "s",
              " open"
            ] })
          ] }, r.user + r.route)),
          DISCORD_URL && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: DISCORD_URL, target: "_blank", rel: "noreferrer noopener", className: "border border-dashed border-primary/60 bg-card p-5 flex items-center justify-center text-center font-mono text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors", children: "+ Post a ride in Discord" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-3 flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-3xl lg:text-4xl flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-7 w-7 text-primary" }),
            " Clip of the Month"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: "Winner takes the pot" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 mb-8 max-w-2xl text-sm", children: "Drop your best skate line or surf wave. Community votes. Winner gets a free shop deck, tee, and a brick of wax. New round every month." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-7", children: clipSubmitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-primary bg-card p-10 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-10 w-10 text-primary mx-auto mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-primary mb-2", children: "Clip in the bag." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 font-mono text-sm", children: "We'll review it within 48 hours. Voting opens on the 1st." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            showVideoForm ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              VideoClipForm,
              {
                onSubmit: async (data) => {
                  await submitClip.mutateAsync(data);
                  setClipSubmitted(true);
                  setShowVideoForm(false);
                },
                onCancel: () => setShowVideoForm(false)
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/60 border border-border p-6 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-8 w-8 text-primary mx-auto mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-silver/70 mb-4", children: "Submit your best skate or surf clip for community voting." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setShowVideoForm(true),
                  className: "inline-flex items-center gap-2 bg-primary text-primary-foreground py-3 px-6 font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
                    " Submit a Clip"
                  ]
                }
              )
            ] }),
            videoClips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-2", children: "Current Entries" }),
              videoClips.slice(0, 6).map((clip) => /* @__PURE__ */ jsxRuntimeExports.jsx(VideoClipCard, { clip }, clip.id))
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: "The Prize" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl mb-2", children: "Free shop deck + tee + wax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/80", children: "Winner picks any in-stock deck or surfboard blank, a Liminal tee, and a brick of wax. Featured on the Daily Swell." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: "How voting works" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-silver/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1. Submit your clip before the 28th." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "2. Top 6 go live on the 1st." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "3. Community votes for 7 days." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "4. Winner announced + shipped the prize." })
              ] })
            ] }),
            videoClips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: "Leaderboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: videoClips.slice(0, 5).map((clip, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary w-4", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-mono text-xs text-silver truncate", children: clip.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-silver/60", children: [
                  clip.votes,
                  " votes"
                ] })
              ] }, clip.id)) })
            ] })
          ] })
        ] })
      ] }) }),
      DISCORD_URL && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-10 w-10 text-primary mx-auto mb-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-5xl leading-none mb-6", children: "The whole scene lives on Discord." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 mb-8", children: "Trade gear, find a ride, swap clips, get the day's spot reports first." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: DISCORD_URL, target: "_blank", rel: "noreferrer noopener", className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-8 py-4 hover:opacity-90 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          " Open the invite"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function SpotCard({ spot, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: "text-left border border-border/60 bg-card p-5 hover:border-primary/60 transition-colors w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      spot.kind === "surf" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Waves, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: spot.kind }),
      spot.distance !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px] text-silver/50 ml-auto", children: [
        spot.distance.toFixed(1),
        " km"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-1", children: spot.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/80 line-clamp-2", children: spot.notes }),
    spot.tide_tips && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary/80 mt-1", children: spot.tide_tips })
  ] });
}
function StaticSpotCard({ spot, userLoc }) {
  const distance = userLoc ? haversine(userLoc.lat, userLoc.lng, spot.lat, spot.lng) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      spot.kind === "Surf" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Waves, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: spot.kind }),
      distance !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px] text-silver/50 ml-auto", children: [
        distance.toFixed(1),
        " km"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-1", children: spot.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver mb-3", children: spot.status }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/80", children: spot.note })
  ] });
}
function AustraliaMap({ pins, activePin, onPinClick, onMapClick, userLoc, mapCenter }) {
  const mapRef = reactExports.useRef(null);
  const [MapComponent, setMapComponent] = reactExports.useState(null);
  const [MapContainer, setMapContainer] = reactExports.useState(null);
  const [TileLayer, setTileLayer] = reactExports.useState(null);
  const [Marker, setMarker] = reactExports.useState(null);
  const [Popup, setPopup] = reactExports.useState(null);
  const [UseMap, setUseMap] = reactExports.useState(null);
  reactExports.useEffect(() => {
    import("../_libs/react-leaflet.mjs").then((mod) => {
      setMapContainer(mod.MapContainer);
      setTileLayer(mod.TileLayer);
      setMarker(mod.Marker);
      setPopup(mod.Popup);
      setUseMap(mod.useMap);
    });
    import("../_libs/leaflet.mjs").then(function(n) {
      return n.l;
    }).then((L) => {
      setMapComponent(L);
    });
  }, []);
  if (!MapContainer || !TileLayer || !Marker || !Popup || !MapComponent || !UseMap) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/60 bg-card aspect-[16/10] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60", children: "Loading map..." }) });
  }
  const MapEventHandler = () => {
    const map = UseMap();
    reactExports.useEffect(() => {
      map.flyTo([mapCenter.lat, mapCenter.lng], 10, { duration: 1.5 });
    }, [map, mapCenter.lat, mapCenter.lng]);
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card overflow-hidden", ref: mapRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      MapContainer,
      {
        center: [mapCenter.lat, mapCenter.lng],
        zoom: 5,
        scrollWheelZoom: true,
        style: { height: "500px", width: "100%" },
        attributionControl: false,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TileLayer,
            {
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapEventHandler, {}),
          userLoc && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Marker,
            {
              position: [userLoc.lat, userLoc.lng],
              icon: MapComponent.divIcon({
                className: "user-location-marker",
                html: `<div class="h-3 w-3 rounded-full bg-primary border-2 border-background shadow-lg animate-pulse"></div>`
              }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: "Your location" }) })
            }
          ),
          pins.map((pin) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Marker,
            {
              position: [pin.lat, pin.lng],
              eventHandlers: {
                click: () => onPinClick(pin)
              },
              icon: MapComponent.divIcon({
                className: "custom-pin",
                html: `<div class="h-4 w-4 rounded-full border-2 border-background ${pin.kind === "surf" ? "bg-primary" : "bg-silver"} ${activePin?.id === pin.id ? "ring-2 ring-primary scale-125" : ""}"></div>`
              }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-primary", children: pin.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/60", children: pin.kind })
              ] }) })
            },
            pin.id
          ))
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => onMapClick(true),
        className: "w-full py-2 font-mono text-[10px] uppercase tracking-widest text-primary border-t border-border/60 hover:bg-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3 inline mr-1" }),
          " Click anywhere on the map to add a pin"
        ]
      }
    )
  ] });
}
function PinForm({ onSubmit, onCancel, initialLat, initialLng }) {
  const [title, setTitle] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [kind, setKind] = reactExports.useState("surf");
  const [lat, setLat] = reactExports.useState(initialLat.toFixed(4));
  const [lng, setLng] = reactExports.useState(initialLng.toFixed(4));
  const [tideTips, setTideTips] = reactExports.useState("");
  const [photoUrl, setPhotoUrl] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        onSubmit({
          title,
          notes,
          kind,
          lat: parseFloat(lat) || initialLat,
          lng: parseFloat(lng) || initialLng,
          tide_tips: tideTips,
          photo_url: photoUrl || null
        });
      },
      className: "bg-card/60 border border-primary p-5 space-y-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: "Add a Spot Pin" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onCancel, className: "text-silver/50 hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: title, onChange: (e) => setTitle(e.target.value), className: "w-full bg-input/60 border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Kind" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setKind("surf"), className: `flex-1 py-2 font-mono text-xs uppercase tracking-widest border ${kind === "surf" ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver"}`, children: "Surf" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setKind("skate"), className: `flex-1 py-2 font-mono text-xs uppercase tracking-widest border ${kind === "skate" ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver"}`, children: "Skate" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full bg-input/60 border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Tide & Condition Tips" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: tideTips, onChange: (e) => setTideTips(e.target.value), rows: 2, placeholder: "Best conditions, wind, tide, etc.", className: "w-full bg-input/60 border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Photo URL (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "url", value: photoUrl, onChange: (e) => setPhotoUrl(e.target.value), placeholder: "https://...", className: "w-full bg-input/60 border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Latitude" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: lat, onChange: (e) => setLat(e.target.value), className: "w-full bg-input/60 border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Longitude" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: lng, onChange: (e) => setLng(e.target.value), className: "w-full bg-input/60 border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 font-mono text-xs uppercase tracking-widest hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
          " Drop Pin"
        ] })
      ]
    }
  );
}
function VideoClipForm({ onSubmit, onCancel }) {
  const [title, setTitle] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("skate");
  const [videoUrl, setVideoUrl] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        onSubmit({ title, category, video_url: videoUrl });
      },
      className: "bg-card/60 border border-primary p-6 space-y-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: "Submit your clip" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onCancel, className: "text-silver/50 hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Clip Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: title, onChange: (e) => setTitle(e.target.value), className: "w-full bg-input/60 border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCategory("skate"), className: `flex-1 py-2 font-mono text-xs uppercase tracking-widest border ${category === "skate" ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver"}`, children: "Skate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCategory("surf"), className: `flex-1 py-2 font-mono text-xs uppercase tracking-widest border ${category === "surf" ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver"}`, children: "Surf" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-1", children: "Video Link (YouTube / Vimeo / Instagram)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "url", required: true, value: videoUrl, onChange: (e) => setVideoUrl(e.target.value), placeholder: "https://...", className: "w-full bg-input/60 border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 font-mono text-xs uppercase tracking-widest hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
          " Submit Clip"
        ] })
      ]
    }
  );
}
function VideoClipCard({ clip }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-4 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 bg-background border border-border/40 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-6 w-6 text-primary/60" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: clip.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px] text-silver/40", children: [
          clip.votes,
          " votes"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm truncate", children: clip.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: clip.video_url, target: "_blank", rel: "noreferrer noopener", className: "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70", children: [
        "Watch ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest border border-primary text-primary px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "h-3 w-3" }),
        " Vote"
      ] })
    ] })
  ] });
}
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
const $$splitComponentImporter$b = () => import("./checkout-BEaeKvJX.mjs");
const Route$h = createFileRoute("/checkout")({
  head: () => ({
    meta: [{
      title: "Checkout — Liminal Surf & Skate Co"
    }, {
      name: "description",
      content: "Complete your order — secure checkout with multiple payment options."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./cart-CZ71aoVG.mjs");
const Route$g = createFileRoute("/cart")({
  head: () => ({
    meta: [{
      title: "Cart — Liminal Surf & Skate Co"
    }, {
      name: "description",
      content: "Your selected pieces, ready to inquire."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./blog-DIpOvgpG.mjs");
const Route$f = createFileRoute("/blog")({
  head: () => ({
    meta: [{
      title: "Blog & Newsletters — Liminal Surf & Skate Co"
    }, {
      name: "description",
      content: "Dispatches from the workshop, weekly newsletters every Friday, plus field reports and stories from the in-between."
    }, {
      property: "og:title",
      content: "Blog & Newsletters — Liminal Surf & Skate Co"
    }, {
      property: "og:description",
      content: "Articles, weekly Friday newsletters, and clips from the workshop."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin-D0usyZOA.mjs");
const Route$e = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin — Liminal"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./account-Df2tY7na.mjs");
const Route$d = createFileRoute("/account")({
  head: () => ({
    meta: [{
      title: "Account — Liminal Surf & Skate Co"
    }, {
      name: "description",
      content: "Sign in to track orders and unlock loyalty rewards."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const Route$c = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Sports Academy — Liminal Surf & Skate Co" },
      {
        name: "description",
        content: "Learn to skate and surf with our comprehensive guides. From beginner basics to advanced techniques, gear care, and Pack My Bag checklists."
      }
    ]
  }),
  component: AcademyPage
});
const SKATE_TRICKS = [
  {
    category: "Beginner Basics",
    skills: [
      {
        name: "Pushing & Stance",
        steps: [
          "Position your front foot near the front bolts, angled slightly forward",
          "Push with your back foot, keeping weight balanced over the front truck",
          "Return back foot to the tail after each push",
          "Keep knees slightly bent for stability"
        ],
        tip: "Regular: left foot forward. Goofy: right foot forward. There's no wrong choice."
      },
      {
        name: "Foot Braking",
        steps: [
          "Shift weight to your front foot",
          "Lower your back foot to the ground heel-first",
          "Apply gradual pressure to slow down",
          "Return foot to the board once stopped"
        ],
        tip: "Start slow on flat ground before trying hills."
      },
      {
        name: "Kick-Turning",
        steps: [
          "Shift weight slightly to the tail until front wheels lift",
          "Rotate your shoulders in the direction you want to turn",
          "Follow with your hips and the board",
          "Bring front wheels back down smoothly"
        ],
        tip: "Look where you want to go — your body follows your eyes."
      }
    ]
  },
  {
    category: "Essential Maneuvers",
    skills: [
      {
        name: "The Ollie",
        steps: [
          "Position back foot on the tail, front foot near the middle",
          "Pop the tail hard while jumping upward",
          "Slide front foot up the grip tape to level the board",
          "Lift knees high and catch the board in the air",
          "Land with both feet over the trucks"
        ],
        tip: "Timing is everything. Pop, slide, lift — in that order. Practice stationary first.",
        difficulty: "Intermediate"
      },
      {
        name: "Shuv-It",
        steps: [
          "Set up like an ollie but with back foot more centered on tail",
          "Scoop the tail behind you while jumping straight up",
          "Keep your body still, let the board spin 180°",
          "Catch the board with your front foot first",
          "Land and ride away"
        ],
        tip: "Don't rotate your body. Let the board do the work.",
        difficulty: "Intermediate"
      },
      {
        name: "Frontside 180",
        steps: [
          "Start in ollie position, shoulders pre-rotated",
          "Pop and unwind your shoulders frontside",
          "Guide the board with your feet as you rotate",
          "Spot your landing over your back shoulder",
          "Absorb the impact with bent knees"
        ],
        tip: "The rotation comes from your shoulders, not your feet.",
        difficulty: "Intermediate"
      }
    ]
  },
  {
    category: "Drop-Ins & Ramps",
    skills: [
      {
        name: "Drop-In",
        steps: [
          "Place tail on the coping, board hanging over the ramp",
          "Position front foot over the front truck bolts",
          "Commit fully by shifting weight forward in one motion",
          "Keep weight centered over the board",
          "Ride out the transition smoothly"
        ],
        tip: "The most important part is committing. Hesitation = slamming.",
        difficulty: "Intermediate"
      },
      {
        name: "Pumping Transitions",
        steps: [
          "Enter transitions with bent knees",
          "Extend legs as you go up the wall",
          "Compress/bend knees at the top and through the flat",
          "Push down into transitions for speed",
          "Use your whole body, not just your legs"
        ],
        tip: "Pumping is about timing compression and extension with the curve.",
        difficulty: "Intermediate"
      }
    ]
  }
];
const SURF_BASICS = [
  {
    category: "First Steps",
    skills: [
      {
        name: "Wave Selection & Paddling",
        steps: [
          "Look for white water waves to start — they're more predictable",
          "Paddle with long, smooth strokes from your shoulder",
          "Keep your chest raised, looking forward not down",
          "When a wave approaches, paddle hard and commit",
          "Arch your back as the wave catches you"
        ],
        tip: "Green waves come later. Master the white water first."
      },
      {
        name: "The Pop-Up",
        steps: [
          "Place hands flat beside your chest, fingers facing the rails",
          "Push up explosively, arching your back",
          "In one motion, bring your front foot forward between your hands",
          "Stand up with feet wide, centered over the stringer",
          "Arms out for balance, eyes looking forward"
        ],
        tip: "Practice on the beach first. The motion should be one fluid movement."
      },
      {
        name: "Stance & Balance",
        steps: [
          "Front foot near the center, back foot over the fins",
          "Knees bent, stance slightly wider than shoulders",
          "Weight distributed evenly or slightly forward",
          "Arms loose for balance, eyes on where you're going",
          "Stay low and loose — rigidity = falling"
        ],
        tip: "Goofy or Regular? Stand up naturally and have someone push you lightly from behind. The foot you step forward with is your front foot."
      }
    ]
  },
  {
    category: "Reading Waves",
    skills: [
      {
        name: "Identifying Green Waves",
        steps: [
          "Watch the horizon for incoming sets",
          "Look for darker, steeper waves that aren't closing out yet",
          "Position yourself slightly outside where others are catching waves",
          "Paddle hard and early — you need speed to match the wave",
          "Commit fully and look down the line, not at your board"
        ],
        tip: "Green waves require more timing. Start paddling earlier than you think.",
        difficulty: "Intermediate"
      },
      {
        name: "Angle Take-Off",
        steps: [
          "Instead of going straight, angle the board 45° down the line",
          "Look in the direction you want to go, not straight at shore",
          "Pop up and immediately lean into the wave face",
          "Ride across the wave, not straight to shore"
        ],
        tip: "Angling your take-off helps you get around sections and stay on the wave longer.",
        difficulty: "Intermediate"
      }
    ]
  }
];
function AcademyPage() {
  const [activeTab, setActiveTab] = reactExports.useState("skate");
  const [expandedSkill, setExpandedSkill] = reactExports.useState(null);
  const [showChecklist, setShowChecklist] = reactExports.useState(false);
  const [checkedItems, setCheckedItems] = reactExports.useState(/* @__PURE__ */ new Set());
  const { data: presets } = useQuery({
    queryKey: ["academy_checklist_presets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("academy_checklist_presets").select("*").order("name", { ascending: true });
      if (error) throw new Error(sanitizeError(error));
      return data ?? [];
    }
  });
  const filteredPresets = presets?.filter((p) => p.activity_type === activeTab) ?? [];
  const toggleSkill = (name) => {
    setExpandedSkill((s) => s === name ? null : name);
  };
  const toggleCheck = (presetId, itemIndex) => {
    const key = `${presetId}-${itemIndex}`;
    const next = new Set(checkedItems);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCheckedItems(next);
  };
  const skillContent = activeTab === "skate" ? SKATE_TRICKS : SURF_BASICS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border/40 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "Learn Your Craft" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-5xl lg:text-7xl leading-none mb-6", children: [
          "SPORTS",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-stroke", children: "ACADEMY" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 text-lg max-w-2xl mb-8", children: "From pushing your first inch to landing your first flip. Step-by-step guides, gear-care basics, and pre-session checklists — all in one place." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border border-border/60 w-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("skate"),
              className: `flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest ${activeTab === "skate" ? "bg-primary text-primary-foreground" : "text-silver/70 hover:text-primary"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
                " Skate"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("surf"),
              className: `flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest ${activeTab === "surf" ? "bg-primary text-primary-foreground" : "text-silver/70 hover:text-primary"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Waves, { className: "h-4 w-4" }),
                " Surf"
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl", children: activeTab === "skate" ? "Skate Tricks & Techniques" : "Surf Beginners' Academy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-silver/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: skillContent.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4", children: category.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: category.skills.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border border-border/60 bg-card hover:border-primary/40 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => toggleSkill(skill.name),
                    className: "w-full flex items-center justify-between p-4 text-left",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5 text-silver/50" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg", children: skill.name }),
                        skill.difficulty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary", children: skill.difficulty })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ChevronRight,
                        {
                          className: `h-4 w-4 text-silver/50 transition-transform ${expandedSkill === skill.name ? "rotate-90" : ""}`
                        }
                      )
                    ]
                  }
                ),
                expandedSkill === skill.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 px-6 py-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3 mb-4", children: skill.steps.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-start gap-3 text-sm text-silver/80",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 h-5 w-5 rounded-full bg-silver/10 text-silver/70 text-xs flex items-center justify-center font-mono", children: i + 1 }),
                        step
                      ]
                    },
                    i
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-2 border-primary bg-primary/5 p-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-widest mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3" }),
                      " Pro tip"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/90", children: skill.tip })
                  ] })
                ] })
              ]
            },
            skill.name
          )) })
        ] }, category.category)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl", children: "Pack My Bag" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-silver/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/70 max-w-2xl mb-8", children: "Pre-made checklists for different session types. Check items off before you head out so you never forget your wax again." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredPresets.length > 0 ? filteredPresets.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            preset.activity_type === "surf" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Waves, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg", children: preset.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: preset.items.map((item, i) => {
            const key = `${preset.id}-${i}`;
            const checked = checkedItems.has(key);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => toggleCheck(preset.id, i),
                className: `w-full flex items-center gap-3 p-2 text-left text-sm border transition-colors ${checked ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-silver/70 hover:border-primary/50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `flex-shrink-0 h-4 w-4 border flex items-center justify-center ${checked ? "border-primary bg-primary" : "border-border/40"}`,
                      children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary-foreground" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: checked ? "line-through" : "", children: item.name }),
                  item.required && !checked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto font-mono text-[8px] uppercase tracking-widest text-silver/40", children: "Required" })
                ]
              }
            ) }, i);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-3 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-silver/50", children: [
            preset.items.filter(
              (_, i) => checkedItems.has(`${preset.id}-${i}`)
            ).length,
            " /",
            preset.items.length,
            " packed"
          ] }) })
        ] }, preset.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 lg:col-span-3 border border-dashed border-border/60 bg-card p-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10 text-silver/40 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-silver/60 font-mono text-sm", children: [
            "No checklists available for ",
            activeTab,
            " yet. Liam is working on it."
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl lg:text-4xl", children: "Gear Care" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-6 w-6 text-silver/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid lg:grid-cols-2 gap-8", children: activeTab === "skate" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg", children: "Bearing Maintenance" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-3 text-sm text-silver/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1. Remove wheels and pop off the bearing shields with a razor or pick" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "2. Soak in isopropyl alcohol or bearing cleaner for 10 minutes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "3. Spin dry on a cloth, then blow out any debris" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "4. Apply a few drops of speed cream or light machine oil" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "5. Reattach shields, reinstall in wheels" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "6. Break them in — they'll get faster after a few sessions of riding" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-amber-500 mt-4", children: "Never use WD-40 — it attracts dirt and gums up bearings." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg", children: "Grip Tape Replacement" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-3 text-sm text-silver/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1. Peel off old grip tape slowly, using a hair dryer if stubborn" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "2. Clean deck surface with isopropyl alcohol, let dry completely" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "3. Line up new sheet from nose to tail, pressing down gradually" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "4. Use a screwdriver or file to score the edge of the deck" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "5. Trim excess with a fresh razor blade at a 45° angle" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "6. Poke holes through the grip tape for hardware" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-silver/50 mt-4", children: "Fresh grip = better flicks." })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg", children: "Wax Maintenance" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-3 text-sm text-silver/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1. Use a wax comb to cross-hatch the existing coat" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "2. Apply fresh wax in a diagonal pattern, then cross-hatch again" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "3. Remove old wax periodically — scrape with comb or old credit card" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "4. For full removal, leave board in sun briefly to soften wax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "5. Use wax remover or mineral oil, then reapply fresh" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "6. Match wax hardness to water temp: cool → cold, warm → tropical" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-silver/50 mt-4", children: "Bumps don't mean grip — a thin, cross-hatched layer does." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg", children: "Wetsuit Care" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-3 text-sm text-silver/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1. Rinse with fresh water after every surf — salt degrades neoprene" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "2. Dry inside-out first, in the shade, away from direct sun" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: '3. Never use hot water or leave in a hot car to "dry"' }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "4. Hang on a thick hanger or drape over a bar — thin hangers stretch shoulders" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "5. Use wetsuit shampoo monthly to flush bacteria and restore flexibility" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "6. Patch small tears immediately with neoprene cement" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-amber-500 mt-4", children: "A well-cared wetsuit can last 3-5 seasons. Neglect cuts that in half." })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border/40 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-silver/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-xl text-silver", children: "LL" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { className: "font-display text-lg leading-tight mb-3", children: `"The more you know, the harder you charge. That's the whole academy in one sentence."` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-silver/50", children: "— Liam the Llama" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const $$splitComponentImporter$6 = () => import("./about-DdpYOGfz.mjs");
const Route$b = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — Liminal Surf & Skate Co"
    }, {
      name: "description",
      content: "One bench. Two worlds. One stoke. The origin story, the crew, the riders, and what Liminal stands for."
    }, {
      property: "og:title",
      content: "About — Liminal Surf & Skate Co"
    }, {
      property: "og:description",
      content: "The story behind Liminal — hand-shaped surf and skate from a one-bench workshop."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-Crj5XnRK.mjs");
const Route$a = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Liminal Surf & Skate Co — Hand-shaped boards & wear"
    }, {
      name: "description",
      content: "Hand-shaped skateboards, custom surfboards, and small-batch apparel from a one-bench workshop. Order custom or shop the latest drop."
    }, {
      property: "og:title",
      content: "Liminal Surf & Skate Co"
    }, {
      property: "og:description",
      content: "Hand-shaped surf and skate. No factories. No shortcuts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./shop._slug-rx_rUe40.mjs");
const Route$9 = createFileRoute("/shop/$slug")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${params.slug} — Liminal Surf & Skate Co`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const Route$8 = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [{ title: "Terms of Service — Liminal Surf & Skate Co" }]
  }),
  component: TermsPage
});
function TermsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-4xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl", children: "Terms of Service" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/50 mb-8", children: "Last updated: July 2026" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-silver max-w-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "1. Agreement to Terms" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "By accessing or using Liminal Surf & Skate Co's website and services, you agree to be bound by these Terms. If you do not agree, please do not use our services." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "2. Account Responsibilities" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to provide accurate information and to update it promptly. We reserve the right to suspend or terminate accounts that violate these Terms." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "3. Orders and Payment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "All orders are subject to acceptance and availability. Prices are in Australian Dollars (AUD) and include applicable taxes. Payment is due at the time of order. We reserve the right to cancel orders for any reason, including pricing errors or suspected fraud." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "4. Shipping and Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "Shipping times are estimates only. We ship within Australia using Australia Post and Sendle. International shipping is available to select countries. Risk of loss passes to you upon delivery to the carrier." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "5. Returns and Refunds" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-silver/80 leading-relaxed", children: [
            "Please see our",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/legal/returns", className: "text-primary hover:underline", children: "Returns Policy" }),
            " ",
            "for details on returns, exchanges, and refunds."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "6. Intellectual Property" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "All content on this website, including text, graphics, logos, and images, is the property of Liminal Surf & Skate Co and protected by Australian and international copyright laws. You may not use, reproduce, or distribute our content without written permission." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "7. Prohibited Conduct" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed mb-4", children: "You agree not to:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-6 space-y-2 text-silver/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Use our services for any unlawful purpose" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Submit false or misleading information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Attempt to gain unauthorized access to our systems" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Interfere with other users' use of our services" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Scrape, harvest, or collect user data without consent" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "8. Limitation of Liability" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "To the maximum extent permitted by law, Liminal Surf & Skate Co is not liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability is limited to the amount you paid for the specific product or service in question." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "9. Changes to Terms" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the new Terms." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "10. Governing Law" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "These Terms are governed by the laws of New South Wales, Australia. Any disputes will be resolved in the courts of New South Wales." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "11. Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "For questions about these Terms, contact us at contact@liminalsandsco.com." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const Route$7 = createFileRoute("/legal/returns")({
  head: () => ({
    meta: [{ title: "Returns Policy — Liminal Surf & Skate Co" }]
  }),
  component: ReturnsPage
});
function ReturnsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-4xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-8 w-8 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl", children: "Returns & Exchanges" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/50 mb-8", children: "Last updated: July 2026" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-4 mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg", children: "30 Days" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/60", children: "Return window for unworn items" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-primary mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg", children: "Free Returns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/60", children: "On orders over $100 AUD" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-5 w-5 text-primary mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg", children: "Refunds" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/60", children: "Processed within 5-10 days" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-silver max-w-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "1. Return Eligibility" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed mb-4", children: "We accept returns within 30 days of delivery for items that are:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: [
            "Unworn, unwashed, and in original condition",
            "In original packaging with all tags attached",
            "Accompanied by proof of purchase (order confirmation or receipt)"
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-silver/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }),
            item
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "2. Non-Returnable Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed mb-4", children: "The following items cannot be returned:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: [
            "Swimwear and bikini bottoms (for hygiene reasons)",
            "Underwear and socks",
            "Custom or personalized items",
            "Items marked as final sale",
            "Gift cards",
            "Equipment that has been used, waxed, or assembled"
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-silver/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-500 mt-0.5 shrink-0" }),
            item
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "3. How to Start a Return" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal pl-6 space-y-3 text-silver/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Log in to your account" }),
              " and navigate to your order history"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Select the order" }),
              " containing the item(s) you wish to return"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: 'Click "Start Return"' }),
              " and follow the prompts to generate a return shipping label"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Pack your items" }),
              " in the original packaging if possible"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Attach the label" }),
              " and drop off at any Australia Post location"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 mt-4", children: "Guest orders: email us at contact@liminalsandsco.com with your order number and return request." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "4. Refunds" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "Once we receive and inspect your return, we'll process your refund within 3-5 business days. Refunds are credited to the original payment method. Shipping charges are non-refundable unless the return is due to our error or a defective product." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "5. Exchanges" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "Need a different size or colour? Place a new order and return the original item for a refund. This ensures you get the replacement quickly without waiting for stock to potentially sell out. We recommend returning items for a refund and placing a new order — it's the fastest way." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "6. Defective or Damaged Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "If you receive a defective or damaged item, contact us immediately at contact@liminalsandsco.com with photos of the issue. We'll arrange a replacement or full refund at no cost to you." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "7. Return Shipping Costs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-silver/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Orders over $100 AUD:" }),
              " Free return shipping"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Orders under $100 AUD:" }),
              " $9.95 return shipping fee deducted from refund"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Defective/incorrect items:" }),
              " We cover return shipping in full"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "8. Questions?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-silver/80 leading-relaxed", children: [
            "Email us at contact@liminalsandsco.com or reach out via our",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/support", className: "text-primary hover:underline", children: "support page" }),
            ". We typically respond within 24-48 hours."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const Route$6 = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy — Liminal Surf & Skate Co" }]
  }),
  component: PrivacyPage
});
function PrivacyPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-4xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-8 w-8 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl", children: "Privacy Policy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/50 mb-8", children: "Last updated: July 2026" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-silver max-w-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "1. Information We Collect" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "When you create an account or place an order, we collect information you provide directly, including your name, email address, shipping address, and payment details. We also automatically collect certain information when you visit our website, such as your IP address, browser type, device information, and browsing activity through cookies and similar technologies." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "2. How We Use Your Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed mb-4", children: "We use the information we collect to:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-6 space-y-2 text-silver/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Process and fulfill your orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Communicate with you about your orders, account, and promotional offers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Personalize your experience and improve our website" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Prevent fraud and maintain the security of our systems" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Comply with legal obligations" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "3. Loyalty Points" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "Points balances are read-only on the client side and can only be modified via server-side operations triggered by verified actions (registration, reviews, orders). Users cannot self-grant or manually update their points balance." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "4. Data Security" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "5. Cookies" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "We use cookies and similar tracking technologies to collect and store information about your preferences and activity. You can set your browser to refuse cookies, but some features may not function properly." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "6. Third-Party Services" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "We may use third-party services for payments (Stripe), analytics, and email communications. These services have their own privacy policies and are responsible for the data they collect." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "7. Your Rights" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at contact@liminalsandsco.com. Australian residents have additional rights under the Privacy Act 1988." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "8. Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "For privacy-related inquiries, contact us at contact@liminalsandsco.com." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const Route$5 = createFileRoute("/legal/liability")({
  head: () => ({
    meta: [{ title: "Activity Waiver — Liminal Surf & Skate Co" }]
  }),
  component: LiabilityPage
});
function LiabilityPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-4xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl", children: "Activity Waiver" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/50 mb-8", children: "Action Sports Liability Acknowledgment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-amber-500/50 bg-amber-500/10 p-6 mb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-6 w-6 text-amber-500 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-amber-500 mb-2", children: "Important Notice" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/80", children: "Skateboarding, surfing, and other action sports carry inherent risks. By purchasing equipment from Liminal Surf & Skate Co, you acknowledge and accept these risks and agree to this waiver." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6 mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6 text-primary mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold mb-2", children: "Skateboarding Risks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-sm text-silver/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Falls and impact injuries" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Collision with obstacles or vehicles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Equipment failure or breakage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Road rash, fractures, and head injuries" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Waves, { className: "h-6 w-6 text-primary mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold mb-2", children: "Surfing Risks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-sm text-silver/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Drowning and near-drowning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Impact with surfboard, reef, or ocean floor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Marine life encounters" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Rip currents and changing conditions" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-silver max-w-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "1. Acknowledgment of Inherent Risks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "I understand that action sports including skateboarding, surfing, inline skating, BMX, and related activities involve inherent risks that cannot be eliminated regardless of the care taken to avoid injuries. These risks include, but are not limited to: slips, falls, collisions, equipment failure, impact injuries, head injuries, paralysis, and death." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "2. Assumption of Risk" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "I hereby voluntarily assume all risks associated with action sports activities, both known and unknown, even if arising from the negligence of Liminal Surf & Skate Co, its employees, agents, or representatives. I understand that these activities involve risks both on and off the water, at skateparks, on public roads, and in private facilities." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "3. Waiver and Release" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "In consideration of being permitted to purchase and use equipment from Liminal Surf & Skate Co, I hereby release, waive, discharge, and covenant not to sue the company, its officers, employees, agents, and representatives from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury, including death, that may be sustained by me or any property belonging to me while engaged in action sports activities." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "4. Equipment Disclaimer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "I understand that skateboards, surfboards, and related equipment can fail under stress, impact, or improper use. Liminal Surf & Skate Co makes no warranties, express or implied, regarding the safety or fitness of any product for any particular purpose. I accept responsibility for proper inspection, maintenance, and appropriate use of all equipment purchased." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "5. Protective Equipment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "I acknowledge the importance of wearing appropriate protective equipment including helmets, wrist guards, knee pads, and elbow pads while engaged in action sports. Liminal Surf & Skate Co strongly recommends the use of certified protective equipment at all times." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "6. Indemnification" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "I agree to indemnify and hold harmless Liminal Surf & Skate Co from any and all claims, actions, suits, costs, and expenses, including attorney's fees, arising from my participation in action sports activities or use of products purchased from Liminal Surf & Skate Co." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "7. Governing Law" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "This waiver shall be governed by and construed in accordance with the laws of New South Wales, Australia. Any disputes arising under this waiver shall be resolved in the courts of New South Wales." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "8. Acknowledgment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "By purchasing products from Liminal Surf & Skate Co, either online or in-store, I acknowledge that I have read and understood this waiver, and I agree to be bound by its terms. I certify that I am at least 18 years of age, or if under 18, my parent or legal guardian has reviewed and agreed to these terms on my behalf." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "Questions?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver/80 leading-relaxed", children: "If you have questions about this waiver, contact us at contact@liminalsandsco.com." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40 pt-8 mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10 text-silver/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-silver/70 italic", children: '"Ride hard, but ride smart. Liam wears his helmet everywhere."' }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/40 mt-1", children: "— Liam the Llama" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const $$splitComponentImporter$3 = () => import("./blog._slug-CcpAd8Ip.mjs");
const $$splitErrorComponentImporter = () => import("./blog._slug-DXg9KJ58.mjs");
const $$splitNotFoundComponentImporter = () => import("./blog._slug-Bp2Mo3o8.mjs");
const Route$4 = createFileRoute("/blog/$slug")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${params.slug} — Liminal Journal`
    }]
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.products-C35SiMY7.mjs");
const Route$3 = createFileRoute("/admin/products")({
  head: () => ({
    meta: [{
      title: "Admin · Products — Liminal"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.newsletters-r8gF7iLl.mjs");
const Route$2 = createFileRoute("/admin/newsletters")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.events-BHSL58im.mjs");
const Route$1 = createFileRoute("/admin/events")({
  head: () => ({
    meta: [{
      title: "Events Admin — Liminal"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [{ title: "My Orders — Liminal Surf & Skate Co" }]
  }),
  component: OrdersPage
});
const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Check }
];
const STATUS_COLORS = {
  pending: "text-amber-500",
  processing: "text-blue-500",
  shipped: "text-purple-500",
  delivered: "text-green-500",
  cancelled: "text-red-500",
  returned: "text-silver/70"
};
function OrdersPage() {
  const { user, loading } = useAuth();
  const [expandedOrder, setExpandedOrder] = reactExports.useState(null);
  const [returnOrderId, setReturnOrderId] = reactExports.useState(null);
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("orders").select("*, order_items(*)").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return data ?? [];
    },
    enabled: !!user
  });
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-4xl mx-auto px-6 py-16 text-center font-mono text-sm text-silver/60", children: !user && !loading ? "Sign in to view your orders" : "Loading..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-4xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl", children: "My Orders" })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/60", children: "Loading orders..." }) : !orders || orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-silver/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-lg text-silver", children: "LL" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl mb-2 text-silver", children: "No orders yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-silver/70 mb-6 italic", children: `"Liam's watching an empty history. Make history."` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/shop",
            className: "inline-block font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground px-6 py-3 hover:opacity-90",
            children: "Start shopping"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        OrderCard,
        {
          order,
          expanded: expandedOrder === order.id,
          onToggle: () => setExpandedOrder((id) => id === order.id ? null : order.id),
          onStartReturn: () => setReturnOrderId(order.id)
        },
        order.id
      )) }),
      returnOrderId && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReturnModal,
        {
          orderId: returnOrderId,
          onClose: () => setReturnOrderId(null)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function OrderCard({
  order,
  expanded,
  onToggle,
  onStartReturn
}) {
  const formatDate = (d) => {
    try {
      return format(parseISO(d), "MMM d, yyyy");
    } catch {
      return d;
    }
  };
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onToggle,
        className: "w-full flex items-center justify-between p-4 text-left",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-silver/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-silver", children: order.fulfillment_source === "in-store" ? "POS" : "WEB" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1", children: [
                "Order #",
                order.id.slice(0, 8)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold", children: formatDate(order.created_at) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-silver/50", children: [
                "$",
                order.total_amount,
                " AUD"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-mono text-xs uppercase tracking-widest ${STATUS_COLORS[order.status] || "text-silver"}`, children: order.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 text-silver/50 transition-transform ${expanded ? "rotate-180" : ""}` })
          ] })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-3", children: "Order Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: STATUS_STEPS.map((step, i) => {
          const isActive = i <= currentStepIndex;
          const Icon = step.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-8 w-8 rounded-full flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-silver/10 text-silver/40"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-mono text-[9px] uppercase tracking-widest ${isActive ? "text-primary" : "text-silver/40"}`,
                children: step.label
              }
            ),
            i < STATUS_STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `hidden sm:block absolute h-0.5 w-20 top-4 left-1/2 ${i < currentStepIndex ? "bg-primary" : "bg-silver/20"}`,
                style: { transform: "translateX(50%)" }
              }
            )
          ] }, step.key);
        }) })
      ] }),
      order.items && order.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-3", children: "Items" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-silver/80", children: [
            item.product_title,
            item.variant && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-silver/50", children: [
              " (",
              item.variant,
              ")"
            ] }),
            " x",
            item.quantity
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-silver/60", children: [
            "$",
            (item.unit_price * item.quantity).toFixed(2)
          ] })
        ] }, item.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 pt-4 border-t border-border/40", children: [
        order.tracking_link && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: order.tracking_link,
            target: "_blank",
            rel: "noreferrer noopener",
            className: "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" }),
              " Track Package"
            ]
          }
        ),
        order.invoice_pdf_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: order.invoice_pdf_url,
            target: "_blank",
            rel: "noreferrer noopener",
            className: "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3" }),
              " Invoice"
            ]
          }
        ),
        (order.status === "delivered" || order.status === "shipped") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onStartReturn,
            className: "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
              " Start Return / Exchange"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border/40 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-silver/50", children: "Fulfillment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-silver", children: order.fulfillment_source === "in-store" ? "In-Store (POS)" : "Online" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-silver/50", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg", children: [
          "$",
          order.total_amount.toFixed(2),
          " AUD"
        ] })
      ] })
    ] })
  ] });
}
function ReturnModal({ orderId, onClose }) {
  const [reason, setReason] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState(false);
  const qc = useQueryClient();
  const submitReturn = useMutation({
    mutationFn: async () => {
      console.log("Return requested for order:", orderId, "Reason:", reason);
    },
    onSuccess: () => {
      toast.success("Return request submitted");
      qc.invalidateQueries({ queryKey: ["orders"] });
      setSubmitted(true);
    },
    onError: (e) => toast.error(sanitizeError(e))
  });
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md border border-border/60 bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-8 w-8 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-2", children: "Return Requested" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver/70 mb-6", children: "We've received your return request. Check your email for return instructions and a prepaid label." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70",
          children: "Close"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md border border-border/60 bg-card p-6 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 text-silver/50 hover:text-primary",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "Start a Return / Exchange" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-silver/70 mb-4", children: [
      "Order #",
      orderId.slice(0, 8)
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2", children: "Reason for return" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: reason,
          onChange: (e) => setReason(e.target.value),
          className: "w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "wrong_size", children: "Wrong size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "not_as_expected", children: "Not as expected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "defective", children: "Defective / damaged" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "changed_mind", children: "Changed my mind" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "Other" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: "Return Policy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-silver/60 mt-1", children: [
        "Items must be unworn, unwashed, and in original packaging. See our",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/returns", className: "text-primary hover:underline", children: "Returns Policy" }),
        " ",
        "for full details."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => submitReturn.mutate(),
        disabled: !reason || submitReturn.isPending,
        className: "w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 disabled:opacity-50",
        children: submitReturn.isPending ? "Submitting..." : "Submit Return Request"
      }
    )
  ] }) });
}
const WishlistRoute = Route$n.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => Route$o
});
const SupportRoute = Route$m.update({
  id: "/support",
  path: "/support",
  getParentRoute: () => Route$o
});
const ShopRoute = Route$l.update({
  id: "/shop",
  path: "/shop",
  getParentRoute: () => Route$o
});
const SearchRoute = Route$k.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$o
});
const GraveyardRoute = Route$j.update({
  id: "/graveyard",
  path: "/graveyard",
  getParentRoute: () => Route$o
});
const CommunityRoute = Route$i.update({
  id: "/community",
  path: "/community",
  getParentRoute: () => Route$o
});
const CheckoutRoute = Route$h.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$o
});
const CartRoute = Route$g.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$o
});
const BlogRoute = Route$f.update({
  id: "/blog",
  path: "/blog",
  getParentRoute: () => Route$o
});
const AdminRoute = Route$e.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$o
});
const AccountRoute = Route$d.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => Route$o
});
const AcademyRoute = Route$c.update({
  id: "/academy",
  path: "/academy",
  getParentRoute: () => Route$o
});
const AboutRoute = Route$b.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$o
});
const IndexRoute = Route$a.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$o
});
const ShopSlugRoute = Route$9.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => ShopRoute
});
const LegalTermsRoute = Route$8.update({
  id: "/legal/terms",
  path: "/legal/terms",
  getParentRoute: () => Route$o
});
const LegalReturnsRoute = Route$7.update({
  id: "/legal/returns",
  path: "/legal/returns",
  getParentRoute: () => Route$o
});
const LegalPrivacyRoute = Route$6.update({
  id: "/legal/privacy",
  path: "/legal/privacy",
  getParentRoute: () => Route$o
});
const LegalLiabilityRoute = Route$5.update({
  id: "/legal/liability",
  path: "/legal/liability",
  getParentRoute: () => Route$o
});
const BlogSlugRoute = Route$4.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => BlogRoute
});
const AdminProductsRoute = Route$3.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => AdminRoute
});
const AdminNewslettersRoute = Route$2.update({
  id: "/newsletters",
  path: "/newsletters",
  getParentRoute: () => AdminRoute
});
const AdminEventsRoute = Route$1.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => AdminRoute
});
const AccountOrdersRoute = Route.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AccountRoute
});
const AccountRouteChildren = {
  AccountOrdersRoute
};
const AccountRouteWithChildren = AccountRoute._addFileChildren(AccountRouteChildren);
const AdminRouteChildren = {
  AdminEventsRoute,
  AdminNewslettersRoute,
  AdminProductsRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const BlogRouteChildren = {
  BlogSlugRoute
};
const BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
const ShopRouteChildren = {
  ShopSlugRoute
};
const ShopRouteWithChildren = ShopRoute._addFileChildren(ShopRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AcademyRoute,
  AccountRoute: AccountRouteWithChildren,
  AdminRoute: AdminRouteWithChildren,
  BlogRoute: BlogRouteWithChildren,
  CartRoute,
  CheckoutRoute,
  CommunityRoute,
  GraveyardRoute,
  SearchRoute,
  ShopRoute: ShopRouteWithChildren,
  SupportRoute,
  WishlistRoute,
  LegalLiabilityRoute,
  LegalPrivacyRoute,
  LegalReturnsRoute,
  LegalTermsRoute
};
const routeTree = Route$o._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ALL_DEPARTMENTS as A,
  accessories as B,
  COLOURS as C,
  DEPARTMENT_LABELS as D,
  Route$9 as E,
  Footer as F,
  GENDERS as G,
  useProduct as H,
  productGallery as I,
  isLowStock as J,
  Route$4 as K,
  getPost as L,
  nextFridayISO as M,
  Nav as N,
  useEvents as O,
  PRICE_MIN as P,
  useUpsertEvent as Q,
  Route$l as R,
  SIZES as S,
  useDeleteEvent as T,
  EVENT_CATEGORY_LABELS as U,
  formatEventDate as V,
  router as W,
  useCart as a,
  useProducts as b,
  PRICE_MAX as c,
  SORT_LABELS as d,
  effectivePrice as e,
  DECK_SPEC_FIELDS as f,
  SURF_SPEC_FIELDS as g,
  Route$k as h,
  isOutOfStock as i,
  useGlobalSearch as j,
  GlobalSearch as k,
  highlightText as l,
  useNewsletters as m,
  posts as n,
  useAuth as o,
  productImage as p,
  sanitizeError as q,
  useSiteSettings as r,
  sortProducts as s,
  useUpdateSetting as t,
  useWishlist as u,
  SETTING_KEYS as v,
  SETTING_LABELS as w,
  deck as x,
  surfboard as y,
  apparel as z
};

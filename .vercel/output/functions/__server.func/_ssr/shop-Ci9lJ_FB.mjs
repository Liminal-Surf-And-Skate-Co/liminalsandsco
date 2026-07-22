import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { q as Route$c, m as useWishlist, l as useCart, u as useProducts, r as sortProducts, C as COLOURS, t as GENDERS, v as SIZES, D as DEPARTMENT_LABELS, P as PRICE_MIN, w as PRICE_MAX, N as Nav, A as ALL_DEPARTMENTS, x as SORT_LABELS, y as DECK_SPEC_FIELDS, z as SURF_SPEC_FIELDS, F as Footer, e as effectivePrice, B as isOutOfStock, p as productImage } from "./router-BZBp0UBL.mjs";
import { e as useMatches, O as Outlet, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { f as fallback } from "../_libs/tanstack__zod-adapter.mjs";
import { R as Root, T as Track, a as Range, b as Thumb } from "../_libs/radix-ui__react-slider.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { P as ProductBadges } from "./ProductBadges-DHuWtHXn.mjs";
import "../_libs/sonner.mjs";
import { u as Search, X, ao as SlidersHorizontal, H as Heart } from "../_libs/lucide-react.mjs";
import { s as stringType, o as objectType, n as numberType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-DYwJbDLa.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/date-fns.mjs";
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
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Track, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Root.displayName;
const csvSchema = fallback(stringType(), "").default("");
const splitCsv = (s) => s ? s.split(",").filter(Boolean) : [];
const joinCsv = (a) => a.join(",");
objectType({
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
function ShopRouteShell() {
  const matches = useMatches();
  const isProductDetail = matches.some((match) => match.routeId === "/shop/$slug");
  return isProductDetail ? /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShopPage, {});
}
function ShopPage() {
  const search = Route$c.useSearch();
  const navigate = useNavigate({
    from: "/shop"
  });
  const [open, setOpen] = reactExports.useState(true);
  const {
    has: wishHas,
    toggle: wishToggle
  } = useWishlist();
  const {
    add: cartAdd
  } = useCart();
  const {
    data: products,
    isLoading,
    error
  } = useProducts();
  const update = (patch) => navigate({
    search: (prev) => ({
      ...prev,
      ...patch
    }),
    replace: true
  });
  const selColours = splitCsv(search.colour);
  const selGenders = splitCsv(search.gender);
  const selSizes = splitCsv(search.size);
  const toggle = (csv, value) => {
    const set = new Set(splitCsv(csv));
    if (set.has(value)) set.delete(value);
    else set.add(value);
    return joinCsv([...set]);
  };
  const applyFilters = (except) => {
    let list = (products ?? []).slice();
    if (except !== "dept" && search.dept !== "all") list = list.filter((p) => p.department === search.dept);
    if (except !== "type" && search.type) list = list.filter((p) => (p.product_type ?? "") === search.type);
    if (except !== "category" && search.category) {
      const cat = search.category.toLowerCase();
      list = list.filter((p) => p.tags.map((t) => t.toLowerCase()).includes(cat) || (p.target_group ?? "").toLowerCase() === cat);
    }
    if (except !== "colour" && selColours.length) list = list.filter((p) => p.colour && selColours.includes(p.colour.toLowerCase()));
    if (except !== "gender" && selGenders.length) list = list.filter((p) => p.target_group && selGenders.includes(p.target_group.toLowerCase()));
    if (except !== "size" && selSizes.length) list = list.filter((p) => p.sizes.some((s) => selSizes.includes(s)));
    if (search.q.trim()) {
      const q = search.q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || (p.product_type ?? "").toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    list = list.filter((p) => {
      const price = effectivePrice(p);
      return price >= search.min && price <= search.max;
    });
    return list;
  };
  const filtered = reactExports.useMemo(() => sortProducts(applyFilters(), search.sort), [products, search, selColours, selGenders, selSizes]);
  const colourCounts = reactExports.useMemo(() => {
    const base = applyFilters("colour");
    const map = /* @__PURE__ */ new Map();
    for (const c of COLOURS) map.set(c, 0);
    for (const p of base) {
      const c = (p.colour ?? "").toLowerCase();
      if (map.has(c)) map.set(c, (map.get(c) ?? 0) + 1);
    }
    return map;
  }, [products, search, selGenders, selSizes]);
  const genderCounts = reactExports.useMemo(() => {
    const base = applyFilters("gender");
    const map = /* @__PURE__ */ new Map();
    for (const g of GENDERS) map.set(g, 0);
    for (const p of base) {
      const g = (p.target_group ?? "").toLowerCase();
      if (map.has(g)) map.set(g, (map.get(g) ?? 0) + 1);
    }
    return map;
  }, [products, search, selColours, selSizes]);
  const sizeCounts = reactExports.useMemo(() => {
    const base = applyFilters("size");
    const map = /* @__PURE__ */ new Map();
    for (const s of SIZES) map.set(s, 0);
    for (const p of base) {
      for (const s of p.sizes) if (map.has(s)) map.set(s, (map.get(s) ?? 0) + 1);
    }
    return map;
  }, [products, search, selColours, selGenders]);
  const reset = () => navigate({
    search: {
      q: "",
      sort: "newest",
      dept: "all",
      type: "",
      category: "",
      colour: "",
      gender: "",
      size: "",
      min: PRICE_MIN,
      max: PRICE_MAX
    },
    replace: true
  });
  const currentDeptLabel = search.dept === "all" ? "Everything we make" : DEPARTMENT_LABELS[search.dept];
  const badges = [];
  if (search.dept !== "all") badges.push({
    key: "dept",
    label: DEPARTMENT_LABELS[search.dept],
    clear: () => update({
      dept: "all",
      type: "",
      category: ""
    })
  });
  if (search.type) badges.push({
    key: "type",
    label: search.type,
    clear: () => update({
      type: ""
    })
  });
  if (search.category) badges.push({
    key: "category",
    label: search.category,
    clear: () => update({
      category: ""
    })
  });
  selColours.forEach((c) => badges.push({
    key: `c-${c}`,
    label: `Colour: ${c}`,
    clear: () => update({
      colour: toggle(search.colour, c)
    })
  }));
  selGenders.forEach((g) => badges.push({
    key: `g-${g}`,
    label: `Gender: ${g}`,
    clear: () => update({
      gender: toggle(search.gender, g)
    })
  }));
  selSizes.forEach((s) => badges.push({
    key: `s-${s}`,
    label: `Size: ${s}`,
    clear: () => update({
      size: toggle(search.size, s)
    })
  }));
  if (search.min !== PRICE_MIN || search.max !== PRICE_MAX) badges.push({
    key: "price",
    label: `$${search.min}–$${search.max}`,
    clear: () => update({
      min: PRICE_MIN,
      max: PRICE_MAX
    })
  });
  if (search.q.trim()) badges.push({
    key: "q",
    label: `“${search.q}”`,
    clear: () => update({
      q: ""
    })
  });
  const showDeckSpecs = search.dept === "skate";
  const showSurfSpecs = search.dept === "surf";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: search.dept === "all" ? "The Shop" : `Shop · ${currentDeptLabel}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-5xl lg:text-7xl leading-none mb-8", children: [
          currentDeptLabel,
          ",",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "in one place."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
            dept: "all",
            type: "",
            category: ""
          }), className: `px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${search.dept === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: "All" }),
          ALL_DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
            dept: d,
            type: "",
            category: ""
          }), className: `px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${search.dept === d ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: DEPARTMENT_LABELS[d] }, d))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-silver/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search.q, onChange: (e) => update({
            q: e.target.value
          }), placeholder: "Search products — wheels, wetsuit, hoodie…", className: "w-full pl-11 pr-4 py-3 bg-card border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-10 flex gap-8 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `${open ? "w-72" : "w-12"} shrink-0 sticky top-20 transition-[width] duration-300 hidden md:block`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen((o) => !o), "aria-label": open ? "Close filters" : "Open filters", className: "h-10 w-10 flex items-center justify-center border border-silver/40 text-silver hover:bg-silver hover:text-background transition-colors", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4" }) }),
            open && badges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70", children: "Clear all" })
          ] }),
          open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 border border-border/60 bg-card p-5 max-h-[calc(100vh-8rem)] overflow-y-auto", children: [
            badges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: "Active filters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: badges.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: b.clear, className: "inline-flex items-center gap-1 px-2 py-1 bg-primary/15 border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-primary-foreground", children: [
                b.label,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" })
              ] }, b.key)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterGroup, { label: "Price", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-silver", children: [
                "$",
                search.min,
                " – $",
                search.max
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { min: PRICE_MIN, max: PRICE_MAX, step: 10, value: [search.min, search.max], onValueChange: (v) => update({
                min: v[0],
                max: v[1]
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { label: "Sort by", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-1.5", children: Object.entries(SORT_LABELS).map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
              sort: key
            }), className: `text-left text-[11px] font-mono uppercase tracking-widest px-2.5 py-1.5 border transition-colors ${search.sort === key ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: label }, key)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { label: "Colour", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: COLOURS.map((c) => {
              const on = selColours.includes(c);
              const n = colourCounts.get(c) ?? 0;
              const disabled = n === 0 && !on;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: on, disabled, count: n, onClick: () => update({
                colour: toggle(search.colour, c)
              }), children: c }, c);
            }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { label: "Gender", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: GENDERS.map((g) => {
              const on = selGenders.includes(g);
              const n = genderCounts.get(g) ?? 0;
              const disabled = n === 0 && !on;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: on, disabled, count: n, onClick: () => update({
                gender: toggle(search.gender, g)
              }), children: g }, g);
            }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { label: "Size", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: SIZES.map((s) => {
              const on = selSizes.includes(s);
              const n = sizeCounts.get(s) ?? 0;
              const disabled = n === 0 && !on;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: on, disabled, count: n, onClick: () => update({
                size: toggle(search.size, s)
              }), children: s }, s);
            }) }) }),
            showDeckSpecs && /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterGroup, { label: "Deck specs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-silver/50 mb-2", children: "Filter by spec keyword (matches product spec values)." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: DECK_SPEC_FIELDS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
                category: search.category === f.key ? "" : f.key
              }), className: `w-full text-left px-2 py-1 font-mono text-[10px] uppercase border ${search.category === f.key ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: f.label }, f.key)) })
            ] }),
            showSurfSpecs && /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { label: "Surf specs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: SURF_SPEC_FIELDS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
              category: search.category === f.key ? "" : f.key
            }), className: `w-full text-left px-2 py-1 font-mono text-[10px] uppercase border ${search.category === f.key ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-silver hover:border-primary"}`, children: f.label }, f.key)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-silver/70", children: isLoading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}` }),
            badges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "md:hidden font-mono text-[10px] uppercase tracking-widest text-primary", children: "Clear all" })
          ] }),
          badges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden flex flex-wrap gap-1.5 mb-4", children: badges.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: b.clear, className: "inline-flex items-center gap-1 px-2 py-1 bg-primary/15 border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-widest", children: [
            b.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" })
          ] }, b.key)) }),
          error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70", children: "Couldn't load the shop. Try refreshing." }) : !isLoading && filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center font-mono text-sm text-silver/70", children: [
            "Nothing matches those filters.",
            badges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "text-primary underline-offset-4 hover:underline", children: "Clear all filters" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, saved: wishHas(p.slug), onWish: () => wishToggle(p.slug), onCart: () => cartAdd(p.slug) }, p.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function FilterGroup({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2", children: label }),
    children
  ] });
}
function FilterChip({
  children,
  active,
  disabled,
  count,
  onClick
}) {
  const base = "inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] uppercase border transition-colors";
  const tone = active ? "border-primary bg-primary text-primary-foreground" : disabled ? "border-border/40 text-silver/30 cursor-not-allowed line-through" : "border-border/60 text-silver hover:border-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: disabled ? void 0 : onClick, disabled, "aria-disabled": disabled, title: disabled ? "No matching products" : void 0, className: `${base} ${tone}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] ${active ? "text-primary-foreground/80" : disabled ? "text-silver/30" : "text-silver/50"}`, children: count })
  ] });
}
function ProductCard({
  product,
  saved,
  onWish,
  onCart
}) {
  const onSale = product.sale_price !== null && product.sale_price < product.price;
  const oos = isOutOfStock(product);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group block bg-card border border-border/60 hover:border-primary transition-colors overflow-hidden relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductBadges, { product }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
      e.preventDefault();
      onWish();
    }, "aria-label": saved ? "Remove from wishlist" : "Save to wishlist", className: "absolute top-3 right-3 z-10 h-9 w-9 flex items-center justify-center bg-background/80 backdrop-blur border border-border/60 hover:border-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-4 w-4 ${saved ? "fill-primary text-primary" : "text-silver"}` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop/$slug", params: {
      slug: product.slug
    }, className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: productImage(product), alt: product.title, loading: "lazy", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2", children: [
            DEPARTMENT_LABELS[product.department],
            product.product_type ? ` · ${product.product_type}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg", children: product.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: onSale ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-silver/50 text-xs font-mono line-through", children: [
            "$",
            product.price
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-primary text-sm font-mono", children: [
            "$",
            product.sale_price
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-silver text-sm font-mono", children: [
          "$",
          product.price
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCart, disabled: oos, className: "w-full font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed", children: oos ? "Out of stock" : "Add to cart" }) })
  ] });
}
export {
  ShopRouteShell as component
};

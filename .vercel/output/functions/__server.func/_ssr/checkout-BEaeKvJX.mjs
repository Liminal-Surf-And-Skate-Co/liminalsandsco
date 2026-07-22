import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useCart, u as useWishlist, b as useProducts, e as effectivePrice, N as Nav, F as Footer, p as productImage, D as DEPARTMENT_LABELS } from "./router-BkwgZ6Uu.mjs";
import { L as Label, I as Input, B as Button } from "./label-CKnQI1IM.mjs";
import "../_libs/sonner.mjs";
import { y as CircleCheck, L as Lock, T as TriangleAlert, H as Heart, z as CreditCard, A as Loader } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    clear
  } = useCart();
  const {
    toggle: toggleWish,
    has: hasWish
  } = useWishlist();
  const {
    data: products = []
  } = useProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines = items.map((i) => ({
    item: i,
    product: bySlug.get(i.slug)
  })).filter((l) => Boolean(l.product));
  const subtotal = lines.reduce((n, l) => n + effectivePrice(l.product) * l.item.qty, 0);
  const shipping = subtotal > 0 ? subtotal >= 100 ? 0 : 12 : 0;
  const total = subtotal + shipping;
  const [pay, setPay] = reactExports.useState("card");
  const [status, setStatus] = reactExports.useState("idle");
  const [errMsg, setErrMsg] = reactExports.useState("");
  const [simulateFail, setSimulateFail] = reactExports.useState(false);
  const [savedToWishlist, setSavedToWishlist] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [zip, setZip] = reactExports.useState("");
  const [card, setCard] = reactExports.useState("");
  const [exp, setExp] = reactExports.useState("");
  const [cvc, setCvc] = reactExports.useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    if (lines.length === 0) return;
    setStatus("processing");
    setErrMsg("");
    await new Promise((r) => setTimeout(r, 1400));
    if (simulateFail) {
      const messages = ["Your card was declined by the issuer. Please try another payment method.", "One of the items in your cart just went out of stock during processing.", "We couldn't reach the payment network. Your card has not been charged."];
      setErrMsg(messages[Math.floor(Math.random() * messages.length)]);
      setStatus("error");
      return;
    }
    setStatus("success");
    setTimeout(() => clear(), 400);
  }
  function saveToWishlist() {
    lines.forEach((l) => {
      if (!hasWish(l.product.slug)) toggleWish(l.product.slug);
    });
    setSavedToWishlist(true);
    setTimeout(() => {
      clear();
      navigate({
        to: "/wishlist"
      });
    }, 900);
  }
  if (status === "success") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-2xl mx-auto px-6 py-24 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 border border-primary/40 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl mb-3", children: "Order confirmed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-silver/70 mb-8", children: [
          "Thanks for the order. A receipt is on its way to",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: email || "your inbox" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "font-mono text-xs uppercase tracking-widest px-6 py-3 border border-border/60 hover:border-primary", children: "Keep shopping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "font-mono text-xs uppercase tracking-widest px-6 py-3 bg-primary text-primary-foreground hover:opacity-90", children: "View account" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-6xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl lg:text-5xl", children: "Checkout" })
      ] }),
      lines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-silver/70 mb-6", children: "Your cart is empty." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "font-mono text-xs uppercase tracking-widest text-primary hover:underline", children: "Browse the shop →" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid lg:grid-cols-[1fr_380px] gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
          status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-destructive/50 bg-destructive/10 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base mb-1", children: "Payment couldn't be completed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-silver/80 leading-relaxed", children: errMsg })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: saveToWishlist, disabled: savedToWishlist, className: "w-full flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest px-5 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4" }),
              savedToWishlist ? "Saved — redirecting…" : "Save cart items to wishlist"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-3", children: "Express checkout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPay("apple"), className: `h-12 flex items-center justify-center gap-2 border font-mono text-xs uppercase tracking-widest transition-colors ${pay === "apple" ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/60"}`, children: "Pay" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPay("google"), className: `h-12 flex items-center justify-center gap-2 border font-mono text-xs uppercase tracking-widest transition-colors ${pay === "google" ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/60"}`, children: "G Pay" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/50", children: "or pay with card" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/40" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl", children: "Contact & shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "font-mono text-[10px] uppercase tracking-widest text-silver/70", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 focus-visible:ring-primary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "font-mono text-[10px] uppercase tracking-widest text-silver/70", children: "Full name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1 focus-visible:ring-primary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", className: "font-mono text-[10px] uppercase tracking-widest text-silver/70", children: "Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "address", required: true, value: address, onChange: (e) => setAddress(e.target.value), className: "mt-1 focus-visible:ring-primary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "city", className: "font-mono text-[10px] uppercase tracking-widest text-silver/70", children: "City" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "city", required: true, value: city, onChange: (e) => setCity(e.target.value), className: "mt-1 focus-visible:ring-primary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "zip", className: "font-mono text-[10px] uppercase tracking-widest text-silver/70", children: "ZIP / Postcode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "zip", required: true, value: zip, onChange: (e) => setZip(e.target.value), className: "mt-1 focus-visible:ring-primary" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl", children: "Payment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-silver/70", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardBadge, { label: "VISA" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardBadge, { label: "MC" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardBadge, { label: "AMEX" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setPay("card"), className: `w-full text-left p-4 border transition-colors ${pay === "card" ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/60"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-4 w-4 rounded-full border-2 ${pay === "card" ? "border-primary bg-primary" : "border-silver/50"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-silver" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-widest", children: "Credit / Debit card" })
              ] }),
              pay === "card" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-[1fr_120px_100px] gap-3 mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Card number", value: card, onChange: (e) => setCard(e.target.value), className: "focus-visible:ring-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "MM / YY", value: exp, onChange: (e) => setExp(e.target.value), className: "focus-visible:ring-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "CVC", value: cvc, onChange: (e) => setCvc(e.target.value), className: "focus-visible:ring-primary" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPay("afterpay"), className: `w-full text-left p-4 border transition-colors ${pay === "afterpay" ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/60"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-4 w-4 rounded-full border-2 ${pay === "afterpay" ? "border-primary bg-primary" : "border-silver/50"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest bg-foreground text-background px-2 py-1", children: "Afterpay" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-silver/80", children: [
                "or 4 interest-free payments of",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                  "$",
                  (total / 4).toFixed(2)
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 p-3 border border-dashed border-border/60 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: simulateFail, onChange: (e) => setSimulateFail(e.target.checked), className: "accent-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-silver/70", children: "Simulate payment failure (testing)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lg:sticky lg:top-24 lg:self-start space-y-5 border border-border/60 bg-card p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl", children: "Order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4 max-h-72 overflow-y-auto", children: lines.map(({
            item,
            product
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-background overflow-hidden shrink-0 border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: productImage(product), alt: product.title, className: "w-full h-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] uppercase tracking-widest text-primary", children: DEPARTMENT_LABELS[product.department] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm truncate", children: product.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-silver/60", children: [
                "Qty ",
                item.qty
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs", children: [
              "$",
              (effectivePrice(product) * item.qty).toFixed(2)
            ] })
          ] }, product.slug)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-mono text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-silver/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "$",
                subtotal.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-silver/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: shipping === 0 ? "Free" : `$${shipping.toFixed(2)}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between pt-2 border-t border-border/40 text-base font-display font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "$",
                total.toFixed(2)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: status === "processing", className: "w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-mono text-xs uppercase tracking-widest", children: status === "processing" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "h-4 w-4 animate-spin" }),
            " Processing…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
            " Complete purchase · $",
            total.toFixed(2)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-silver/50 text-center", children: "Secure checkout · Encrypted end-to-end" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function CardBadge({
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] font-bold tracking-wider px-2 py-1 border border-border/60 bg-background/50", children: label });
}
export {
  CheckoutPage as component
};

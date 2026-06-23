import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Lock, AlertTriangle, Heart, CheckCircle2, Loader2 } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useProducts, productImage, effectivePrice, DEPARTMENT_LABELS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Liminal Surf & Skate Co" },
      {
        name: "description",
        content: "Complete your order — secure checkout with multiple payment options.",
      },
    ],
  }),
  component: CheckoutPage,
});

type PayMethod = "card" | "apple" | "google" | "afterpay";
type Status = "idle" | "processing" | "error" | "success";

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { toggle: toggleWish, has: hasWish } = useWishlist();
  const { data: products = [] } = useProducts();

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines = items
    .map((i) => ({ item: i, product: bySlug.get(i.slug) }))
    .filter(
      (
        l,
      ): l is {
        item: (typeof items)[number];
        product: NonNullable<ReturnType<typeof bySlug.get>>;
      } => Boolean(l.product),
    );

  const subtotal = lines.reduce((n, l) => n + effectivePrice(l.product) * l.item.qty, 0);
  const shipping = subtotal > 0 ? (subtotal >= 100 ? 0 : 12) : 0;
  const total = subtotal + shipping;

  const [pay, setPay] = useState<PayMethod>("card");
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [simulateFail, setSimulateFail] = useState(false);
  const [savedToWishlist, setSavedToWishlist] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setStatus("processing");
    setErrMsg("");
    await new Promise((r) => setTimeout(r, 1400));
    if (simulateFail) {
      const messages = [
        "Your card was declined by the issuer. Please try another payment method.",
        "One of the items in your cart just went out of stock during processing.",
        "We couldn't reach the payment network. Your card has not been charged.",
      ];
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
      navigate({ to: "/wishlist" });
    }, 900);
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 border border-primary/40 mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display font-black text-4xl mb-3">Order confirmed</h1>
          <p className="font-mono text-sm text-silver/70 mb-8">
            Thanks for the order. A receipt is on its way to{" "}
            <span className="text-primary">{email || "your inbox"}</span>.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/shop"
              className="font-mono text-xs uppercase tracking-widest px-6 py-3 border border-border/60 hover:border-primary"
            >
              Keep shopping
            </Link>
            <Link
              to="/account"
              className="font-mono text-xs uppercase tracking-widest px-6 py-3 bg-primary text-primary-foreground hover:opacity-90"
            >
              View account
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <Lock className="h-5 w-5 text-primary" />
          <h1 className="font-display font-black text-4xl lg:text-5xl">Checkout</h1>
        </div>

        {lines.length === 0 ? (
          <div className="border border-border/60 bg-card p-12 text-center">
            <p className="font-mono text-sm text-silver/70 mb-6">Your cart is empty.</p>
            <Link
              to="/shop"
              className="font-mono text-xs uppercase tracking-widest text-primary hover:underline"
            >
              Browse the shop →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_380px] gap-10">
            <div className="space-y-8">
              {/* Error banner */}
              {status === "error" && (
                <div className="border border-destructive/50 bg-destructive/10 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display font-bold text-base mb-1">
                        Payment couldn't be completed
                      </p>
                      <p className="font-mono text-xs text-silver/80 leading-relaxed">{errMsg}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={saveToWishlist}
                    disabled={savedToWishlist}
                    className="w-full flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest px-5 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                  >
                    <Heart className="h-4 w-4" />
                    {savedToWishlist ? "Saved — redirecting…" : "Save cart items to wishlist"}
                  </button>
                </div>
              )}

              {/* Express pay */}
              <section>
                <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-3">
                  Express checkout
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPay("apple")}
                    className={`h-12 flex items-center justify-center gap-2 border font-mono text-xs uppercase tracking-widest transition-colors ${pay === "apple" ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/60"}`}
                  >
                    Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPay("google")}
                    className={`h-12 flex items-center justify-center gap-2 border font-mono text-xs uppercase tracking-widest transition-colors ${pay === "google" ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/60"}`}
                  >
                    G Pay
                  </button>
                </div>
              </section>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border/40" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
                  or pay with card
                </span>
                <div className="h-px flex-1 bg-border/40" />
              </div>

              {/* Contact */}
              <section className="space-y-4">
                <h2 className="font-display font-bold text-xl">Contact & shipping</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="email"
                      className="font-mono text-[10px] uppercase tracking-widest text-silver/70"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="name"
                      className="font-mono text-[10px] uppercase tracking-widest text-silver/70"
                    >
                      Full name
                    </Label>
                    <Input
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="address"
                      className="font-mono text-[10px] uppercase tracking-widest text-silver/70"
                    >
                      Address
                    </Label>
                    <Input
                      id="address"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="city"
                      className="font-mono text-[10px] uppercase tracking-widest text-silver/70"
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="zip"
                      className="font-mono text-[10px] uppercase tracking-widest text-silver/70"
                    >
                      ZIP / Postcode
                    </Label>
                    <Input
                      id="zip"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="mt-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-xl">Payment</h2>
                  <div className="flex items-center gap-2 text-silver/70">
                    <CardBadge label="VISA" />
                    <CardBadge label="MC" />
                    <CardBadge label="AMEX" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPay("card")}
                  className={`w-full text-left p-4 border transition-colors ${pay === "card" ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/60"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${pay === "card" ? "border-primary bg-primary" : "border-silver/50"}`}
                    />
                    <CreditCard className="h-4 w-4 text-silver" />
                    <span className="font-mono text-xs uppercase tracking-widest">
                      Credit / Debit card
                    </span>
                  </div>
                  {pay === "card" && (
                    <div className="grid sm:grid-cols-[1fr_120px_100px] gap-3 mt-4">
                      <Input
                        placeholder="Card number"
                        value={card}
                        onChange={(e) => setCard(e.target.value)}
                        className="focus-visible:ring-primary"
                      />
                      <Input
                        placeholder="MM / YY"
                        value={exp}
                        onChange={(e) => setExp(e.target.value)}
                        className="focus-visible:ring-primary"
                      />
                      <Input
                        placeholder="CVC"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPay("afterpay")}
                  className={`w-full text-left p-4 border transition-colors ${pay === "afterpay" ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/60"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${pay === "afterpay" ? "border-primary bg-primary" : "border-silver/50"}`}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-widest bg-foreground text-background px-2 py-1">
                      Afterpay
                    </span>
                    <span className="font-mono text-xs text-silver/80">
                      or 4 interest-free payments of{" "}
                      <span className="text-foreground">${(total / 4).toFixed(2)}</span>
                    </span>
                  </div>
                </button>
              </section>

              {/* Test toggle */}
              <label className="flex items-center gap-3 p-3 border border-dashed border-border/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFail}
                  onChange={(e) => setSimulateFail(e.target.checked)}
                  className="accent-primary"
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver/70">
                  Simulate payment failure (testing)
                </span>
              </label>
            </div>

            {/* Order summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start space-y-5 border border-border/60 bg-card p-6">
              <h2 className="font-display font-bold text-xl">Order</h2>
              <ul className="space-y-4 max-h-72 overflow-y-auto">
                {lines.map(({ item, product }) => (
                  <li key={product.slug} className="flex gap-3">
                    <div className="w-14 h-14 bg-background overflow-hidden shrink-0 border border-border/40">
                      <img
                        src={productImage(product)}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-primary">
                        {DEPARTMENT_LABELS[product.department]}
                      </p>
                      <p className="font-display font-bold text-sm truncate">{product.title}</p>
                      <p className="font-mono text-[10px] text-silver/60">Qty {item.qty}</p>
                    </div>
                    <p className="font-mono text-xs">
                      ${(effectivePrice(product) * item.qty).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 pt-4 border-t border-border/40 font-mono text-xs">
                <div className="flex justify-between text-silver/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-silver/80">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/40 text-base font-display font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={status === "processing"}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-mono text-xs uppercase tracking-widest"
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Complete purchase · ${total.toFixed(2)}
                  </>
                )}
              </Button>

              <p className="font-mono text-[10px] text-silver/50 text-center">
                Secure checkout · Encrypted end-to-end
              </p>
            </aside>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

function CardBadge({ label }: { label: string }) {
  return (
    <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-1 border border-border/60 bg-background/50">
      {label}
    </span>
  );
}

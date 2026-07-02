import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { RotateCcw, Package, Clock, TriangleAlert as AlertTriangle, Check } from "lucide-react";

export const Route = createFileRoute("/legal/returns")({
  head: () => ({
    meta: [{ title: "Returns Policy — Liminal Surf & Skate Co" }],
  }),
  component: ReturnsPage,
});

export function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <RotateCcw className="h-8 w-8 text-primary" />
          <h1 className="font-display font-black text-4xl">Returns & Exchanges</h1>
        </div>
        <p className="font-mono text-xs text-silver/50 mb-8">Last updated: July 2026</p>

        {/* Quick summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="border border-border/60 bg-card p-5">
            <Clock className="h-5 w-5 text-primary mb-2" />
            <p className="font-display font-bold text-lg">30 Days</p>
            <p className="text-sm text-silver/60">Return window for unworn items</p>
          </div>
          <div className="border border-border/60 bg-card p-5">
            <Package className="h-5 w-5 text-primary mb-2" />
            <p className="font-display font-bold text-lg">Free Returns</p>
            <p className="text-sm text-silver/60">On orders over $100 AUD</p>
          </div>
          <div className="border border-border/60 bg-card p-5">
            <RotateCcw className="h-5 w-5 text-primary mb-2" />
            <p className="font-display font-bold text-lg">Refunds</p>
            <p className="text-sm text-silver/60">Processed within 5-10 days</p>
          </div>
        </div>

        <div className="prose prose-silver max-w-none">
          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">1. Return Eligibility</h2>
            <p className="text-silver/80 leading-relaxed mb-4">
              We accept returns within 30 days of delivery for items that are:
            </p>
            <ul className="space-y-2">
              {[
                "Unworn, unwashed, and in original condition",
                "In original packaging with all tags attached",
                "Accompanied by proof of purchase (order confirmation or receipt)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-silver/80">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">2. Non-Returnable Items</h2>
            <p className="text-silver/80 leading-relaxed mb-4">The following items cannot be returned:</p>
            <ul className="space-y-2">
              {[
                "Swimwear and bikini bottoms (for hygiene reasons)",
                "Underwear and socks",
                "Custom or personalized items",
                "Items marked as final sale",
                "Gift cards",
                "Equipment that has been used, waxed, or assembled",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-silver/80">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">3. How to Start a Return</h2>
            <ol className="list-decimal pl-6 space-y-3 text-silver/80">
              <li>
                <strong>Log in to your account</strong> and navigate to your order history
              </li>
              <li>
                <strong>Select the order</strong> containing the item(s) you wish to return
              </li>
              <li>
                <strong>Click "Start Return"</strong> and follow the prompts to generate a return
                shipping label
              </li>
              <li>
                <strong>Pack your items</strong> in the original packaging if possible
              </li>
              <li>
                <strong>Attach the label</strong> and drop off at any Australia Post location
              </li>
            </ol>
            <p className="text-silver/80 mt-4">
              Guest orders: email us at contact@liminalsandsco.com with your order number and
              return request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">4. Refunds</h2>
            <p className="text-silver/80 leading-relaxed">
              Once we receive and inspect your return, we'll process your refund within 3-5 business
              days. Refunds are credited to the original payment method. Shipping charges are
              non-refundable unless the return is due to our error or a defective product.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">5. Exchanges</h2>
            <p className="text-silver/80 leading-relaxed">
              Need a different size or colour? Place a new order and return the original item for a
              refund. This ensures you get the replacement quickly without waiting for stock to
              potentially sell out. We recommend returning items for a refund and placing a new
              order — it's the fastest way.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">6. Defective or Damaged Items</h2>
            <p className="text-silver/80 leading-relaxed">
              If you receive a defective or damaged item, contact us immediately at
              contact@liminalsandsco.com with photos of the issue. We'll arrange a replacement or
              full refund at no cost to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">7. Return Shipping Costs</h2>
            <ul className="space-y-2 text-silver/80">
              <li>
                <strong>Orders over $100 AUD:</strong> Free return shipping
              </li>
              <li>
                <strong>Orders under $100 AUD:</strong> $9.95 return shipping fee deducted from refund
              </li>
              <li>
                <strong>Defective/incorrect items:</strong> We cover return shipping in full
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">8. Questions?</h2>
            <p className="text-silver/80 leading-relaxed">
              Email us at contact@liminalsandsco.com or reach out via our{" "}
              <a href="/support" className="text-primary hover:underline">
                support page
              </a>
              . We typically respond within 24-48 hours.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

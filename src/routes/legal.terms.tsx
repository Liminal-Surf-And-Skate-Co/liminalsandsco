import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [{ title: "Terms of Service — Liminal Surf & Skate Co" }],
  }),
  component: TermsPage,
});

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="font-display font-black text-4xl">Terms of Service</h1>
        </div>
        <p className="font-mono text-xs text-silver/50 mb-8">Last updated: July 2026</p>

        <div className="prose prose-silver max-w-none">
          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">1. Agreement to Terms</h2>
            <p className="text-silver/80 leading-relaxed">
              By accessing or using Liminal Surf & Skate Co's website and services, you agree to
              be bound by these Terms. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">2. Account Responsibilities</h2>
            <p className="text-silver/80 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities under your account. You agree to provide accurate information
              and to update it promptly. We reserve the right to suspend or terminate accounts that
              violate these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">3. Orders and Payment</h2>
            <p className="text-silver/80 leading-relaxed">
              All orders are subject to acceptance and availability. Prices are in Australian
              Dollars (AUD) and include applicable taxes. Payment is due at the time of order. We
              reserve the right to cancel orders for any reason, including pricing errors or
              suspected fraud.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">4. Shipping and Delivery</h2>
            <p className="text-silver/80 leading-relaxed">
              Shipping times are estimates only. We ship within Australia using Australia Post and
              Sendle. International shipping is available to select countries. Risk of loss passes
              to you upon delivery to the carrier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">5. Returns and Refunds</h2>
            <p className="text-silver/80 leading-relaxed">
              Please see our{" "}
              <a href="/legal/returns" className="text-primary hover:underline">
                Returns Policy
              </a>{" "}
              for details on returns, exchanges, and refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">6. Intellectual Property</h2>
            <p className="text-silver/80 leading-relaxed">
              All content on this website, including text, graphics, logos, and images, is the
              property of Liminal Surf & Skate Co and protected by Australian and international
              copyright laws. You may not use, reproduce, or distribute our content without written
              permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">7. Prohibited Conduct</h2>
            <p className="text-silver/80 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-silver/80">
              <li>Use our services for any unlawful purpose</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with other users' use of our services</li>
              <li>Scrape, harvest, or collect user data without consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">8. Limitation of Liability</h2>
            <p className="text-silver/80 leading-relaxed">
              To the maximum extent permitted by law, Liminal Surf & Skate Co is not liable for any
              indirect, incidental, or consequential damages arising from your use of our services.
              Our total liability is limited to the amount you paid for the specific product or
              service in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">9. Changes to Terms</h2>
            <p className="text-silver/80 leading-relaxed">
              We may update these Terms from time to time. Continued use of our services after
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">10. Governing Law</h2>
            <p className="text-silver/80 leading-relaxed">
              These Terms are governed by the laws of New South Wales, Australia. Any disputes will
              be resolved in the courts of New South Wales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">11. Contact</h2>
            <p className="text-silver/80 leading-relaxed">
              For questions about these Terms, contact us at contact@liminalsandsco.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

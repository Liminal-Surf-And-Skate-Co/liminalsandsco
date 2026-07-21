import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy — Liminal Surf & Skate Co" }],
  }),
  component: PrivacyPage,
});

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="font-display font-black text-4xl">Privacy Policy</h1>
        </div>
        <p className="font-mono text-xs text-silver/50 mb-8">Last updated: July 2026</p>

        <div className="prose prose-silver max-w-none">
          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">1. Information We Collect</h2>
            <p className="text-silver/80 leading-relaxed">
              When you create an account or place an order, we collect information you provide
              directly, including your name, email address, shipping address, and payment details.
              We also automatically collect certain information when you visit our website, such as
              your IP address, browser type, device information, and browsing activity through
              cookies and similar technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">2. How We Use Your Information</h2>
            <p className="text-silver/80 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-silver/80">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders, account, and promotional offers</li>
              <li>Personalize your experience and improve our website</li>
              <li>Prevent fraud and maintain the security of our systems</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">3. Loyalty Points</h2>
            <p className="text-silver/80 leading-relaxed">
              Points balances are read-only on the client side and can only be modified via
              server-side operations triggered by verified actions (registration, reviews, orders).
              Users cannot self-grant or manually update their points balance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">4. Data Security</h2>
            <p className="text-silver/80 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet is 100% secure, and
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">5. Cookies</h2>
            <p className="text-silver/80 leading-relaxed">
              We use cookies and similar tracking technologies to collect and store information
              about your preferences and activity. You can set your browser to refuse cookies, but
              some features may not function properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">6. Third-Party Services</h2>
            <p className="text-silver/80 leading-relaxed">
              We may use third-party services for payments (Stripe), analytics, and email
              communications. These services have their own privacy policies and are responsible
              for the data they collect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">7. Your Rights</h2>
            <p className="text-silver/80 leading-relaxed">
              You have the right to access, correct, or delete your personal information. To
              exercise these rights, contact us at contact@liminalsandsco.com. Australian residents
              have additional rights under the Privacy Act 1988.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">8. Contact</h2>
            <p className="text-silver/80 leading-relaxed">
              For privacy-related inquiries, contact us at contact@liminalsandsco.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

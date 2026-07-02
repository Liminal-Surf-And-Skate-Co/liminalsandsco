import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { TriangleAlert as AlertTriangle, Waves, Sparkles, Shield } from "lucide-react";

export const Route = createFileRoute("/legal/liability")({
  head: () => ({
    meta: [{ title: "Activity Waiver — Liminal Surf & Skate Co" }],
  }),
  component: LiabilityPage,
});

export function LiabilityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
          <h1 className="font-display font-black text-4xl">Activity Waiver</h1>
        </div>
        <p className="font-mono text-xs text-silver/50 mb-8">
          Action Sports Liability Acknowledgment
        </p>

        {/* Summary box */}
        <div className="border border-amber-500/50 bg-amber-500/10 p-6 mb-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-bold text-lg text-amber-500 mb-2">
                Important Notice
              </h2>
              <p className="text-sm text-silver/80">
                Skateboarding, surfing, and other action sports carry inherent risks. By purchasing
                equipment from Liminal Surf & Skate Co, you acknowledge and accept these risks
                and agree to this waiver.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="border border-border/60 bg-card p-5">
            <Sparkles className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-display font-bold mb-2">Skateboarding Risks</h3>
            <ul className="space-y-1 text-sm text-silver/70">
              <li>• Falls and impact injuries</li>
              <li>• Collision with obstacles or vehicles</li>
              <li>• Equipment failure or breakage</li>
              <li>• Road rash, fractures, and head injuries</li>
            </ul>
          </div>
          <div className="border border-border/60 bg-card p-5">
            <Waves className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-display font-bold mb-2">Surfing Risks</h3>
            <ul className="space-y-1 text-sm text-silver/70">
              <li>• Drowning and near-drowning</li>
              <li>• Impact with surfboard, reef, or ocean floor</li>
              <li>• Marine life encounters</li>
              <li>• Rip currents and changing conditions</li>
            </ul>
          </div>
        </div>

        <div className="prose prose-silver max-w-none">
          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">
              1. Acknowledgment of Inherent Risks
            </h2>
            <p className="text-silver/80 leading-relaxed">
              I understand that action sports including skateboarding, surfing, inline skating,
              BMX, and related activities involve inherent risks that cannot be eliminated
              regardless of the care taken to avoid injuries. These risks include, but are not
              limited to: slips, falls, collisions, equipment failure, impact injuries, head
              injuries, paralysis, and death.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">2. Assumption of Risk</h2>
            <p className="text-silver/80 leading-relaxed">
              I hereby voluntarily assume all risks associated with action sports activities,
              both known and unknown, even if arising from the negligence of Liminal Surf &
              Skate Co, its employees, agents, or representatives. I understand that these
              activities involve risks both on and off the water, at skateparks, on public
              roads, and in private facilities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">3. Waiver and Release</h2>
            <p className="text-silver/80 leading-relaxed">
              In consideration of being permitted to purchase and use equipment from Liminal
              Surf & Skate Co, I hereby release, waive, discharge, and covenant not to sue the
              company, its officers, employees, agents, and representatives from any and all
              liability, claims, demands, actions, and causes of action whatsoever arising out
              of or related to any loss, damage, or injury, including death, that may be
              sustained by me or any property belonging to me while engaged in action sports
              activities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">4. Equipment Disclaimer</h2>
            <p className="text-silver/80 leading-relaxed">
              I understand that skateboards, surfboards, and related equipment can fail under
              stress, impact, or improper use. Liminal Surf & Skate Co makes no warranties,
              express or implied, regarding the safety or fitness of any product for any
              particular purpose. I accept responsibility for proper inspection, maintenance,
              and appropriate use of all equipment purchased.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">5. Protective Equipment</h2>
            <p className="text-silver/80 leading-relaxed">
              I acknowledge the importance of wearing appropriate protective equipment
              including helmets, wrist guards, knee pads, and elbow pads while engaged in
              action sports. Liminal Surf & Skate Co strongly recommends the use of certified
              protective equipment at all times.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">6. Indemnification</h2>
            <p className="text-silver/80 leading-relaxed">
              I agree to indemnify and hold harmless Liminal Surf & Skate Co from any and all
              claims, actions, suits, costs, and expenses, including attorney's fees, arising
              from my participation in action sports activities or use of products purchased
              from Liminal Surf & Skate Co.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">7. Governing Law</h2>
            <p className="text-silver/80 leading-relaxed">
              This waiver shall be governed by and construed in accordance with the laws of New
              South Wales, Australia. Any disputes arising under this waiver shall be resolved
              in the courts of New South Wales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">8. Acknowledgment</h2>
            <p className="text-silver/80 leading-relaxed">
              By purchasing products from Liminal Surf & Skate Co, either online or in-store,
              I acknowledge that I have read and understood this waiver, and I agree to be
              bound by its terms. I certify that I am at least 18 years of age, or if under 18,
              my parent or legal guardian has reviewed and agreed to these terms on my behalf.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display font-bold text-xl mb-4">Questions?</h2>
            <p className="text-silver/80 leading-relaxed">
              If you have questions about this waiver, contact us at contact@liminalsandsco.com.
            </p>
          </section>
        </div>

        {/* Liam wisdom */}
        <div className="border-t border-border/40 pt-8 mt-12">
          <div className="flex items-center gap-4">
            <Shield className="h-10 w-10 text-silver/50" />
            <div>
              <p className="font-mono text-sm text-silver/70 italic">
                "Ride hard, but ride smart. Liam wears his helmet everywhere."
              </p>
              <p className="font-mono text-xs text-silver/40 mt-1">— Liam the Llama</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

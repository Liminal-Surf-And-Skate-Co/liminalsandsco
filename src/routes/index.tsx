import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { LatestDrop } from "@/components/site/LatestDrop";
import { Shop } from "@/components/site/Shop";
import { BentoGrid, type BentoItem } from "@/components/site/BentoGrid";
import { CommunityTeaser } from "@/components/site/CommunityTeaser";
import { SocialFeed } from "@/components/site/SocialFeed";
import { Custom } from "@/components/site/Custom";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Liminal Surf & Skate Co — Hand-shaped boards & wear" },
      {
        name: "description",
        content:
          "Hand-shaped skateboards, custom surfboards, and small-batch apparel from a one-bench workshop. Order custom or shop the latest drop.",
      },
      { property: "og:title", content: "Liminal Surf & Skate Co" },
      {
        property: "og:description",
        content: "Hand-shaped surf and skate. No factories. No shortcuts.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const bentoItems: BentoItem[] = [
    { id: "b1", type: "feature", slug: "liminal-pro-deck", title: "Pro Deck 8.25\"", subtitle: "Hand-shaped maple", image: "/src/assets/hero-deck.jpg", price: 120, colSpan: 2, rowSpan: 2 },
    { id: "b2", type: "standard", slug: "liminal-tee", title: "Workshop Tee", image: "/src/assets/apparel.jpg", price: 55 },
    { id: "b3", type: "standard", slug: "liminal-cap", title: "6-Panel Cap", image: "/src/assets/accessories.jpg", price: 40 },
    { id: "b4", type: "video", title: "Team Test Session", subtitle: "Watch the crew put it through the paces", image: "", videoUrl: "" },
    { id: "b5", type: "standard", slug: "craft-surfboard", title: "Custom Surfboard", image: "/src/assets/craft-surfboard.jpg", price: 780 },
  ];
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <About />
        <LatestDrop />
        <section className="px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
                <h2 className="font-display font-black text-2xl md:text-3xl">The Bento Grid</h2>
              </div>
            </div>
            <BentoGrid items={bentoItems} />
          </div>
        </section>
        <Shop />
        <CommunityTeaser />
        <SocialFeed />
        <Custom />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

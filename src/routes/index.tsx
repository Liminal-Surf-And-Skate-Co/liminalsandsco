import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Craft } from "@/components/site/Craft";
import { Shop } from "@/components/site/Shop";
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
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Craft />
        <Shop />
        <Custom />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

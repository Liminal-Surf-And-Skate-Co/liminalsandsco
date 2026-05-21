import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Shop } from "@/components/site/Shop";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "Hand-shaped skate decks, shaped surfboards, heavyweight hoodies, and accessories. Shop the latest drop from Liminal.",
      },
      { property: "og:title", content: "Shop — Liminal Surf & Skate Co" },
      {
        property: "og:description",
        content: "Shop hand-shaped decks, surfboards, apparel, and accessories from Liminal.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Shop />
      </main>
      <Footer />
    </div>
  );
}

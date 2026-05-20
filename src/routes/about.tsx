import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { About } from "@/components/site/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "One bench. Two worlds. One stoke. The story behind Liminal — a hand-shaped surf and skate workshop made for the in-between.",
      },
      { property: "og:title", content: "About — Liminal Surf & Skate Co" },
      {
        property: "og:description",
        content: "The story behind Liminal — hand-shaped surf and skate from a one-bench workshop.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <About />
      </main>
      <Footer />
    </div>
  );
}

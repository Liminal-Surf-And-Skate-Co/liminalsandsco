export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "between-wave-and-concrete",
    title: "Between the Wave and the Concrete",
    excerpt:
      "Why we started Liminal — a love letter to the in-between hours and the people who live there.",
    date: "2026-05-12",
    readTime: "4 min",
    category: "Workshop Notes",
    body: [
      "There's an hour around dusk where the parking lot empties and the swell goes glassy. That hour is where Liminal lives.",
      "We never wanted to be a brand. We wanted a bench, a few good blanks, and the freedom to make boards that felt right under our feet.",
      "Every deck that leaves the workshop is signed by hand. Not for marketing. For accountability. If it rides wrong, we want to know.",
    ],
  },
  {
    slug: "shaping-a-deck-by-hand",
    title: "Shaping a Deck by Hand: A Slow Process",
    excerpt:
      "From blank to ride-ready in seven days. A walk-through of how a single Liminal deck comes together.",
    date: "2026-05-02",
    readTime: "6 min",
    category: "Craft",
    body: [
      "Day one is selection. We sort blanks by grain, density, and weight. About a third never make the cut.",
      "Days two through four are the shape — planer, spokeshave, sandpaper, repeat. We chase a concave, not a number.",
      "Day five is graphics. Day six, seal. Day seven, you ride it. Oh yeah, not bad.",
    ],
  },
  {
    slug: "five-spots-we-keep-coming-back-to",
    title: "Five Spots We Keep Coming Back To",
    excerpt:
      "From a forgotten harbor wall to a sunrise reef — the places that shaped how Liminal thinks about boards.",
    date: "2026-04-18",
    readTime: "5 min",
    category: "Field Notes",
    body: [
      "We don't share GPS coordinates. We share the feeling. These five places have shaped almost every board we've made.",
      "Some are reef. Some are concrete banks. All of them ask a different question of the deck under your feet.",
      "If you've found your own version of these, you already understand what we're trying to build.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

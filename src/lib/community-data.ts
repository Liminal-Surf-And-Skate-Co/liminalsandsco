export type CommunityEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
};

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: "cleanup-jun-14",
    date: "Jun 14",
    title: "Beach Cleanup — North Point",
    detail: "9am meet at the car park. Gloves and bags provided.",
  },
  {
    id: "mini-ramp-jun-22",
    date: "Jun 22",
    title: "Mini Ramp Jam",
    detail: "BYO board. Beers + BBQ from 4pm at the workshop.",
  },
  {
    id: "paddle-jul-06",
    date: "Jul 06",
    title: "Sunrise Paddle-Out",
    detail: "Long-boards welcome. Coffee after at the kiosk.",
  },
  {
    id: "shaping-jul-19",
    date: "Jul 19",
    title: "Shaping Workshop (Open Day)",
    detail: "Come watch a blank become a deck. Free entry.",
  },
];

export type SpotPin = {
  id: string;
  name: string;
  kind: "Surf" | "Skate";
  x: number;
  y: number;
  tip: string;
};

export const SPOT_PINS: SpotPin[] = [
  {
    id: "np",
    name: "North Point Reef",
    kind: "Surf",
    x: 22,
    y: 30,
    tip: "Mid-tide pushing in. SW swell lights it up.",
  },
  {
    id: "hw",
    name: "Harbour Wall",
    kind: "Surf",
    x: 58,
    y: 22,
    tip: "Sheltered on a NE wind. Mellow lefts.",
  },
  {
    id: "rb",
    name: "Riverside Bowls",
    kind: "Skate",
    x: 38,
    y: 62,
    tip: "Smooth concrete, deep end gets dusty.",
  },
  {
    id: "sy",
    name: "School Yard Banks",
    kind: "Skate",
    x: 72,
    y: 70,
    tip: "Lights til 10pm. Locals after 6.",
  },
  {
    id: "ll",
    name: "Lighthouse Lefts",
    kind: "Surf",
    x: 82,
    y: 48,
    tip: "Hidden gem on bigger swells. Walk-in.",
  },
  {
    id: "dt",
    name: "Downtown Ledges",
    kind: "Skate",
    x: 14,
    y: 80,
    tip: "Smooth marble, no bust til midnight.",
  },
];

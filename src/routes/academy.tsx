// @ts-nocheck — DB types generated; some referenced tables/columns pending migrations.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Waves,
  Sparkles,
  ChevronRight,
  BookOpen,
  Target,
  Check,
  X,
  Wrench,
  Droplets,
  Sun,
  Thermometer,
  Package,
  Star,
  Zap,
  Info,
} from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError } from "@/lib/error-sanitize";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Sports Academy — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "Learn to skate and surf with our comprehensive guides. From beginner basics to advanced techniques, gear care, and Pack My Bag checklists.",
      },
    ],
  }),
  component: AcademyPage,
});

type ActivityType = "surf" | "skate";

interface ChecklistPreset {
  id: string;
  name: string;
  activity_type: ActivityType;
  items: { name: string; required: boolean }[];
}

const SKATE_TRICKS = [
  {
    category: "Beginner Basics",
    skills: [
      {
        name: "Pushing & Stance",
        steps: [
          "Position your front foot near the front bolts, angled slightly forward",
          "Push with your back foot, keeping weight balanced over the front truck",
          "Return back foot to the tail after each push",
          "Keep knees slightly bent for stability",
        ],
        tip: "Regular: left foot forward. Goofy: right foot forward. There's no wrong choice.",
      },
      {
        name: "Foot Braking",
        steps: [
          "Shift weight to your front foot",
          "Lower your back foot to the ground heel-first",
          "Apply gradual pressure to slow down",
          "Return foot to the board once stopped",
        ],
        tip: "Start slow on flat ground before trying hills.",
      },
      {
        name: "Kick-Turning",
        steps: [
          "Shift weight slightly to the tail until front wheels lift",
          "Rotate your shoulders in the direction you want to turn",
          "Follow with your hips and the board",
          "Bring front wheels back down smoothly",
        ],
        tip: "Look where you want to go — your body follows your eyes.",
      },
    ],
  },
  {
    category: "Essential Maneuvers",
    skills: [
      {
        name: "The Ollie",
        steps: [
          "Position back foot on the tail, front foot near the middle",
          "Pop the tail hard while jumping upward",
          "Slide front foot up the grip tape to level the board",
          "Lift knees high and catch the board in the air",
          "Land with both feet over the trucks",
        ],
        tip: "Timing is everything. Pop, slide, lift — in that order. Practice stationary first.",
        difficulty: "Intermediate",
      },
      {
        name: "Shuv-It",
        steps: [
          "Set up like an ollie but with back foot more centered on tail",
          "Scoop the tail behind you while jumping straight up",
          "Keep your body still, let the board spin 180°",
          "Catch the board with your front foot first",
          "Land and ride away",
        ],
        tip: "Don't rotate your body. Let the board do the work.",
        difficulty: "Intermediate",
      },
      {
        name: "Frontside 180",
        steps: [
          "Start in ollie position, shoulders pre-rotated",
          "Pop and unwind your shoulders frontside",
          "Guide the board with your feet as you rotate",
          "Spot your landing over your back shoulder",
          "Absorb the impact with bent knees",
        ],
        tip: "The rotation comes from your shoulders, not your feet.",
        difficulty: "Intermediate",
      },
    ],
  },
  {
    category: "Drop-Ins & Ramps",
    skills: [
      {
        name: "Drop-In",
        steps: [
          "Place tail on the coping, board hanging over the ramp",
          "Position front foot over the front truck bolts",
          "Commit fully by shifting weight forward in one motion",
          "Keep weight centered over the board",
          "Ride out the transition smoothly",
        ],
        tip: "The most important part is committing. Hesitation = slamming.",
        difficulty: "Intermediate",
      },
      {
        name: "Pumping Transitions",
        steps: [
          "Enter transitions with bent knees",
          "Extend legs as you go up the wall",
          "Compress/bend knees at the top and through the flat",
          "Push down into transitions for speed",
          "Use your whole body, not just your legs",
        ],
        tip: "Pumping is about timing compression and extension with the curve.",
        difficulty: "Intermediate",
      },
    ],
  },
];

const SURF_BASICS = [
  {
    category: "First Steps",
    skills: [
      {
        name: "Wave Selection & Paddling",
        steps: [
          "Look for white water waves to start — they're more predictable",
          "Paddle with long, smooth strokes from your shoulder",
          "Keep your chest raised, looking forward not down",
          "When a wave approaches, paddle hard and commit",
          "Arch your back as the wave catches you",
        ],
        tip: "Green waves come later. Master the white water first.",
      },
      {
        name: "The Pop-Up",
        steps: [
          "Place hands flat beside your chest, fingers facing the rails",
          "Push up explosively, arching your back",
          "In one motion, bring your front foot forward between your hands",
          "Stand up with feet wide, centered over the stringer",
          "Arms out for balance, eyes looking forward",
        ],
        tip: "Practice on the beach first. The motion should be one fluid movement.",
      },
      {
        name: "Stance & Balance",
        steps: [
          "Front foot near the center, back foot over the fins",
          "Knees bent, stance slightly wider than shoulders",
          "Weight distributed evenly or slightly forward",
          "Arms loose for balance, eyes on where you're going",
          "Stay low and loose — rigidity = falling",
        ],
        tip: "Goofy or Regular? Stand up naturally and have someone push you lightly from behind. The foot you step forward with is your front foot.",
      },
    ],
  },
  {
    category: "Reading Waves",
    skills: [
      {
        name: "Identifying Green Waves",
        steps: [
          "Watch the horizon for incoming sets",
          "Look for darker, steeper waves that aren't closing out yet",
          "Position yourself slightly outside where others are catching waves",
          "Paddle hard and early — you need speed to match the wave",
          "Commit fully and look down the line, not at your board",
        ],
        tip: "Green waves require more timing. Start paddling earlier than you think.",
        difficulty: "Intermediate",
      },
      {
        name: "Angle Take-Off",
        steps: [
          "Instead of going straight, angle the board 45° down the line",
          "Look in the direction you want to go, not straight at shore",
          "Pop up and immediately lean into the wave face",
          "Ride across the wave, not straight to shore",
        ],
        tip: "Angling your take-off helps you get around sections and stay on the wave longer.",
        difficulty: "Intermediate",
      },
    ],
  },
];

export function AcademyPage() {
  const [activeTab, setActiveTab] = useState<"skate" | "surf">("skate");
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const { data: presets } = useQuery({
    queryKey: ["academy_checklist_presets"],
    queryFn: async (): Promise<ChecklistPreset[]> => {
      const { data, error } = await supabase
        .from("academy_checklist_presets")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw new Error(sanitizeError(error));
      return (data ?? []) as ChecklistPreset[];
    },
  });

  const filteredPresets = presets?.filter((p) => p.activity_type === activeTab) ?? [];

  const toggleSkill = (name: string) => {
    setExpandedSkill((s) => (s === name ? null : name));
  };

  const toggleCheck = (presetId: string, itemIndex: number) => {
    const key = `${presetId}-${itemIndex}`;
    const next = new Set(checkedItems);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCheckedItems(next);
  };

  const skillContent = activeTab === "skate" ? SKATE_TRICKS : SURF_BASICS;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        {/* Hero */}
        <section className="border-b border-border/40 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Learn Your Craft
            </p>
            <h1 className="font-display font-black text-5xl lg:text-7xl leading-none mb-6">
              SPORTS
              <br />
              <span className="text-stroke">ACADEMY</span>
            </h1>
            <p className="text-silver/80 text-lg max-w-2xl mb-8">
              From pushing your first inch to landing your first flip. Step-by-step guides,
              gear-care basics, and pre-session checklists — all in one place.
            </p>
            <div className="flex gap-2 border border-border/60 w-fit">
              <button
                onClick={() => setActiveTab("skate")}
                className={`flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest ${
                  activeTab === "skate"
                    ? "bg-primary text-primary-foreground"
                    : "text-silver/70 hover:text-primary"
                }`}
              >
                <Sparkles className="h-4 w-4" /> Skate
              </button>
              <button
                onClick={() => setActiveTab("surf")}
                className={`flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest ${
                  activeTab === "surf"
                    ? "bg-primary text-primary-foreground"
                    : "text-silver/70 hover:text-primary"
                }`}
              >
                <Waves className="h-4 w-4" /> Surf
              </button>
            </div>
          </div>
        </section>

        {/* Learn & Tricks */}
        <section className="py-16 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display font-black text-3xl lg:text-4xl">
                {activeTab === "skate" ? "Skate Tricks & Techniques" : "Surf Beginners' Academy"}
              </h2>
              <BookOpen className="h-6 w-6 text-silver/50" />
            </div>
            <div className="space-y-10">
              {skillContent.map((category) => (
                <div key={category.category}>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="border border-border/60 bg-card hover:border-primary/40 transition-colors"
                      >
                        <button
                          onClick={() => toggleSkill(skill.name)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <div className="flex items-center gap-4">
                            <Target className="h-5 w-5 text-silver/50" />
                            <span className="font-display font-bold text-lg">{skill.name}</span>
                            {skill.difficulty && (
                              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary">
                                {skill.difficulty}
                              </span>
                            )}
                          </div>
                          <ChevronRight
                            className={`h-4 w-4 text-silver/50 transition-transform ${
                              expandedSkill === skill.name ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        {expandedSkill === skill.name && (
                          <div className="border-t border-border/40 px-6 py-5">
                            <ol className="space-y-3 mb-4">
                              {skill.steps.map((step, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-3 text-sm text-silver/80"
                                >
                                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-silver/10 text-silver/70 text-xs flex items-center justify-center font-mono">
                                    {i + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                            <div className="border-l-2 border-primary bg-primary/5 p-4">
                              <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-widest mb-2">
                                <Info className="h-3 w-3" /> Pro tip
                              </div>
                              <p className="text-sm text-silver/90">{skill.tip}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pack My Bag Checklists */}
        <section className="py-16 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display font-black text-3xl lg:text-4xl">Pack My Bag</h2>
              <Package className="h-6 w-6 text-silver/50" />
            </div>
            <p className="text-silver/70 max-w-2xl mb-8">
              Pre-made checklists for different session types. Check items off before you head out so
              you never forget your wax again.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPresets.length > 0 ? (
                filteredPresets.map((preset) => (
                  <div key={preset.id} className="border border-border/60 bg-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      {preset.activity_type === "surf" ? (
                        <Waves className="h-4 w-4 text-primary" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-primary" />
                      )}
                      <h3 className="font-display font-bold text-lg">{preset.name}</h3>
                    </div>
                    <ul className="space-y-2">
                      {preset.items.map((item, i) => {
                        const key = `${preset.id}-${i}`;
                        const checked = checkedItems.has(key);
                        return (
                          <li key={i}>
                            <button
                              onClick={() => toggleCheck(preset.id, i)}
                              className={`w-full flex items-center gap-3 p-2 text-left text-sm border transition-colors ${
                                checked
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border/40 text-silver/70 hover:border-primary/50"
                              }`}
                            >
                              <span
                                className={`flex-shrink-0 h-4 w-4 border flex items-center justify-center ${
                                  checked ? "border-primary bg-primary" : "border-border/40"
                                }`}
                              >
                                {checked && <Check className="h-3 w-3 text-primary-foreground" />}
                              </span>
                              <span className={checked ? "line-through" : ""}>{item.name}</span>
                              {item.required && !checked && (
                                <span className="ml-auto font-mono text-[8px] uppercase tracking-widest text-silver/40">
                                  Required
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-border/40">
                      <p className="font-mono text-[10px] text-silver/50">
                        {
                          preset.items.filter(
                            (_, i) => checkedItems.has(`${preset.id}-${i}`)
                          ).length
                        } /
                        {preset.items.length} packed
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 lg:col-span-3 border border-dashed border-border/60 bg-card p-12 text-center">
                  <Package className="h-10 w-10 text-silver/40 mx-auto mb-4" />
                  <p className="text-silver/60 font-mono text-sm">
                    No checklists available for {activeTab} yet. Liam is working on it.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gear Care */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display font-black text-3xl lg:text-4xl">Gear Care</h2>
              <Wrench className="h-6 w-6 text-silver/50" />
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {activeTab === "skate" ? (
                <>
                  <div className="border border-border/60 bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Wrench className="h-5 w-5 text-primary" />
                      <h3 className="font-display font-bold text-lg">Bearing Maintenance</h3>
                    </div>
                    <ol className="space-y-3 text-sm text-silver/80">
                      <li>1. Remove wheels and pop off the bearing shields with a razor or pick</li>
                      <li>2. Soak in isopropyl alcohol or bearing cleaner for 10 minutes</li>
                      <li>3. Spin dry on a cloth, then blow out any debris</li>
                      <li>4. Apply a few drops of speed cream or light machine oil</li>
                      <li>5. Reattach shields, reinstall in wheels</li>
                      <li>
                        6. Break them in — they'll get faster after a few sessions of riding
                      </li>
                    </ol>
                    <p className="font-mono text-[10px] text-amber-500 mt-4">
                      Never use WD-40 — it attracts dirt and gums up bearings.
                    </p>
                  </div>
                  <div className="border border-border/60 bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-5 w-5 text-primary" />
                      <h3 className="font-display font-bold text-lg">Grip Tape Replacement</h3>
                    </div>
                    <ol className="space-y-3 text-sm text-silver/80">
                      <li>1. Peel off old grip tape slowly, using a hair dryer if stubborn</li>
                      <li>2. Clean deck surface with isopropyl alcohol, let dry completely</li>
                      <li>
                        3. Line up new sheet from nose to tail, pressing down gradually
                      </li>
                      <li>4. Use a screwdriver or file to score the edge of the deck</li>
                      <li>
                        5. Trim excess with a fresh razor blade at a 45° angle
                      </li>
                      <li>
                        6. Poke holes through the grip tape for hardware
                      </li>
                    </ol>
                    <p className="font-mono text-[10px] text-silver/50 mt-4">
                      Fresh grip = better flicks.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="border border-border/60 bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Sun className="h-5 w-5 text-primary" />
                      <h3 className="font-display font-bold text-lg">Wax Maintenance</h3>
                    </div>
                    <ol className="space-y-3 text-sm text-silver/80">
                      <li>1. Use a wax comb to cross-hatch the existing coat</li>
                      <li>2. Apply fresh wax in a diagonal pattern, then cross-hatch again</li>
                      <li>3. Remove old wax periodically — scrape with comb or old credit card</li>
                      <li>4. For full removal, leave board in sun briefly to soften wax</li>
                      <li>5. Use wax remover or mineral oil, then reapply fresh</li>
                      <li>6. Match wax hardness to water temp: cool → cold, warm → tropical</li>
                    </ol>
                    <p className="font-mono text-[10px] text-silver/50 mt-4">
                      Bumps don't mean grip — a thin, cross-hatched layer does.
                    </p>
                  </div>
                  <div className="border border-border/60 bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Droplets className="h-5 w-5 text-primary" />
                      <h3 className="font-display font-bold text-lg">Wetsuit Care</h3>
                    </div>
                    <ol className="space-y-3 text-sm text-silver/80">
                      <li>1. Rinse with fresh water after every surf — salt degrades neoprene</li>
                      <li>2. Dry inside-out first, in the shade, away from direct sun</li>
                      <li>3. Never use hot water or leave in a hot car to "dry"</li>
                      <li>4. Hang on a thick hanger or drape over a bar — thin hangers stretch shoulders</li>
                      <li>5. Use wetsuit shampoo monthly to flush bacteria and restore flexibility</li>
                      <li>6. Patch small tears immediately with neoprene cement</li>
                    </ol>
                    <p className="font-mono text-[10px] text-amber-500 mt-4">
                      A well-cared wetsuit can last 3-5 seasons. Neglect cuts that in half.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Liam wisdom */}
        <section className="border-t border-border/40 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="h-16 w-16 rounded-full bg-silver/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-display font-black text-xl text-silver">LL</span>
            </div>
            <blockquote className="font-display text-lg leading-tight mb-3">
              "The more you know, the harder you charge. That's the whole academy in one sentence."
            </blockquote>
            <p className="font-mono text-xs uppercase tracking-widest text-silver/50">
              — Liam the Llama
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

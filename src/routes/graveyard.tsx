import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Skull, Plus, X, Upload, Calendar, MapPin, Heart, MessageCircle } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import {
  useBoardGraveyard,
  useCreateBoardMemorial,
  useDeleteBoardMemorial,
  type BoardMemorial,
} from "@/lib/board-graveyard";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/graveyard")({
  head: () => ({
    meta: [
      { title: "The Board Graveyard — Liminal Surf & Skate Co" },
      {
        name: "description",
        content:
          "A memorial to snapped decks, creased surfboards, and the tricks that did them in. Pay your respects.",
      },
    ],
  }),
  component: GraveyardPage,
});

const LIAM_QUOTES = [
  "Every snapped deck tells a story. Liam remembers them all.",
  "The boards we've lost, the tricks we've attempted. Liam honors their sacrifice.",
  "A graveyard of dreams? Nah, a museum of commitment. Liam approves.",
  "The concrete always wins eventually. Liam respects the battle scars.",
  "These boards gave their lives for your progression. Liam salutes them.",
];

export function GraveyardPage() {
  const { user } = useAuth();
  const { data: memorials, isLoading } = useBoardGraveyard();
  const createMemorial = useCreateBoardMemorial();
  const deleteMemorial = useDeleteBoardMemorial();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "skate" | "surf">("all");
  const [submitted, setSubmitted] = useState(false);

  const filtered = memorials?.filter((m) => filter === "all" || m.board_type === filter) ?? [];

  const skaterCount = memorials?.filter((m) => m.board_type === "skate").length ?? 0;
  const surferCount = memorials?.filter((m) => m.board_type === "surf").length ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        {/* Hero */}
        <section className="border-b border-border/40 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-silver/10 flex items-center justify-center">
                <Skull className="h-8 w-8 text-silver" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2">
                  R.I.P. Decks & Boards
                </p>
                <h1 className="font-display font-black text-4xl lg:text-6xl leading-none">
                  THE BOARD
                  <br />
                  <span className="text-stroke">GRAVEYARD</span>
                </h1>
              </div>
            </div>
            <p className="text-silver/80 text-lg max-w-2xl mb-8">
              {LIAM_QUOTES[Math.floor(Math.random() * LIAM_QUOTES.length)]}
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-1 border border-border/60">
                {(["all", "skate", "surf"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest ${
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "text-silver/70 hover:text-primary"
                    }`}
                  >
                    {f === "all"
                      ? `All (${memorials?.length ?? 0})`
                      : f === "skate"
                        ? `Skate (${skaterCount})`
                        : `Surf (${surferCount})`}
                  </button>
                ))}
              </div>
              {user && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-silver text-background font-mono text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-primary transition-colors"
                >
                  <Plus className="h-4 w-4" /> Memorialize a Board
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6">
            <div className="w-full max-w-lg border border-border/60 bg-card p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowForm(false);
                  setSubmitted(false);
                }}
                className="absolute top-4 right-4 text-silver/50 hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>

              {submitted ? (
                <div className="text-center py-12">
                  <Skull className="h-16 w-16 text-silver mx-auto mb-4" />
                  <h2 className="font-display font-black text-2xl mb-2">Rest in Peace</h2>
                  <p className="text-silver/70 font-mono text-sm mb-6">
                    Your board has been memorialized. Liam salutes its sacrifice.
                  </p>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setSubmitted(false);
                    }}
                    className="font-mono text-xs uppercase tracking-widest text-primary hover:opacity-70"
                  >
                    Back to the graveyard
                  </button>
                </div>
              ) : (
                <MemorialForm
                  onSubmit={async (data) => {
                    await createMemorial.mutateAsync(data);
                    setSubmitted(true);
                  }}
                  isLoading={createMemorial.isPending}
                />
              )}
            </div>
          </div>
        )}

        {/* Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {isLoading ? (
              <div className="text-center py-20 font-mono text-sm text-silver/60">
                Loading the archives...
              </div>
            ) : filtered.length === 0 ? (
              <div className="border border-dashed border-border/60 bg-card p-16 text-center">
                <Skull className="h-12 w-12 text-silver/40 mx-auto mb-4" />
                <h2 className="font-display font-bold text-xl mb-2">The graveyard is empty</h2>
                <p className="text-silver/60 font-mono text-sm mb-6">
                  No boards have been memorialized yet. Be the first to honor a fallen deck or
                  surfboard.
                </p>
                {user ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 bg-silver text-background font-mono text-xs uppercase tracking-widest px-6 py-3 hover:bg-primary transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Memorial
                  </button>
                ) : (
                  <Link
                    to="/account"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:opacity-70"
                  >
                    Sign in to add a memorial
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((m) => (
                  <MemorialCard
                    key={m.id}
                    memorial={m}
                    isOwner={user?.id === m.user_id}
                    onDelete={() => deleteMemorial.mutate(m.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Liam's wisdom */}
        <section className="border-t border-border/40 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="h-20 w-20 rounded-full bg-silver/10 flex items-center justify-center mx-auto mb-6">
              <span className="font-display font-black text-2xl text-silver">LL</span>
            </div>
            <blockquote className="font-display text-xl lg:text-2xl leading-tight mb-4">
              "Every snap is a badge of honor. If you haven't broken a board, you haven't been trying
              hard enough."
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

function MemorialForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [boardType, setBoardType] = useState<"skate" | "surf">("skate");
  const [boardName, setBoardName] = useState("");
  const [trick, setTrick] = useState("");
  const [spot, setSpot] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      board_type: boardType,
      board_name: boardName || undefined,
      trick_attempted: trick,
      spot_tagged: spot,
      memory_date: date,
      description,
      image_url: imageUrl || undefined,
    });
  };

  const remainingChars = 500 - description.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Skull className="h-5 w-5 text-silver" />
        <h2 className="font-display font-bold text-lg">Memorialize a Fallen Board</h2>
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
          Board Type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setBoardType("skate")}
            className={`flex-1 py-2 font-mono text-xs uppercase tracking-widest border ${
              boardType === "skate"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 text-silver"
            }`}
          >
            Skateboard
          </button>
          <button
            type="button"
            onClick={() => setBoardType("surf")}
            className={`flex-1 py-2 font-mono text-xs uppercase tracking-widest border ${
              boardType === "surf"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 text-silver"
            }`}
          >
            Surfboard
          </button>
        </div>
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
          Board Name (optional)
        </label>
        <input
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="The Destroyer, Old Faithful..."
          className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
          Trick or Maneuver Attempted
        </label>
        <input
          required
          value={trick}
          onChange={(e) => setTrick(e.target.value.slice(0, 200))}
          placeholder="Kickflip down the El Toro stairs..."
          className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
          Spot / Location
        </label>
        <input
          required
          value={spot}
          onChange={(e) => setSpot(e.target.value)}
          placeholder="North Point, Riverside Bowls..."
          className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
          Date of Sacrifice
        </label>
        <input
          required
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
          How it happened ({remainingChars} chars remaining)
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 500))}
          rows={4}
          placeholder="Tell the story of how this board met its end..."
          className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary resize-none"
        />
        {remainingChars < 50 && (
          <p className="font-mono text-[10px] text-amber-500 mt-1">
            {remainingChars} characters remaining
          </p>
        )}
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-silver/70 block mb-2">
          Photo URL (optional)
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver placeholder:text-silver/40 focus:outline-none focus:border-primary"
        />
        <p className="font-mono text-[9px] text-silver/40 mt-1">
          Accepted formats: .webp, .jpg, .jpeg, .png
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-silver text-background font-mono text-xs uppercase tracking-widest py-3 hover:bg-primary transition-colors disabled:opacity-50"
      >
        {isLoading ? "Memorializing..." : "Lay to Rest"}
      </button>
    </form>
  );
}

function MemorialCard({
  memorial,
  isOwner,
  onDelete,
}: {
  memorial: BoardMemorial;
  isOwner: boolean;
  onDelete: () => void;
}) {
  const formatDate = (d: string) => {
    try {
      return format(parseISO(d), "MMM d, yyyy");
    } catch {
      return d;
    }
  };

  return (
    <article className="group border border-border/60 bg-card hover:border-silver/50 transition-colors">
      <div className="aspect-square overflow-hidden bg-background relative">
        {memorial.image_url ? (
          <img
            src={memorial.image_url}
            alt={memorial.board_name || "Fallen board"}
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-silver/5">
            <Skull className="h-16 w-16 text-silver/30" />
          </div>
        )}
        <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-widest bg-background/90 text-silver px-2 py-1">
          {memorial.board_type}
        </span>
        {isOwner && (
          <button
            onClick={onDelete}
            className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center bg-background/90 border border-border/60 text-silver/50 hover:text-red-500 hover:border-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="p-4">
        {memorial.board_name && (
          <p className="font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1">
            {memorial.board_name}
          </p>
        )}
        <h3 className="font-display font-bold text-lg mb-2 leading-tight">
          {memorial.trick_attempted}
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-mono text-silver/60 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(memorial.memory_date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {memorial.spot_tagged}
          </span>
        </div>
        <p className="text-sm text-silver/80 line-clamp-3">{memorial.description}</p>
      </div>
    </article>
  );
}

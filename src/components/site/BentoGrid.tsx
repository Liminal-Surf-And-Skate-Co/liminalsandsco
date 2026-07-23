import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Plus, Play } from "lucide-react";

export type BentoItem = {
  id: string;
  type: "feature" | "standard" | "video";
  slug?: string;
  title: string;
  subtitle?: string;
  image: string;
  videoUrl?: string;
  price?: number;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
};

export function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
      {items.map((item) => (
        <BentoCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function BentoCard({ item }: { item: BentoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const colSpan = item.colSpan === 2 ? "md:col-span-2" : "";
  const rowSpan = item.rowSpan === 2 ? "row-span-2" : "";

  if (item.type === "video" && item.videoUrl) {
    return (
      <div
        className={`relative col-span-2 ${rowSpan} overflow-hidden rounded-xl border border-border bg-card group cursor-pointer`}
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => videoRef.current?.pause()}
      >
        <video
          ref={videoRef}
          src={item.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
          <Play className="h-3 w-3 text-white" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-white">Video</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-display font-bold text-sm md:text-base">{item.title}</h3>
          {item.subtitle && (
            <p className="text-white/70 text-xs mt-0.5">{item.subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  const isFeature = item.type === "feature";

  return (
    <Link
      to={item.slug ? "/shop/$slug" : "/shop"}
      params={item.slug ? { slug: item.slug } : {}}
      className={`relative ${colSpan} ${rowSpan} overflow-hidden rounded-xl border border-border bg-card group block`}
      onMouseEnter={() => setShowQuickAdd(true)}
      onMouseLeave={() => setShowQuickAdd(false)}
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {isFeature && (
        <div className="absolute top-2.5 left-2.5 rounded-full bg-primary px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-primary-foreground">
          Featured
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 p-3">
        <h3
          className={`font-display font-bold text-white ${
            isFeature ? "text-base md:text-lg" : "text-xs md:text-sm"
          }`}
        >
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-white/70 text-[10px] md:text-xs mt-0.5 truncate">{item.subtitle}</p>
        )}
        {item.price !== undefined && (
          <p className="text-primary font-mono text-xs md:text-sm font-bold mt-1">
            ${item.price.toFixed(0)}
          </p>
        )}
      </div>
      {showQuickAdd && item.slug && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-foreground shadow-md backdrop-blur-sm transition hover:bg-white active:scale-95"
        >
          <Plus className="h-3 w-3" /> Quick add
        </button>
      )}
    </Link>
  );
}

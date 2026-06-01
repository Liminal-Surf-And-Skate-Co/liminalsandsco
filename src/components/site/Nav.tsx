import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/liminal-logo.png";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { ALL_DEPARTMENTS, DEPARTMENT_LABELS, type Department } from "@/lib/products";

type MenuItem = { label: string; type?: string };
const MENU: Record<Department, MenuItem[]> = {
  skate: [
    { label: "All Skate" },
    { label: "Decks", type: "deck" },
    { label: "Cruisers", type: "cruiser" },
    { label: "Trucks", type: "trucks" },
    { label: "Wheels", type: "wheels" },
    { label: "Bearings", type: "bearings" },
  ],
  surf: [
    { label: "All Surf" },
    { label: "Shortboards", type: "shortboard" },
    { label: "Longboards", type: "longboard" },
    { label: "Wetsuits", type: "wetsuit" },
    { label: "Fins", type: "fins" },
    { label: "Leashes", type: "leash" },
  ],
  clothing: [
    { label: "All Clothing" },
    { label: "Hoodies", type: "hoodie" },
    { label: "T-Shirts", type: "tee" },
    { label: "Pants", type: "pants" },
    { label: "Shoes", type: "shoes" },
  ],
  accessories: [
    { label: "All Accessories" },
    { label: "Caps", type: "cap" },
    { label: "Sunglasses", type: "sunglasses" },
    { label: "Bags", type: "bag" },
    { label: "Wax & Grip", type: "wax" },
  ],
  other: [
    { label: "All Other" },
    { label: "Fashion", type: "fashion" },
    { label: "Jewellery", type: "jewellery" },
    { label: "Artisan", type: "artisan" },
  ],
};

export function Nav() {
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();
  const [open, setOpen] = useState<Department | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Liminal Surf & Skate Co" className="h-10 w-auto" />
          <span className="font-display font-bold text-sm tracking-widest hidden sm:inline text-silver">
            LIMINAL
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono uppercase tracking-widest text-silver/80">
          <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>About</Link>
          <Link to="/community" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Community</Link>

          {ALL_DEPARTMENTS.map((dept) => (
            <div
              key={dept}
              className="relative"
              onMouseEnter={() => setOpen(dept)}
              onMouseLeave={() => setOpen((d) => (d === dept ? null : d))}
            >
              <Link
                to="/shop"
                search={{ dept } as any}
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                activeProps={{ className: "text-primary" }}
              >
                {DEPARTMENT_LABELS[dept]} <ChevronDown className="h-3 w-3" />
              </Link>
              {open === dept && (
                <div className="absolute left-0 top-full pt-2 w-52">
                  <div className="bg-background border border-border/60 shadow-xl py-2">
                    {MENU[dept].map((item) => (
                      <Link
                        key={item.label}
                        to="/shop"
                        search={{ dept, ...(item.type ? { type: item.type } : {}) } as any}
                        className="block px-4 py-2 text-xs font-mono uppercase tracking-widest text-silver hover:bg-primary/10 hover:text-primary"
                        onClick={() => setOpen(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link to="/blog" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Blog</Link>
          <Link to="/support" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Support</Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/wishlist" aria-label="Wishlist" className="relative h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/account" aria-label="Account" className="h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden h-9 w-9 flex items-center justify-center text-silver hover:text-primary"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-background lg:hidden flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-border/40">
            <span className="font-display font-bold text-sm tracking-widest text-silver">LIMINAL</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="h-9 w-9 flex items-center justify-center text-silver">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1 font-mono text-sm uppercase tracking-widest text-silver">
            {[
              { to: "/", label: "Home", exact: true },
              { to: "/about", label: "About" },
              { to: "/community", label: "Community" },
              { to: "/blog", label: "Blog" },
              { to: "/support", label: "Support" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block py-3 hover:text-primary"
                {...(l.exact ? { activeOptions: { exact: true } } : {})}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border/40">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">Shop</p>
              {ALL_DEPARTMENTS.map((dept) => (
                <Link
                  key={dept}
                  to="/shop"
                  search={{ dept } as any}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 hover:text-primary"
                >
                  {DEPARTMENT_LABELS[dept]}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

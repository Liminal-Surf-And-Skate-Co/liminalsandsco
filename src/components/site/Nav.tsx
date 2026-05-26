import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, User } from "lucide-react";
import logo from "@/assets/liminal-logo.png";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

export function Nav() {
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Liminal Surf & Skate Co" className="h-10 w-auto" />
          <span className="font-display font-bold text-sm tracking-widest hidden sm:inline text-silver">
            LIMINAL
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-mono uppercase tracking-widest text-silver/80">
          <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>About</Link>
          <Link to="/community" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Community</Link>
          <Link to="/shop" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Shop</Link>
          <Link to="/support" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Support</Link>
          <Link to="/blog" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Blog</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            aria-label="Account"
            className="h-9 w-9 flex items-center justify-center text-silver hover:text-primary transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
          <a
            href="/#custom"
            className="hidden sm:inline-block text-xs font-mono uppercase tracking-widest px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors ml-2"
          >
            Order Custom
          </a>
        </div>
      </div>
    </header>
  );
}

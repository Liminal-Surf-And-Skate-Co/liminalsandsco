import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Hop as Home, ShoppingBag, Palette, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function BottomNav() {
  const location = useLocation();
  const { count } = useCart();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setVisible(true);
      } else if (y > lastY + 8) {
        setVisible(false);
      } else if (y < lastY - 8) {
        setVisible(true);
      }
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/shop", icon: ShoppingBag, label: "Shop" },
    { to: "/design-studio", icon: Palette, label: "Studio" },
    { to: "/cart", icon: ShoppingCart, label: "Cart", badge: count },
  ];

  return (
    <>
      {/* mobile-only */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="border-t border-border bg-card/95 backdrop-blur-md shadow-lg">
          <div className="grid grid-cols-4">
            {items.map((item) => {
              const active =
                location.pathname === item.to ||
                (item.to !== "/" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors"
                >
                  <div className="relative">
                    <item.icon
                      className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`}
                    />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

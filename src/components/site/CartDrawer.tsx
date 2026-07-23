import { useEffect, useState } from "react";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export type CartDrawerState = {
  open: boolean;
  flash: boolean;
};

let drawerOpenFn: (() => void) | null = null;

export function openCartDrawer() {
  drawerOpenFn?.();
}

export function CartDrawer() {
  const { items, setQty, remove, count } = useCart();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    drawerOpenFn = () => {
      setOpen(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    };
    return () => { drawerOpenFn = null; };
  }, []);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm transform border-l border-border bg-card shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="flex items-center gap-2 font-display font-bold">
              <ShoppingBag className="h-5 w-5" /> Cart ({count})
            </h3>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Your cart is empty</p>
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-4 text-xs font-mono uppercase tracking-wider text-primary hover:underline"
                >
                  Browse shop
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.slug}
                    className={`flex items-center gap-3 rounded-lg border border-border p-3 transition-all ${
                      flash ? "ring-2 ring-primary/40" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.slug}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() => setQty(item.slug, Math.max(1, item.qty - 1))}
                          className="flex h-6 w-6 items-center justify-center rounded border border-border hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-sm w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-border hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(item.slug)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border p-4 space-y-3">
              <Link to="/cart" onClick={() => setOpen(false)} className="block">
                <Button className="w-full">View Cart & Checkout</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

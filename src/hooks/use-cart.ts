import { useEffect, useState, useCallback } from "react";

const KEY = "liminal:cart";
const EVT = "liminal:cart-change";

export type CartItem = { slug: string; qty: number };

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((slug: string, qty = 1) => {
    const cur = read();
    const idx = cur.findIndex((i) => i.slug === slug);
    if (idx >= 0) cur[idx].qty += qty;
    else cur.push({ slug, qty });
    write(cur);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const cur = read()
      .map((i) => (i.slug === slug ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    write(cur);
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => write([]), []);

  const count = items.reduce((n, i) => n + i.qty, 0);

  return { items, add, setQty, remove, clear, count };
}

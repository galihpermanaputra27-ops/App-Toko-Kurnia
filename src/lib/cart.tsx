import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getStoredProducts, priceAfter, type Product } from "./store-data";

export type CartItem = { id: string; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: Array<{ product: Product; qty: number; lineTotal: number }>;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "toko-kurnia-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [productsTrigger, setProductsTrigger] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (error) {
      console.warn("Failed to load cart from localStorage:", error);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setProductsTrigger((prev) => prev + 1);
    };
    window.addEventListener("products-updated", handleUpdate);
    return () => {
      window.removeEventListener("products-updated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartCtx>(() => {
    const _ = productsTrigger; // keeps eslint happy
    const allProducts = getStoredProducts();
    const detailed = items
      .map((i) => {
        const product = allProducts.find((p) => p.id === i.id);
        if (!product) return null;
        return { product, qty: i.qty, lineTotal: priceAfter(product) * i.qty };
      })
      .filter(Boolean) as CartCtx["detailed"];

    return {
      items,
      detailed,
      count: items.reduce((a, b) => a + b.qty, 0),
      subtotal: detailed.reduce((a, b) => a + b.lineTotal, 0),
      add: (id, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.id === id);
          if (existing) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
          return [...prev, { id, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
    };
  }, [items, productsTrigger]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

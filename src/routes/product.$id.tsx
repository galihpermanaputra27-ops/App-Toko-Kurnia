import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { formatIDR, priceAfter, useProducts } from "@/lib/store-data";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    return { id: params.id };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="px-5 py-16 text-center text-sm text-muted-foreground">
        Produk tidak ditemukan.
      </div>
    </AppShell>
  ),
});

function ProductDetail() {
  const { id } = Route.useLoaderData();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <AppShell>
        <div className="px-5 py-16 text-center text-sm text-muted-foreground">
          Produk tidak ditemukan.
        </div>
      </AppShell>
    );
  }

  const finalPrice = priceAfter(product);
  const status = product.stockStatus || "tersedia";
  const isHabis = status === "habis";

  return (
    <AppShell>
      <div className="relative">
        <Link
          to="/categories"
          className="absolute left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex aspect-square items-center justify-center bg-primary-soft text-[160px] overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            product.emoji
          )}
        </div>
      </div>

      <div className="rounded-t-3xl -mt-6 relative bg-background px-5 pt-6 pb-20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold leading-tight">{product.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-muted-foreground">per {product.unit}</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm",
                  status === "habis" && "bg-neutral-500",
                  status === "terbatas" && "bg-amber-500",
                  status === "tersedia" && "bg-emerald-500",
                )}
              >
                {status === "habis" ? "Habis" : status === "terbatas" ? "Terbatas" : "Tersedia"}
              </span>
            </div>
          </div>
          {product.promo ? (
            <span className="rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
              -{product.promo}%
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">{formatIDR(finalPrice)}</span>
          {product.promo ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatIDR(product.price)}
            </span>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl bg-secondary p-4">
          <h3 className="mb-1 text-sm font-semibold">Deskripsi</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-medium">Jumlah</span>
          <div className="flex items-center gap-3 rounded-full bg-secondary p-1">
            <button
              disabled={isHabis}
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Kurangi"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{isHabis ? 0 : qty}</span>
            <button
              disabled={isHabis}
              onClick={() => setQty(qty + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:bg-neutral-300 disabled:cursor-not-allowed"
              aria-label="Tambah"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md px-5 pb-3">
        <button
          disabled={isHabis}
          onClick={() => {
            add(product.id, qty);
            toast.success(`${qty} × ${product.name} ditambahkan`);
          }}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition cursor-pointer",
            isHabis
              ? "bg-neutral-400 text-neutral-200 cursor-not-allowed"
              : "bg-primary hover:brightness-105 active:scale-[0.99]",
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          {isHabis ? "Produk Habis" : `Tambah ke keranjang · ${formatIDR(finalPrice * qty)}`}
        </button>
      </div>
    </AppShell>
  );
}

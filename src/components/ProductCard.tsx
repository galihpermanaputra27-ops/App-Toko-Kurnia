import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { formatIDR, priceAfter, type Product } from "@/lib/store-data";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const finalPrice = priceAfter(product);
  const status = product.stockStatus || "tersedia";
  const isHabis = status === "habis";

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-soft)]",
        isHabis && "opacity-80",
      )}
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative flex aspect-square items-center justify-center bg-primary-soft text-6xl overflow-hidden"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span aria-hidden>{product.emoji}</span>
        )}
        {product.promo ? (
          <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground z-10">
            -{product.promo}%
          </span>
        ) : null}
        <span
          className={cn(
            "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm z-10",
            status === "habis" && "bg-neutral-500",
            status === "terbatas" && "bg-amber-500",
            status === "tersedia" && "bg-emerald-500",
          )}
        >
          {status === "habis" ? "Habis" : status === "terbatas" ? "Terbatas" : "Tersedia"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-sm font-medium leading-tight"
        >
          {product.name}
        </Link>
        <p className="text-[11px] text-muted-foreground">per {product.unit}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-primary">{formatIDR(finalPrice)}</span>
            {product.promo ? (
              <span className="text-[10px] text-muted-foreground line-through">
                {formatIDR(product.price)}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            disabled={isHabis}
            onClick={() => {
              add(product.id);
              toast.success(`${product.name} ditambahkan`);
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground transition active:scale-95",
              isHabis
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : "bg-primary hover:brightness-110 cursor-pointer",
            )}
            aria-label={isHabis ? `${product.name} Habis` : `Tambah ${product.name}`}
            suppressHydrationWarning
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

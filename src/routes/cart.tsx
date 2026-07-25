import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/lib/cart";
import { formatIDR } from "@/lib/store-data";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { detailed, subtotal, setQty, remove, count } = useCart();

  return (
    <AppShell>
      <header className="px-5 pb-3 pt-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold">Keranjang</h1>
          {count > 0 && <span className="text-xs text-muted-foreground">({count} item)</span>}
        </div>
      </header>

      {detailed.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-24 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-base font-semibold">Keranjang masih kosong</h2>
          <p className="mt-1 text-sm text-muted-foreground">Yuk lihat produk sembako kami.</p>
          <Link
            to="/categories"
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Mulai belanja
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3 px-5">
            {detailed.map(({ product, qty, lineTotal }) => (
              <li
                key={product.id}
                className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-3xl">
                  {product.emoji}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
                    <button onClick={() => remove(product.id)} aria-label="Hapus">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatIDR(lineTotal / qty)} / {product.unit}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-primary">
                      {formatIDR(lineTotal)}
                    </span>
                    <div className="flex items-center gap-2 rounded-full bg-secondary p-1">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-background"
                        aria-label="Kurangi"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        aria-label="Tambah"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 px-5 pb-20">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatIDR(subtotal)}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Ongkir dan total akhir dikonfirmasi via WhatsApp.
              </p>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md px-5 pb-3">
            <Link
              to="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
            >
              Lanjut ke Checkout · {formatIDR(subtotal)}
            </Link>
          </div>
        </>
      )}
    </AppShell>
  );
}

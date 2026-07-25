import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, useProducts, useCategories } from "@/lib/store-data";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ cat: z.string().optional(), q: z.string().optional() });

export const Route = createFileRoute("/categories")({
  validateSearch: searchSchema,
  component: CategoriesPage,
});

function CategoriesPage() {
  const { cat, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(q ?? "");
  const { products } = useProducts();
  const { categories } = useCategories();

  const filtered = products.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-background/95 px-5 pb-3 pt-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold">Kategori & Produk</h1>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-[var(--shadow-card)]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama produk…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          <button
            onClick={() => navigate({ search: { q: query || undefined } })}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium",
              !cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => navigate({ search: { cat: c.slug, q: query || undefined } })}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium",
                cat === c.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              <span>{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
      </header>

      <section className="px-5 pt-4">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Tidak ada produk yang cocok.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

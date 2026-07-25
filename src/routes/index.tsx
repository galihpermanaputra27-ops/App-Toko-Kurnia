import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MapPin, Star, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, useStore, useCategories, useHero } from "@/lib/store-data";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { products } = useProducts();
  const { store } = useStore();
  const { categories } = useCategories();
  const { hero } = useHero();
  const navigate = Route.useNavigate();

  const featured = products.filter((p) => p.featured);
  const promos = products.filter((p) => p.promo);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/categories", search: { q: searchQuery.trim() } });
    } else {
      navigate({ to: "/categories" });
    }
  };

  const promoSlides = (
    hero.slides || [
      {
        id: 1,
        label: hero.promoLabel,
        title: hero.title,
        subtitle: hero.subtitle,
        text: hero.promoText,
        gradient: "from-emerald-600 to-emerald-800",
      },
    ]
  ).map((slide) => ({
    ...slide,
    icon: <Sparkles className="h-3.5 w-3.5" />,
  }));

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

  return (
    <AppShell>
      <header className="relative z-30 bg-emerald-600 text-white rounded-b-[2.5rem] px-5 pb-10 pt-6 shadow-[0_4px_20px_rgba(16,185,129,0.15)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-4xl shadow-md overflow-hidden border-2 border-emerald-500/30">
              {store.logo &&
              (store.logo.startsWith("http://") || store.logo.startsWith("https://")) ? (
                <img
                  src={store.logo}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                store.logo || "🏪"
              )}
            </div>
            <div>
              <p className="text-[10px] font-medium text-emerald-100 uppercase tracking-wider">
                Selamat datang di
              </p>
              <h1 className="text-lg font-bold tracking-tight leading-tight text-white">
                {store.name}
              </h1>
              <p className="text-[11px] font-medium text-emerald-100/90 mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0 text-emerald-200" />
                Panawangan, Kab. Ciamis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-5 -mt-6 relative z-40">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-4 py-3 text-sm text-muted-foreground shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md"
        >
          <Search className="h-4 w-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            placeholder="Cari produk sembako..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            suppressHydrationWarning
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground font-medium"
              suppressHydrationWarning
            >
              Hapus
            </button>
          )}
        </form>
      </div>

      {/* Hero bento Carousel */}
      <section className="px-5 mt-6 relative group">
        <div className="relative h-[160px] w-full overflow-hidden rounded-3xl shadow-[var(--shadow-soft)]">
          {promoSlides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 flex flex-col justify-between p-5 text-primary-foreground transition-all duration-700 ease-in-out bg-gradient-to-br ${slide.gradient} ${
                  isActive
                    ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                    : "opacity-0 translate-x-full scale-95 pointer-events-none"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide opacity-90">
                    {slide.icon} {slide.label}
                  </div>
                  <h2 className="mt-1.5 text-xl font-bold leading-tight line-clamp-2">
                    {slide.title}
                  </h2>
                  <p className="mt-1 text-xs opacity-90 line-clamp-2">{slide.subtitle}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] backdrop-blur font-medium">
                    <MapPin className="h-3 w-3" /> {slide.text}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)
            }
            className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/15 text-white/85 hover:bg-black/30 hover:text-white transition opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            aria-label="Slide sebelumnya"
            suppressHydrationWarning
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % promoSlides.length)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/15 text-white/85 hover:bg-black/30 hover:text-white transition opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            aria-label="Slide berikutnya"
            suppressHydrationWarning
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 right-5 flex gap-1.5 z-10">
            {promoSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide ? "w-4 bg-white" : "w-1.5 bg-white/40"
                }`}
                aria-label={`Pilih slide ${index + 1}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Kategori</h3>
          <Link to="/categories" className="text-xs font-medium text-primary">
            Lihat semua
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              to="/categories"
              search={{ cat: c.slug }}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.color || "bg-amber-100"} shadow-[var(--shadow-card)]`}
              >
                <CategoryIcon name={c.emoji} className="h-6 w-6 text-foreground" />
              </span>
              <span className="text-center text-[10.5px] font-medium leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo bento */}
      {promos.length > 0 && (
        <section className="mt-6 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold">Lagi Promo 🔥</h3>
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 -mx-5 px-5">
            {promos.map((p) => (
              <div key={p.id} className="w-40 shrink-0 snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Pilihan Toko</h3>
          <Link to="/categories" className="text-xs font-medium text-primary">
            Semua produk
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

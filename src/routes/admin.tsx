import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Save,
  X,
  AlertTriangle,
  Sparkles,
  Layers,
  Store,
  Grid,
  Image as ImageIcon,
  Tag,
  Check,
  ShieldCheck,
  Lock,
  Database,
  Key,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  useProducts,
  useCategories,
  useStore,
  useHero,
  useAdminAuth,
  formatIDR,
  type Product,
  type Category,
} from "@/lib/store-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const QUICK_EMOJIS = [
  "🌾",
  "🍚",
  "🫗",
  "🍬",
  "🧂",
  "🍜",
  "🍲",
  "💧",
  "🍵",
  "☕",
  "🍟",
  "🍪",
  "🥛",
  "🍫",
  "🧼",
  "🧺",
  "🪥",
  "🚬",
  "🍎",
  "🥚",
  "🥫",
];

const QUICK_UNITS = [
  "kg",
  "pack",
  "botol",
  "bungkus",
  "sachet",
  "kotak",
  "batang",
  "tube",
  "karung",
  "biji",
];

const CATEGORY_COLORS = [
  "bg-amber-100",
  "bg-yellow-100",
  "bg-orange-100",
  "bg-sky-100",
  "bg-rose-100",
  "bg-blue-100",
  "bg-emerald-100",
  "bg-neutral-200",
  "bg-violet-100",
];

const HERO_GRADIENTS = [
  { name: "Emerald (Hijau)", value: "from-emerald-600 to-emerald-800" },
  { name: "Amber (Oranye)", value: "from-amber-500 to-orange-600" },
  { name: "Sky (Biru)", value: "from-sky-600 to-blue-700" },
  { name: "Rose (Merah)", value: "from-rose-500 to-red-600" },
  { name: "Violet (Ungu)", value: "from-violet-600 to-indigo-800" },
  { name: "Teal (Toska)", value: "from-teal-600 to-teal-800" },
];

function AdminPage() {
  // Authentication State
  const { adminCreds, updateAdminCreds } = useAdminAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_logged_in") === "true";
    }
    return false;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Admin Credential Management State
  const [secUsername, setSecUsername] = useState("");
  const [secPassword, setSecPassword] = useState("");
  const [secConfirmPassword, setSecConfirmPassword] = useState("");

  useEffect(() => {
    if (adminCreds) {
      setSecUsername(adminCreds.username);
    }
  }, [adminCreds]);

  // Navigation Section State
  const [adminSection, setAdminSection] = useState<
    "products" | "categories" | "profile" | "hero" | "security"
  >("products");

  // --- PRODUCTS STATE & HOOKS ---
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts();
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodUnit, setProdUnit] = useState("pack");
  const [prodCategory, setProdCategory] = useState("");
  const [prodEmoji, setProdEmoji] = useState("📦");
  const [prodDescription, setProdDescription] = useState("");
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodPromo, setProdPromo] = useState<number>(0);
  const [prodStockStatus, setProdStockStatus] = useState<"tersedia" | "terbatas" | "habis">(
    "tersedia",
  );
  const [prodImage, setProdImage] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --- CATEGORIES STATE & HOOKS ---
  const { categories, addCategory, updateCategory, deleteCategory, resetCategories } =
    useCategories();
  const [catActiveTab, setCatActiveTab] = useState<"list" | "form">("list");
  const [catEditingSlug, setCatEditingSlug] = useState<string | null>(null);
  const [catSlug, setCatSlug] = useState("");
  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("🏷️");
  const [catColor, setCatColor] = useState("bg-amber-100");
  const [deletingCatSlug, setDeletingCatSlug] = useState<string | null>(null);

  // Set default category slug when categories load or change
  useEffect(() => {
    if (categories.length > 0 && !prodCategory) {
      setProdCategory(categories[0].slug);
    }
  }, [categories, prodCategory]);

  // --- PROFILE STATE & HOOKS ---
  const { store, updateStore, resetStore } = useStore();
  const [stName, setStName] = useState(store.name);
  const [stTagline, setStTagline] = useState(store.tagline);
  const [stAddress, setStAddress] = useState(store.address);
  const [stHours, setStHours] = useState(store.hours);
  const [stPhone, setStPhone] = useState(store.phone);
  const [stRating, setStRating] = useState(store.rating);
  const [stReviews, setStReviews] = useState(store.reviews);
  const [stGoogleReviewUrl, setStGoogleReviewUrl] = useState(store.googleReviewUrl);
  const [stInstagram, setStInstagram] = useState(store.instagram);
  const [stFacebook, setStFacebook] = useState(store.facebook);
  const [stMapUrl, setStMapUrl] = useState(store.mapUrl);
  const [stCoverImage, setStCoverImage] = useState(store.coverImage || "");
  const [stLogo, setStLogo] = useState(store.logo || "🏪");

  // Sync profile fields with store data on load
  useEffect(() => {
    setStName(store.name);
    setStTagline(store.tagline);
    setStAddress(store.address);
    setStHours(store.hours);
    setStPhone(store.phone);
    setStRating(store.rating);
    setStReviews(store.reviews);
    setStGoogleReviewUrl(store.googleReviewUrl);
    setStInstagram(store.instagram);
    setStFacebook(store.facebook);
    setStMapUrl(store.mapUrl);
    setStCoverImage(store.coverImage || "");
    setStLogo(store.logo || "🏪");
  }, [store]);

  // --- HERO/PROMO STATE & HOOKS ---
  const { hero, updateHero, resetHero } = useHero();
  const [heroActiveTab, setHeroActiveTab] = useState<"list" | "form">("list");
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  const [hrLabel, setHrLabel] = useState("");
  const [hrTitle, setHrTitle] = useState("");
  const [hrSubtitle, setHrSubtitle] = useState("");
  const [hrText, setHrText] = useState("");
  const [hrGradient, setHrGradient] = useState("from-emerald-600 to-emerald-800");
  const [deletingSlideId, setDeletingSlideId] = useState<number | null>(null);

  if (!isLoggedIn) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (
        username.trim().toLowerCase() === adminCreds.username.toLowerCase() &&
        password.trim() === adminCreds.password
      ) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_logged_in", "true");
        }
        setIsLoggedIn(true);
        toast.success("Login berhasil! Selamat datang Admin.");
      } else {
        setLoginError("Username atau password salah");
        toast.error("Login gagal!");
      }
    };

    return (
      <AppShell>
        <div className="px-5 pt-8 pb-16 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600 text-white text-3xl shadow-md overflow-hidden">
                {store.logo &&
                (store.logo.startsWith("http://") || store.logo.startsWith("https://")) ? (
                  <img
                    src={store.logo}
                    alt="Logo"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  store.logo || "🏪"
                )}
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Login Admin</h1>
              <p className="text-xs text-muted-foreground">Masuk untuk mengelola {store.name}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="rounded-xl bg-destructive-soft p-3 text-xs font-medium text-destructive text-center">
                  ⚠️ {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Username</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 text-sm shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition cursor-pointer"
              >
                Masuk ke Panel
              </button>
            </form>

            <div className="rounded-2xl bg-secondary/50 p-3.5 text-center text-[11px] text-muted-foreground border border-border/40">
              <span className="font-semibold text-foreground">Petunjuk Akun:</span>
              <br />
              Username:{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">
                admin
              </code>
              <br />
              Password:{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">
                admin
              </code>
            </div>
          </div>

          <Link
            to="/profile"
            className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:underline"
          >
            <ArrowLeft className="h-3 w-3" /> Kembali ke Halaman Toko
          </Link>
        </div>
      </AppShell>
    );
  }

  // --- PRODUCT CRUD HANDLERS ---
  const resetProdForm = () => {
    setProdName("");
    setProdPrice(0);
    setProdUnit("pack");
    setProdCategory(categories[0]?.slug || "");
    setProdEmoji("📦");
    setProdDescription("");
    setProdFeatured(false);
    setProdPromo(0);
    setProdStockStatus("tersedia");
    setProdImage("");
    setEditingId(null);
  };

  const startProdEdit = (product: Product) => {
    setProdName(product.name);
    setProdPrice(product.price);
    setProdUnit(product.unit);
    setProdCategory(product.category);
    setProdEmoji(product.emoji);
    setProdDescription(product.description);
    setProdFeatured(!!product.featured);
    setProdPromo(product.promo || 0);
    setProdStockStatus(product.stockStatus || "tersedia");
    setProdImage(product.image || "");
    setEditingId(product.id);
    setActiveTab("form");
  };

  const handleProdSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    if (prodPrice <= 0) {
      toast.error("Harga harus lebih besar dari 0");
      return;
    }

    const payload = {
      name: prodName.trim(),
      price: Number(prodPrice),
      unit: prodUnit.trim() || "pack",
      category: prodCategory,
      emoji: prodEmoji.trim() || "📦",
      description: prodDescription.trim() || "Deskripsi produk",
      featured: prodFeatured,
      promo: prodPromo > 0 ? Number(prodPromo) : undefined,
      stockStatus: prodStockStatus,
      image: prodImage.trim() || undefined,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Produk berhasil diperbarui");
      } else {
        await addProduct(payload);
        toast.success("Produk baru berhasil ditambahkan");
      }
      resetProdForm();
      setActiveTab("list");
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Gagal menyimpan produk");
    }
  };

  const handleProdDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Produk berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus produk");
    }
    setDeletingId(null);
  };

  // --- CATEGORY CRUD HANDLERS ---
  const resetCatForm = () => {
    setCatSlug("");
    setCatName("");
    setCatEmoji("🏷️");
    setCatColor("bg-amber-100");
    setCatEditingSlug(null);
  };

  const startCatEdit = (cat: Category) => {
    setCatSlug(cat.slug);
    setCatName(cat.name);
    setCatEmoji(cat.emoji);
    setCatColor(cat.color);
    setCatEditingSlug(cat.slug);
    setCatActiveTab("form");
  };

  const handleCatSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }
    if (!catSlug.trim()) {
      toast.error("Slug kategori wajib diisi");
      return;
    }

    const cleanSlug = catSlug.trim().toLowerCase().replace(/\s+/g, "-");
    const payload: Category = {
      slug: cleanSlug,
      name: catName.trim(),
      emoji: catEmoji.trim() || "🏷️",
      color: catColor,
    };

    try {
      if (catEditingSlug) {
        await updateCategory(catEditingSlug, payload);
        toast.success("Kategori berhasil diperbarui");
      } else {
        // Check for unique slug
        if (categories.some((c) => c.slug === cleanSlug)) {
          toast.error("Slug kategori sudah digunakan");
          return;
        }
        await addCategory(payload);
        toast.success("Kategori baru berhasil ditambahkan");
      }

      resetCatForm();
      setCatActiveTab("list");
    } catch (err) {
      toast.error("Gagal menyimpan kategori");
    }
  };

  const handleCatDelete = async (slug: string) => {
    try {
      await deleteCategory(slug);
      toast.success("Kategori berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus kategori");
    }
    setDeletingCatSlug(null);
  };

  // --- STORE SAVE HANDLER ---
  const handleStoreSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStore({
        name: stName.trim(),
        tagline: stTagline.trim(),
        address: stAddress.trim(),
        hours: stHours.trim(),
        phone: stPhone.trim(),
        rating: Number(stRating),
        reviews: Number(stReviews),
        googleReviewUrl: stGoogleReviewUrl.trim(),
        instagram: stInstagram.trim(),
        facebook: stFacebook.trim(),
        mapUrl: stMapUrl.trim(),
        coverImage: stCoverImage.trim() || undefined,
        logo: stLogo.trim() || undefined,
      });
      toast.success("Profil toko berhasil disimpan");
    } catch (err) {
      toast.error("Gagal menyimpan profil toko");
    }
  };

  interface HeroSlide {
    id: number;
    label: string;
    title: string;
    subtitle: string;
    text: string;
    gradient: string;
  }

  // --- HERO SAVE HANDLERS ---
  const resetHeroForm = () => {
    setHrLabel("");
    setHrTitle("");
    setHrSubtitle("");
    setHrText("");
    setHrGradient("from-emerald-600 to-emerald-800");
    setEditingSlideId(null);
  };

  const startHeroEdit = (slide: HeroSlide) => {
    setHrLabel(slide.label);
    setHrTitle(slide.title);
    setHrSubtitle(slide.subtitle);
    setHrText(slide.text);
    setHrGradient(slide.gradient || "from-emerald-600 to-emerald-800");
    setEditingSlideId(slide.id);
    setHeroActiveTab("form");
  };

  const handleHeroSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hrTitle.trim()) {
      toast.error("Judul promo wajib diisi");
      return;
    }

    const currentSlides = hero.slides || [];
    let updatedSlides = [...currentSlides];

    if (editingSlideId !== null) {
      // Editing existing slide
      updatedSlides = currentSlides.map((s) =>
        s.id === editingSlideId
          ? {
              ...s,
              label: hrLabel.trim(),
              title: hrTitle.trim(),
              subtitle: hrSubtitle.trim(),
              text: hrText.trim(),
              gradient: hrGradient,
            }
          : s,
      );
    } else {
      // Adding new slide
      const newId = currentSlides.length > 0 ? Math.max(...currentSlides.map((s) => s.id)) + 1 : 1;
      updatedSlides.push({
        id: newId,
        label: hrLabel.trim() || "Promo Baru",
        title: hrTitle.trim(),
        subtitle: hrSubtitle.trim(),
        text: hrText.trim(),
        gradient: hrGradient,
      });
    }

    // Keep legacy single slide properties in sync with slide 1
    const firstSlide = updatedSlides[0] || {
      label: hrLabel.trim(),
      title: hrTitle.trim(),
      subtitle: hrSubtitle.trim(),
      text: hrText.trim(),
    };

    try {
      await updateHero({
        title: firstSlide.title,
        subtitle: firstSlide.subtitle,
        promoLabel: firstSlide.label,
        promoText: firstSlide.text,
        slides: updatedSlides,
      });

      toast.success("Banner promo berhasil disimpan");
      resetHeroForm();
      setHeroActiveTab("list");
    } catch (err) {
      toast.error("Gagal menyimpan banner promo");
    }
  };

  const handleHeroDelete = async (id: number) => {
    const currentSlides = hero.slides || [];
    if (currentSlides.length <= 1) {
      toast.error("Minimal harus menyisakan 1 banner promo!");
      setDeletingSlideId(null);
      return;
    }

    const updatedSlides = currentSlides.filter((s) => s.id !== id);
    const firstSlide = updatedSlides[0];

    try {
      await updateHero({
        title: firstSlide.title,
        subtitle: firstSlide.subtitle,
        promoLabel: firstSlide.label,
        promoText: firstSlide.text,
        slides: updatedSlides,
      });

      toast.success("Banner promo berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus banner promo");
    }
    setDeletingSlideId(null);
  };

  // --- PRODUCT FILTERS & STATS ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = products.length;
  const outOfStock = products.filter((p) => p.stockStatus === "habis").length;
  const limitedStock = products.filter((p) => p.stockStatus === "terbatas").length;
  const promoItems = products.filter((p) => p.promo).length;

  return (
    <AppShell>
      {/* Sticky Header with navigation back to shop */}
      <header className="sticky top-0 z-10 bg-background/95 px-5 pb-3 pt-6 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-[11px] text-muted-foreground">
                Kelola barang, profil, & promosi warung
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("admin_logged_in");
                }
                setIsLoggedIn(false);
                toast.success("Anda berhasil keluar dari Admin Panel");
              }
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-full px-3 py-1.5 transition cursor-pointer"
            title="Keluar"
          >
            Keluar
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-4 flex gap-1 rounded-2xl bg-secondary p-1 text-xs">
          <button
            onClick={() => setAdminSection("products")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 font-semibold transition",
              adminSection === "products"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Grid className="h-3.5 w-3.5" />
            Produk
          </button>
          <button
            onClick={() => setAdminSection("categories")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 font-semibold transition",
              adminSection === "categories"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Tag className="h-3.5 w-3.5" />
            Kategori
          </button>
          <button
            onClick={() => setAdminSection("profile")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 font-semibold transition",
              adminSection === "profile"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Store className="h-3.5 w-3.5" />
            Profil
          </button>
          <button
            onClick={() => setAdminSection("hero")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 font-semibold transition",
              adminSection === "hero"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Promo
          </button>
          <button
            onClick={() => setAdminSection("security")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 font-semibold transition",
              adminSection === "security"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Akun
          </button>
        </div>
      </header>

      {/* Main Admin Contents */}
      <div className="px-5 py-4 pb-24">
        {/* --- SECTION 1: PRODUCTS --- */}
        {adminSection === "products" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {activeTab === "list"
                  ? "Daftar Produk"
                  : editingId
                    ? "Edit Produk"
                    : "Tambah Produk"}
              </h2>
              <button
                onClick={() => {
                  if (activeTab === "list") {
                    resetProdForm();
                    setActiveTab("form");
                  } else {
                    setActiveTab("list");
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition",
                  activeTab === "list"
                    ? "bg-primary text-primary-foreground hover:brightness-105"
                    : "bg-secondary text-secondary-foreground hover:bg-neutral-200",
                )}
              >
                {activeTab === "list" ? (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Tambah Produk
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5" /> Batal
                  </>
                )}
              </button>
            </div>

            {activeTab === "list" ? (
              <div className="space-y-6">
                {/* Bento Stats */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="rounded-2xl border border-border bg-card p-2.5 text-center shadow-[var(--shadow-card)]">
                    <p className="text-[10px] font-medium text-muted-foreground leading-none">
                      Total
                    </p>
                    <p className="mt-1.5 text-lg font-bold text-foreground">{totalItems}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-2.5 text-center shadow-[var(--shadow-card)]">
                    <p className="text-[10px] font-medium text-red-600 leading-none">Habis</p>
                    <p className="mt-1.5 text-lg font-bold text-red-600">{outOfStock}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-2.5 text-center shadow-[var(--shadow-card)]">
                    <p className="text-[10px] font-medium text-amber-600 leading-none">Limit</p>
                    <p className="mt-1.5 text-lg font-bold text-amber-600">{limitedStock}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-2.5 text-center shadow-[var(--shadow-card)]">
                    <p className="text-[10px] font-medium text-primary leading-none">Promo</p>
                    <p className="mt-1.5 text-lg font-bold text-primary">{promoItems}</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                  />

                  {/* Category Filter Chips */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-5 px-5">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition",
                        selectedCategory === "all"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-neutral-200",
                      )}
                    >
                      Semua
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => setSelectedCategory(c.slug)}
                        className={cn(
                          "flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition",
                          selectedCategory === c.slug
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-neutral-200",
                        )}
                      >
                        <span>{c.emoji}</span>
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product list */}
                {filteredProducts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground bg-card">
                    Tidak ada produk ditemukan.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredProducts.map((product) => {
                      const status = product.stockStatus || "tersedia";
                      return (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] hover:border-neutral-300 transition"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-2xl overflow-hidden border border-neutral-100">
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

                          <div className="flex-1 min-w-0">
                            <h4 className="truncate text-sm font-semibold text-foreground">
                              {product.name}
                            </h4>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                              <span>{formatIDR(product.price)}</span>
                              <span>•</span>
                              <span>per {product.unit}</span>
                              <span>•</span>
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.2 text-[9px] font-bold text-white",
                                  status === "habis" && "bg-neutral-500",
                                  status === "terbatas" && "bg-amber-500",
                                  status === "tersedia" && "bg-emerald-500",
                                )}
                              >
                                {status === "habis"
                                  ? "Habis"
                                  : status === "terbatas"
                                    ? "Terbatas"
                                    : "Tersedia"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startProdEdit(product)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-neutral-200"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(product.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                              title="Hapus"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reset defaults button */}
                <div className="pt-6 border-t border-border text-center">
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Kembalikan daftar produk ke setelan awal toko? Semua perubahan CRUD Anda akan hilang.",
                        )
                      ) {
                        resetProducts();
                        toast.success("Daftar produk dikembalikan ke setelan awal");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:border-neutral-400 hover:text-foreground transition cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Kembalikan Produk Bawaan Pabrik
                  </button>
                </div>
              </div>
            ) : (
              /* Product Edit Form */
              <form
                onSubmit={handleProdSave}
                className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                {/* Emoji Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Pilih Icon / Emoji
                  </label>
                  <div className="flex gap-2">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-2xl border border-border">
                      {prodEmoji}
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={prodEmoji}
                      onChange={(e) => setProdEmoji(e.target.value)}
                      className="w-full rounded-xl border border-border px-3.5 text-sm outline-none focus:border-primary"
                      placeholder="Ketik emoji..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {QUICK_EMOJIS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setProdEmoji(em)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-secondary text-sm hover:scale-105 active:scale-95 transition"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Image via Link */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Link Gambar Produk (URL Gambar)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... (atau link gambar lain)"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                    />
                    {prodImage && (
                      <button
                        type="button"
                        onClick={() => setProdImage("")}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    * Jika diisi, foto ini akan ditampilkan menggantikan icon emoji.
                  </p>
                  {prodImage && (
                    <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-xl border border-border bg-secondary">
                      <img
                        src={prodImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => toast.error("Link gambar tidak valid")}
                      />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Nama Produk</label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Beras Rojo Lele 5kg"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Price and Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="cth. 15000"
                      value={prodPrice || ""}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Satuan</label>
                    <input
                      type="text"
                      required
                      placeholder="cth. pack, botol"
                      value={prodUnit}
                      onChange={(e) => setProdUnit(e.target.value)}
                      className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {QUICK_UNITS.slice(0, 5).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setProdUnit(u)}
                          className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-neutral-200"
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Kategori</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Status Ketersediaan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["tersedia", "terbatas", "habis"] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setProdStockStatus(status)}
                        className={cn(
                          "rounded-xl border py-2 text-xs font-bold uppercase transition",
                          prodStockStatus === status
                            ? status === "tersedia"
                              ? "bg-emerald-500 border-emerald-500 text-white shadow"
                              : status === "terbatas"
                                ? "bg-amber-500 border-amber-500 text-white shadow"
                                : "bg-neutral-500 border-neutral-500 text-white shadow"
                            : "border-border bg-secondary text-muted-foreground hover:bg-neutral-200",
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo and Featured */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Promo Diskon (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      placeholder="Tanpa diskon (0)"
                      value={prodPromo || ""}
                      onChange={(e) =>
                        setProdPromo(Math.min(99, Math.max(0, Number(e.target.value))))
                      }
                      className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col justify-end pb-2.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={prodFeatured}
                        onChange={(e) => setProdFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Pilihan Toko (Featured)</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Deskripsi Singkat</label>
                  <textarea
                    placeholder="Deskripsi, rasa, berat, atau detail tambahan produk..."
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Simpan Produk
                </button>
              </form>
            )}
          </div>
        )}

        {/* --- SECTION 2: CATEGORIES (Master Kategori CRUD) --- */}
        {adminSection === "categories" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {catActiveTab === "list"
                  ? "Kategori Produk"
                  : catEditingSlug
                    ? "Edit Kategori"
                    : "Tambah Kategori"}
              </h2>
              <button
                onClick={() => {
                  if (catActiveTab === "list") {
                    resetCatForm();
                    setCatActiveTab("form");
                  } else {
                    setCatActiveTab("list");
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition",
                  catActiveTab === "list"
                    ? "bg-primary text-primary-foreground hover:brightness-105"
                    : "bg-secondary text-secondary-foreground hover:bg-neutral-200",
                )}
              >
                {catActiveTab === "list" ? (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Tambah Kategori
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5" /> Batal
                  </>
                )}
              </button>
            </div>

            {catActiveTab === "list" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2.5">
                  {categories.map((cat) => (
                    <div
                      key={cat.slug}
                      className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl text-2xl shadow-inner",
                            cat.color || "bg-amber-100",
                          )}
                        >
                          {cat.emoji}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{cat.name}</h4>
                          <p className="text-[10px] font-mono text-muted-foreground">
                            slug: {cat.slug}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => startCatEdit(cat)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-neutral-200"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingCatSlug(cat.slug)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 text-center">
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Kembalikan daftar kategori ke pengaturan awal? Perubahan kustom Anda akan hilang.",
                        )
                      ) {
                        resetCategories();
                        toast.success("Daftar kategori dikembalikan ke setelan awal");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:border-neutral-400 hover:text-foreground transition cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Kembalikan Kategori Bawaan Pabrik
                  </button>
                </div>
              </div>
            ) : (
              /* Category Form */
              <form
                onSubmit={handleCatSave}
                className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                {/* Category Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Sayuran Segar"
                    value={catName}
                    onChange={(e) => {
                      setCatName(e.target.value);
                      if (!catEditingSlug) {
                        // Auto generate slug
                        setCatSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, ""),
                        );
                      }
                    }}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Category Slug */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Slug Kategori (Id Unik URL)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!catEditingSlug}
                    placeholder="cth. sayuran-segar"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary disabled:bg-neutral-100 disabled:text-neutral-400"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    * Slug adalah pengenal unik huruf kecil tanpa spasi (cth. "minuman-manis").
                  </p>
                </div>

                {/* Emoji Select */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Emoji Kategori</label>
                  <div className="flex gap-2">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl border border-border">
                      {catEmoji}
                    </span>
                    <input
                      type="text"
                      maxLength={2}
                      value={catEmoji}
                      onChange={(e) => setCatEmoji(e.target.value)}
                      className="w-full rounded-xl border border-border px-3.5 text-sm outline-none focus:border-primary"
                      placeholder="Ketik 1 emoji..."
                    />
                  </div>
                </div>

                {/* Theme Color Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Pilih Warna Latar Belakang
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {CATEGORY_COLORS.map((bgClass) => (
                      <button
                        key={bgClass}
                        type="button"
                        onClick={() => setCatColor(bgClass)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl border transition-all",
                          bgClass,
                          catColor === bgClass
                            ? "border-primary ring-2 ring-primary/20 scale-105"
                            : "border-border hover:scale-105",
                        )}
                      >
                        {catColor === bgClass && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 transition cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Simpan Kategori
                </button>
              </form>
            )}
          </div>
        )}

        {/* --- SECTION 3: EDIT PROFILE --- */}
        {adminSection === "profile" && (
          <form
            onSubmit={handleStoreSave}
            className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Edit Profil Warung
            </h2>

            {/* Store Cover Image Link */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Link Gambar Cover Toko (Gambar Atas Profil)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-... (URL Gambar)"
                  value={stCoverImage}
                  onChange={(e) => setStCoverImage(e.target.value)}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
                {stCoverImage && (
                  <button
                    type="button"
                    onClick={() => setStCoverImage("")}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                * Link gambar internet untuk cover di halaman profil warung.
              </p>
              {stCoverImage && (
                <div className="relative mt-2 h-24 w-full overflow-hidden rounded-xl border border-border bg-secondary">
                  <img
                    src={stCoverImage}
                    alt="Cover Toko Preview"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>

            {/* Store Logo */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Logo Toko (Emoji atau URL Gambar)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="cth. 🏪 atau https://images..."
                  value={stLogo}
                  onChange={(e) => setStLogo(e.target.value)}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                * Masukkan satu emoji (seperti 🏪, 🛍️, 🌾) atau masukkan link URL gambar.
              </p>
              {stLogo && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Preview Logo:</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary text-2xl overflow-hidden shadow-sm">
                    {stLogo.startsWith("http://") || stLogo.startsWith("https://") ? (
                      <img
                        src={stLogo}
                        alt="Logo Preview"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      stLogo
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Store Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Nama Warung / Toko</label>
              <input
                type="text"
                required
                value={stName}
                onChange={(e) => setStName(e.target.value)}
                className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Slogan / Tagline</label>
              <input
                type="text"
                required
                value={stTagline}
                onChange={(e) => setStTagline(e.target.value)}
                className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Alamat Toko</label>
              <input
                type="text"
                required
                value={stAddress}
                onChange={(e) => setStAddress(e.target.value)}
                className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Hours */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Jam Operasional</label>
              <input
                type="text"
                required
                value={stHours}
                onChange={(e) => setStHours(e.target.value)}
                className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                No. WhatsApp (Format: 628xxx)
              </label>
              <input
                type="text"
                required
                value={stPhone}
                onChange={(e) => setStPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="628123456789"
              />
              <p className="text-[10px] text-muted-foreground">
                * Gunakan kode negara tanpa simbol + (cth: 628123456789).
              </p>
            </div>

            {/* Rating and Reviews */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Rating Google Maps</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={stRating}
                  onChange={(e) => setStRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Jumlah Ulasan</label>
                <input
                  type="number"
                  value={stReviews}
                  onChange={(e) => setStReviews(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Social Links & Map URLs */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Link Google Review</label>
              <input
                type="url"
                value={stGoogleReviewUrl}
                onChange={(e) => setStGoogleReviewUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Link Instagram</label>
                <input
                  type="url"
                  value={stInstagram}
                  onChange={(e) => setStInstagram(e.target.value)}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Link Facebook</label>
                <input
                  type="url"
                  value={stFacebook}
                  onChange={(e) => setStFacebook(e.target.value)}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Link Google Maps Lokasi
              </label>
              <input
                type="url"
                value={stMapUrl}
                onChange={(e) => setStMapUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary text-xs"
              />
            </div>

            {/* Save Profile Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 transition cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Simpan Profil Warung
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset seluruh data profil ke setelan bawaan pabrik?")) {
                    resetStore();
                    toast.success("Profil direset ke bawaan");
                  }
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground underline transition"
              >
                Reset Profil Bawaan Pabrik
              </button>
            </div>
          </form>
        )}

        {/* --- SECTION 4: BANNER PROMO (HERO) --- */}
        {adminSection === "hero" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {heroActiveTab === "list"
                  ? "Banner Promo Carousel"
                  : editingSlideId !== null
                    ? "Edit Slide Banner"
                    : "Tambah Slide Banner"}
              </h2>
              <button
                onClick={() => {
                  if (heroActiveTab === "list") {
                    resetHeroForm();
                    setHeroActiveTab("form");
                  } else {
                    setHeroActiveTab("list");
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition",
                  heroActiveTab === "list"
                    ? "bg-primary text-primary-foreground hover:brightness-105"
                    : "bg-secondary text-secondary-foreground hover:bg-neutral-200",
                )}
              >
                {heroActiveTab === "list" ? (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Tambah Banner
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5" /> Batal
                  </>
                )}
              </button>
            </div>

            {heroActiveTab === "list" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {(hero.slides || []).map((slide) => (
                    <div
                      key={slide.id}
                      className="relative rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
                    >
                      {/* Banner Slide Preview inside list */}
                      <div
                        className={cn(
                          "rounded-2xl bg-gradient-to-br p-4 text-white shadow-sm",
                          slide.gradient || "from-emerald-600 to-emerald-800",
                        )}
                      >
                        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide opacity-95">
                          <Sparkles className="h-3 w-3" /> {slide.label || "Promo"}
                        </div>
                        <h3 className="mt-1 text-base font-bold leading-tight">{slide.title}</h3>
                        <p className="mt-0.5 text-[11px] opacity-90 line-clamp-2">
                          {slide.subtitle}
                        </p>
                        {slide.text && (
                          <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[9px] backdrop-blur font-medium">
                            <span>📍</span> {slide.text}
                          </div>
                        )}
                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-3">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Slide ID: {slide.id}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startHeroEdit(slide)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-neutral-200 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingSlideId(slide.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 text-center">
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Kembalikan promo carousel ke pengaturan awal? Perubahan kustom Anda akan hilang.",
                        )
                      ) {
                        resetHero();
                        toast.success("Promo carousel dikembalikan ke setelan awal");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:border-neutral-400 hover:text-foreground transition cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Kembalikan Promo Bawaan Pabrik
                  </button>
                </div>
              </div>
            ) : (
              /* Hero Slide Form */
              <form
                onSubmit={handleHeroSave}
                className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                {/* Live Preview within Form */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Live Preview Slide
                  </label>
                  <div
                    className={cn(
                      "rounded-3xl bg-gradient-to-br p-5 text-white shadow-sm",
                      hrGradient,
                    )}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide opacity-95">
                      <Sparkles className="h-3.5 w-3.5" /> {hrLabel || "Promo hari ini"}
                    </div>
                    <h3 className="mt-1 text-xl font-bold leading-tight">
                      {hrTitle || "Judul Promo"}
                    </h3>
                    <p className="mt-1 text-xs opacity-90">
                      {hrSubtitle || "Deskripsi/sub-judul promo..."}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] backdrop-blur">
                      <span>📍</span> {hrText || "Informasi pelengkap"}
                    </div>
                  </div>
                </div>

                {/* Promo Gradient Theme Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Pilih Tema Warna (Gradient)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {HERO_GRADIENTS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setHrGradient(g.value)}
                        className={cn(
                          "rounded-xl border p-2.5 text-left text-xs font-bold text-white bg-gradient-to-br transition-all relative overflow-hidden",
                          g.value,
                          hrGradient === g.value
                            ? "ring-2 ring-emerald-600/60 border-white scale-[1.02]"
                            : "border-border hover:scale-[1.01]",
                        )}
                      >
                        <span className="relative z-10">{g.name}</span>
                        {hrGradient === g.value && (
                          <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/90">
                            <Check className="h-2.5 w-2.5 text-emerald-800" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo Label */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Label Kecil Atas</label>
                  <input
                    type="text"
                    required
                    value={hrLabel}
                    onChange={(e) => setHrLabel(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="cth. Promo hari ini"
                  />
                </div>

                {/* Promo Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Judul Utama Banner
                  </label>
                  <input
                    type="text"
                    required
                    value={hrTitle}
                    onChange={(e) => setHrTitle(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="cth. Belanja sembako, kirim ke rumah"
                  />
                </div>

                {/* Promo Subtitle */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Sub-judul / Penjelasan Singkat
                  </label>
                  <input
                    type="text"
                    required
                    value={hrSubtitle}
                    onChange={(e) => setHrSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="cth. Pesan cepat via WhatsApp, bayar saat barang sampai."
                  />
                </div>

                {/* Promo Badge Text */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Teks Badge Bawah (📍)
                  </label>
                  <input
                    type="text"
                    required
                    value={hrText}
                    onChange={(e) => setHrText(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="cth. Gratis ongkir radius 3 km"
                  />
                </div>

                {/* Save Banner Button */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 transition cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Simpan Slide Banner
                </button>
              </form>
            )}
          </div>
        )}

        {/* --- SECTION 5: SECURITY & ADMIN AUTH --- */}
        {adminSection === "security" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-4 dark:bg-emerald-950/30">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    Database Firestore Terhubung
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
                    Pengelolaan barang/produk, kategori, profil toko, banner promo, dan autentikasi
                    admin tersimpan secara real-time di database Firebase Firestore.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!secUsername.trim()) {
                  toast.error("Username admin wajib diisi");
                  return;
                }
                if (!secPassword) {
                  toast.error("Password wajib diisi");
                  return;
                }
                if (secConfirmPassword && secPassword !== secConfirmPassword) {
                  toast.error("Konfirmasi password tidak cocok!");
                  return;
                }
                try {
                  await updateAdminCreds(secUsername.trim(), secPassword);
                  toast.success("Kredensial login admin berhasil disimpan di database!");
                  setSecConfirmPassword("");
                } catch (err) {
                  toast.error("Gagal memperbarui kredensial admin");
                }
              }}
              className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Pengaturan Akun & Autentikasi Admin
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ubah username dan password admin yang tersimpan di database.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Username Admin Baru</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={secUsername}
                    onChange={(e) => setSecUsername(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Password Admin Baru</label>
                <input
                  type="password"
                  required
                  value={secPassword}
                  onChange={(e) => setSecPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                  placeholder="Masukkan password baru"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Konfirmasi Password</label>
                <input
                  type="password"
                  value={secConfirmPassword}
                  onChange={(e) => setSecConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                  placeholder="Ulangi password baru (opsional)"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 text-sm shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition cursor-pointer mt-2"
              >
                <Save className="h-4 w-4" />
                Simpan Perubahan ke Database
              </button>
            </form>
          </div>
        )}
      </div>

      {/* --- MODAL CONFIRMATIONS OVERLAYS --- */}

      {/* Product Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl border border-border bg-card p-5 shadow-2xl text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-3 text-base font-bold text-foreground">Hapus Produk?</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Tindakan ini permanen. Produk terpilih akan dihapus dari inventaris Anda.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 rounded-full bg-secondary py-2 text-xs font-semibold text-secondary-foreground hover:bg-neutral-200"
              >
                Batal
              </button>
              <button
                onClick={() => deletingId && handleProdDelete(deletingId)}
                className="flex-1 rounded-full bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Delete Modal */}
      {deletingCatSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl border border-border bg-card p-5 shadow-2xl text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-3 text-base font-bold text-foreground">Hapus Kategori?</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Tindakan ini permanen. Kategori ini akan dihapus. Produk dalam kategori ini akan
              kehilangan relasinya.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setDeletingCatSlug(null)}
                className="flex-1 rounded-full bg-secondary py-2 text-xs font-semibold text-secondary-foreground hover:bg-neutral-200"
              >
                Batal
              </button>
              <button
                onClick={() => deletingCatSlug && handleCatDelete(deletingCatSlug)}
                className="flex-1 rounded-full bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Delete Modal */}
      {deletingSlideId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl border border-border bg-card p-5 shadow-2xl text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-3 text-base font-bold text-foreground">Hapus Banner?</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Tindakan ini permanen. Banner terpilih akan dihapus dari carousel promo.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setDeletingSlideId(null)}
                className="flex-1 rounded-full bg-secondary py-2 text-xs font-semibold text-secondary-foreground hover:bg-neutral-200"
              >
                Batal
              </button>
              <button
                onClick={() => deletingSlideId !== null && handleHeroDelete(deletingSlideId)}
                className="flex-1 rounded-full bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";

export const STORE = {
  name: "Toko Kurnia",
  tagline: "Sembako lengkap, harga bersahabat",
  address: "Panawangan, Kab. Ciamis",
  hours: "Setiap hari · 06.00 – 21.00 WIB",
  phone: "6281234567890", // WhatsApp (international format, no +)
  rating: 4.9,
  reviews: 328,
  googleReviewUrl: "https://g.page/r/tokokurnia/review",
  instagram: "https://instagram.com/tokokurnia",
  facebook: "https://facebook.com/tokokurnia",
  mapUrl: "https://maps.google.com/?q=Toko+Kurnia+Bandung",
  lat: -7.1352,
  lng: 108.3615,
  coverImage: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=600",
  logo: "🏪",
};

export type Category = {
  slug: string;
  name: string;
  emoji: string;
  color: string; // tailwind bg class
};

export const CATEGORIES: Category[] = [
  { slug: "dapur", name: "Kebutuhan Dapur", emoji: "🍳", color: "bg-amber-100" },
  { slug: "rumah", name: "Kebutuhan Rumah", emoji: "🏠", color: "bg-blue-100" },
  { slug: "makanan", name: "Makanan", emoji: "🍕", color: "bg-orange-100" },
  { slug: "minuman", name: "Minuman", emoji: "🥤", color: "bg-sky-100" },
  { slug: "segar-beku", name: "Produk segar dan Beku", emoji: "❄️", color: "bg-emerald-100" },
  { slug: "pertanian", name: "Pertanian", emoji: "🌾", color: "bg-green-100" },
  { slug: "peternakan", name: "Peternakan", emoji: "🐓", color: "bg-red-100" },
  { slug: "pulsa-data", name: "Pulsa & Paket Data", emoji: "📱", color: "bg-purple-100" },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  emoji: string;
  description: string;
  featured?: boolean;
  promo?: number; // percent off
  stockStatus?: "tersedia" | "terbatas" | "habis";
  image?: string; // image URL
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Beras Pandan Wangi 5kg",
    price: 72000,
    unit: "karung",
    category: "pertanian",
    emoji: "🌾",
    description: "Beras premium pulen dan wangi, cocok untuk sehari-hari.",
    featured: true,
    promo: 10,
    stockStatus: "tersedia",
  },
  {
    id: "p2",
    name: "Beras Rojolele 5kg",
    price: 68000,
    unit: "karung",
    category: "pertanian",
    emoji: "🍚",
    description: "Beras putih bersih dari petani lokal.",
    stockStatus: "terbatas",
  },
  {
    id: "p3",
    name: "Minyak Goreng Bimoli 2L",
    price: 34000,
    unit: "botol",
    category: "dapur",
    emoji: "🫗",
    description: "Minyak goreng jernih untuk masakan sehari-hari.",
    featured: true,
    stockStatus: "tersedia",
  },
  {
    id: "p4",
    name: "Gula Pasir Gulaku 1kg",
    price: 15500,
    unit: "pack",
    category: "dapur",
    emoji: "🍬",
    description: "Gula pasir putih halus.",
    stockStatus: "habis",
  },
  {
    id: "p5",
    name: "Garam Halus Refina 250g",
    price: 4500,
    unit: "pack",
    category: "dapur",
    emoji: "🧂",
    description: "Garam beryodium.",
    stockStatus: "tersedia",
  },
  {
    id: "p6",
    name: "Indomie Goreng",
    price: 3500,
    unit: "bungkus",
    category: "makanan",
    emoji: "🍜",
    description: "Mi instan legendaris rasa goreng.",
    featured: true,
    stockStatus: "tersedia",
  },
  {
    id: "p7",
    name: "Mie Sedaap Ayam Bawang",
    price: 3200,
    unit: "bungkus",
    category: "makanan",
    emoji: "🍲",
    description: "Kuah gurih ayam bawang.",
    stockStatus: "terbatas",
  },
  {
    id: "p8",
    name: "Aqua 600ml",
    price: 4000,
    unit: "botol",
    category: "minuman",
    emoji: "💧",
    description: "Air mineral kemasan.",
    stockStatus: "tersedia",
  },
  {
    id: "p9",
    name: "Teh Botol Sosro 350ml",
    price: 5000,
    unit: "botol",
    category: "minuman",
    emoji: "🍵",
    description: "Teh melati manis segar.",
    promo: 15,
    stockStatus: "tersedia",
  },
  {
    id: "p10",
    name: "Kopi Kapal Api Sachet",
    price: 1500,
    unit: "sachet",
    category: "minuman",
    emoji: "☕",
    description: "Kopi hitam sachet praktis.",
    stockStatus: "tersedia",
  },
  {
    id: "p11",
    name: "Chitato Sapi Panggang",
    price: 10500,
    unit: "pack",
    category: "makanan",
    emoji: "🍟",
    description: "Snack kentang renyah.",
    stockStatus: "terbatas",
  },
  {
    id: "p12",
    name: "Oreo Original",
    price: 9500,
    unit: "pack",
    category: "makanan",
    emoji: "🍪",
    description: "Biskuit sandwich cokelat.",
    stockStatus: "tersedia",
  },
  {
    id: "p13",
    name: "Susu Ultra Full Cream 1L",
    price: 18500,
    unit: "kotak",
    category: "minuman",
    emoji: "🥛",
    description: "Susu UHT segar.",
    featured: true,
    stockStatus: "tersedia",
  },
  {
    id: "p14",
    name: "Milo Sachet",
    price: 2500,
    unit: "sachet",
    category: "minuman",
    emoji: "🍫",
    description: "Cokelat malt energi.",
    stockStatus: "tersedia",
  },
  {
    id: "p15",
    name: "Sabun Lifebuoy 85g",
    price: 3500,
    unit: "batang",
    category: "rumah",
    emoji: "🧼",
    description: "Sabun mandi antibakteri.",
    stockStatus: "tersedia",
  },
  {
    id: "p16",
    name: "Rinso Anti Noda 770g",
    price: 22000,
    unit: "pack",
    category: "rumah",
    emoji: "🧺",
    description: "Deterjen bubuk pembersih maksimal.",
    stockStatus: "tersedia",
  },
  {
    id: "p17",
    name: "Pepsodent 190g",
    price: 15000,
    unit: "tube",
    category: "rumah",
    emoji: "🪥",
    description: "Pasta gigi mint segar.",
    stockStatus: "tersedia",
  },
  {
    id: "p18",
    name: "Daging Sapi Segar 500g",
    price: 65000,
    unit: "pack",
    category: "segar-beku",
    emoji: "🥩",
    description: "Daging sapi segar pilihan berkualitas tinggi.",
    stockStatus: "tersedia",
  },
  {
    id: "p19",
    name: "Telur Ayam Ras 1kg",
    price: 28000,
    unit: "pack",
    category: "peternakan",
    emoji: "🥚",
    description: "Telur ayam segar langsung dari peternakan.",
    stockStatus: "tersedia",
  },
  {
    id: "p20",
    name: "Pulsa Telkomsel 50.000",
    price: 52000,
    unit: "transaksi",
    category: "pulsa-data",
    emoji: "📱",
    description: "Isi ulang pulsa reguler Telkomsel Rp 50.000.",
    stockStatus: "tersedia",
  },
];

export const HERO = {
  title: "Belanja sembako, kirim ke rumah",
  subtitle: "Pesan cepat via WhatsApp, bayar saat barang sampai.",
  promoLabel: "Promo hari ini",
  promoText: "Gratis ongkir radius 3 km",
  slides: [
    {
      id: 1,
      label: "Promo hari ini",
      title: "Belanja sembako, kirim ke rumah",
      subtitle: "Pesan cepat via WhatsApp, bayar saat barang sampai.",
      text: "Gratis ongkir radius 3 km",
      gradient: "from-emerald-600 to-emerald-800",
    },
    {
      id: 2,
      label: "Hemat Tiap Hari",
      title: "Bahan Dapur & Sembako Lebih Hemat",
      subtitle: "Dapatkan potongan harga langsung untuk pembelian kebutuhan harian.",
      text: "Diskon up to 15% untuk produk pilihan",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      id: 3,
      label: "Pasti Segar",
      title: "Sayur, Daging & Bahan Segar Harian",
      subtitle: "Dipilih dengan teliti dari pasokan terbaik untuk keluarga Anda.",
      text: "Garansi kualitas kesegaran optimal",
      gradient: "from-sky-600 to-blue-700",
    },
  ],
};

// Module cache for static helper access
let cachedProducts: Product[] = PRODUCTS;
let cachedCategories: Category[] = CATEGORIES;
let cachedStore: typeof STORE = STORE;
let cachedHero: typeof HERO = HERO;

export const getStoredProducts = (): Product[] => {
  return cachedProducts.length > 0 ? cachedProducts : PRODUCTS;
};

export const getStoredCategories = (): Category[] => {
  return cachedCategories.length > 0 ? cachedCategories : CATEGORIES;
};

export const getStoredStore = (): typeof STORE => {
  return cachedStore || STORE;
};

export const getStoredHero = (): typeof HERO => {
  return cachedHero || HERO;
};

// Seed initial products if database collection is empty
async function seedProductsIfEmpty() {
  try {
    PRODUCTS.forEach(async (prod) => {
      await setDoc(doc(db, "products", prod.id), prod, { merge: true });
    });
  } catch (err) {
    console.error("Failed to seed products:", err);
  }
}

// Seed initial categories if empty
async function seedCategoriesIfEmpty() {
  try {
    CATEGORIES.forEach(async (cat) => {
      await setDoc(doc(db, "categories", cat.slug), cat, { merge: true });
    });
  } catch (err) {
    console.error("Failed to seed categories:", err);
  }
}

// Hook for Realtime Products from Firestore
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      async (snapshot) => {
        if (snapshot.empty) {
          await seedProductsIfEmpty();
          cachedProducts = PRODUCTS;
          setProducts(PRODUCTS);
        } else {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, "id">) });
          });
          cachedProducts = list;
          setProducts(list);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "products");
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    products,
    loading,
    setProducts: async (newProducts: Product[]) => {
      try {
        for (const p of newProducts) {
          await setDoc(doc(db, "products", p.id), p, { merge: true });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "products");
      }
    },
    addProduct: async (product: Omit<Product, "id">) => {
      const newId = "p_" + Date.now();
      const newProduct: Product = { ...product, id: newId };
      const cleanData: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(newProduct)) {
        if (val !== undefined) {
          cleanData[key] = val;
        }
      }
      try {
        await setDoc(doc(db, "products", newId), cleanData);
        return newProduct;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `products/${newId}`);
      }
    },
    updateProduct: async (id: string, updatedFields: Partial<Product>) => {
      try {
        const cleanData: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(updatedFields)) {
          if (val === undefined) {
            cleanData[key] = deleteField();
          } else {
            cleanData[key] = val;
          }
        }
        await setDoc(doc(db, "products", id), cleanData, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
      }
    },
    deleteProduct: async (id: string) => {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    },
    resetProducts: async () => {
      try {
        await seedProductsIfEmpty();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "products");
      }
    },
  };
}

// Hook for Realtime Categories from Firestore
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "categories"),
      async (snapshot) => {
        if (snapshot.empty) {
          await seedCategoriesIfEmpty();
          cachedCategories = CATEGORIES;
          setCategories(CATEGORIES);
        } else {
          const list: Category[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Category);
          });
          cachedCategories = list;
          setCategories(list);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "categories");
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    categories,
    loading,
    setCategories: async (newCategories: Category[]) => {
      try {
        for (const c of newCategories) {
          await setDoc(doc(db, "categories", c.slug), c, { merge: true });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "categories");
      }
    },
    addCategory: async (category: Category) => {
      const cleanData: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(category)) {
        if (val !== undefined) {
          cleanData[key] = val;
        }
      }
      try {
        await setDoc(doc(db, "categories", category.slug), cleanData);
        return category;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `categories/${category.slug}`);
      }
    },
    updateCategory: async (slug: string, updatedFields: Partial<Category>) => {
      try {
        const cleanData: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(updatedFields)) {
          if (val === undefined) {
            cleanData[key] = deleteField();
          } else {
            cleanData[key] = val;
          }
        }
        await setDoc(doc(db, "categories", slug), cleanData, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `categories/${slug}`);
      }
    },
    deleteCategory: async (slug: string) => {
      try {
        await deleteDoc(doc(db, "categories", slug));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `categories/${slug}`);
      }
    },
    resetCategories: async () => {
      try {
        await seedCategoriesIfEmpty();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "categories");
      }
    },
  };
}

// Hook for Realtime Store Profile from Firestore
export function useStore() {
  const [store, setStore] = useState<typeof STORE>(STORE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storeDocRef = doc(db, "settings", "store");
    const unsubscribe = onSnapshot(
      storeDocRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            await setDoc(storeDocRef, STORE);
            cachedStore = STORE;
            setStore(STORE);
          } catch (e) {
            console.error("Failed to seed store doc:", e);
          }
        } else {
          const data = { ...STORE, ...snapshot.data() };
          cachedStore = data;
          setStore(data);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "settings/store");
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    store,
    loading,
    updateStore: async (updatedFields: Partial<typeof STORE>) => {
      try {
        const cleanData: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(updatedFields)) {
          if (val === undefined) {
            cleanData[key] = deleteField();
          } else {
            cleanData[key] = val;
          }
        }
        await setDoc(doc(db, "settings", "store"), cleanData, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, "settings/store");
      }
    },
    resetStore: async () => {
      try {
        await setDoc(doc(db, "settings", "store"), STORE);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "settings/store");
      }
    },
  };
}

// Hook for Realtime Hero / Banner Promo from Firestore
export function useHero() {
  const [hero, setHero] = useState<typeof HERO>(HERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const heroDocRef = doc(db, "settings", "hero");
    const unsubscribe = onSnapshot(
      heroDocRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            await setDoc(heroDocRef, HERO);
            cachedHero = HERO;
            setHero(HERO);
          } catch (e) {
            console.error("Failed to seed hero doc:", e);
          }
        } else {
          const data = { ...HERO, ...snapshot.data() };
          cachedHero = data;
          setHero(data);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "settings/hero");
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    hero,
    loading,
    updateHero: async (updatedFields: Partial<typeof HERO>) => {
      try {
        const cleanData: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(updatedFields)) {
          if (val === undefined) {
            cleanData[key] = deleteField();
          } else {
            cleanData[key] = val;
          }
        }
        await setDoc(doc(db, "settings", "hero"), cleanData, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, "settings/hero");
      }
    },
    resetHero: async () => {
      try {
        await setDoc(doc(db, "settings", "hero"), HERO);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "settings/hero");
      }
    },
  };
}

// Hook for Realtime Admin Credentials from Firestore
export function useAdminAuth() {
  const [adminCreds, setAdminCreds] = useState({ username: "admin", password: "admin" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminDocRef = doc(db, "settings", "admin");
    const unsubscribe = onSnapshot(
      adminDocRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            const initialAdmin = {
              username: "admin",
              password: "admin",
              updatedAt: new Date().toISOString(),
            };
            await setDoc(adminDocRef, initialAdmin);
            setAdminCreds({ username: "admin", password: "admin" });
          } catch (e) {
            console.error("Failed to seed admin credentials doc:", e);
          }
        } else {
          const data = snapshot.data();
          setAdminCreds({
            username: data.username || "admin",
            password: data.password || "admin",
          });
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "settings/admin");
      },
    );

    return () => unsubscribe();
  }, []);

  const updateAdminCreds = async (newUsername: string, newPassword: string) => {
    try {
      await setDoc(
        doc(db, "settings", "admin"),
        { username: newUsername, password: newPassword, updatedAt: new Date().toISOString() },
        { merge: true },
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "settings/admin");
    }
  };

  return {
    adminCreds,
    loading,
    updateAdminCreds,
  };
}

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export const priceAfter = (p: Product) =>
  p.promo ? Math.round(p.price * (1 - p.promo / 100)) : p.price;

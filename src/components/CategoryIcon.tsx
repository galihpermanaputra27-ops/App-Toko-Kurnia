import React from "react";
import {
  Utensils,
  UtensilsCrossed,
  Home,
  Pizza,
  CupSoda,
  Snowflake,
  Sprout,
  Egg,
  Smartphone,
  ShoppingBag,
  Store,
  Package,
  Tag,
  Coffee,
  Sparkles,
  Heart,
  Zap,
  Boxes,
  Droplets,
  Flame,
  Apple,
  Shirt,
  Wrench,
  Milk,
  Fish,
  Folder,
  LucideProps,
} from "lucide-react";

export const CATEGORY_FLAT_ICONS: {
  id: string;
  name: string;
  icon: React.ComponentType<LucideProps>;
}[] = [
  { id: "Utensils", name: "Dapur", icon: Utensils },
  { id: "UtensilsCrossed", name: "Alat Dapur", icon: UtensilsCrossed },
  { id: "Home", name: "Rumah", icon: Home },
  { id: "Pizza", name: "Makanan", icon: Pizza },
  { id: "CupSoda", name: "Minuman", icon: CupSoda },
  { id: "Snowflake", name: "Segar & Beku", icon: Snowflake },
  { id: "Sprout", name: "Pertanian", icon: Sprout },
  { id: "Egg", name: "Peternakan", icon: Egg },
  { id: "Smartphone", name: "Pulsa & Data", icon: Smartphone },
  { id: "ShoppingBag", name: "Belanja", icon: ShoppingBag },
  { id: "Store", name: "Toko", icon: Store },
  { id: "Package", name: "Paket", icon: Package },
  { id: "Tag", name: "Kategori", icon: Tag },
  { id: "Coffee", name: "Kopi", icon: Coffee },
  { id: "Sparkles", name: "Kebersihan", icon: Sparkles },
  { id: "Heart", name: "Favorit", icon: Heart },
  { id: "Zap", name: "Listrik", icon: Zap },
  { id: "Boxes", name: "Gudang", icon: Boxes },
  { id: "Droplets", name: "Cairan", icon: Droplets },
  { id: "Flame", name: "Bumbu", icon: Flame },
  { id: "Apple", name: "Buah", icon: Apple },
  { id: "Shirt", name: "Pakaian", icon: Shirt },
  { id: "Wrench", name: "Perkakas", icon: Wrench },
  { id: "Milk", name: "Susu", icon: Milk },
  { id: "Fish", name: "Daging & Ikan", icon: Fish },
];

const EMOJI_TO_ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  "🍳": Utensils,
  "🏠": Home,
  "🍕": Pizza,
  "🥤": CupSoda,
  "❄️": Snowflake,
  "🌾": Sprout,
  "🐓": Egg,
  "📱": Smartphone,
  "🏷️": Tag,
  "📦": Package,
  "🏪": Store,
  "🛍️": ShoppingBag,
  "🧼": Sparkles,
  "🥩": Fish,
  "☕": Coffee,
};

interface CategoryIconProps extends LucideProps {
  name?: string;
  fallbackClass?: string;
}

export function CategoryIcon({ name, className = "h-5 w-5", ...props }: CategoryIconProps) {
  if (!name) {
    return <Folder className={className} {...props} />;
  }

  // 1. Check direct match in flat icons library
  const found = CATEGORY_FLAT_ICONS.find((item) => item.id.toLowerCase() === name.toLowerCase());
  if (found) {
    const IconComp = found.icon;
    return <IconComp className={className} {...props} />;
  }

  // 2. Check emoji fallback map
  if (EMOJI_TO_ICON_MAP[name]) {
    const IconComp = EMOJI_TO_ICON_MAP[name];
    return <IconComp className={className} {...props} />;
  }

  // Default flat icon
  return <Folder className={className} {...props} />;
}

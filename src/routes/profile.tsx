import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Facebook,
  Shield,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useStore, formatWaPhone } from "@/lib/store-data";
import { StoreMap } from "@/components/StoreMap";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { store } = useStore();

  return (
    <AppShell>
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary to-emerald-700">
        {store.coverImage ? (
          <img
            src={store.coverImage}
            alt="Cover Toko"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover brightness-90"
          />
        ) : null}
        <Link
          to="/"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Link
          to="/admin"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur"
        >
          <Shield className="h-4 w-4 text-emerald-600" />
        </Link>
      </div>

      <div className="relative -mt-10 px-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-background bg-primary-soft text-4xl shadow-[var(--shadow-card)] overflow-hidden">
          {store.logo && (store.logo.startsWith("http://") || store.logo.startsWith("https://")) ? (
            <img
              src={store.logo}
              alt="Logo Toko"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            store.logo || "🏪"
          )}
        </div>
        <h1 className="mt-3 text-xl font-bold">{store.name}</h1>
        <p className="text-sm text-muted-foreground">{store.tagline}</p>

        <a
          href={store.googleReviewUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary"
        >
          <Star className="h-3.5 w-3.5 fill-current" />
          {store.rating} · {store.reviews} ulasan Google
        </a>
      </div>

      <div className="mt-6 space-y-3 px-5">
        <InfoRow icon={<MapPin className="h-4 w-4" />} label="Alamat" value={store.address} />
        <InfoRow icon={<Clock className="h-4 w-4" />} label="Jam buka" value={store.hours} />
        <InfoRow
          icon={<Phone className="h-4 w-4" />}
          label="WhatsApp"
          value={`0${formatWaPhone(store.phone).replace(/^62/, "")}`}
        />
      </div>

      <div className="mt-4 px-5">
        <StoreMap />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 px-5">
        <SocialCard
          href={`https://wa.me/${formatWaPhone(store.phone)}`}
          label="WhatsApp"
          icon={<MessageCircle className="h-5 w-5" />}
        />
        <SocialCard
          href={store.instagram}
          label="Instagram"
          icon={<Instagram className="h-5 w-5" />}
        />
        <SocialCard
          href={store.facebook}
          label="Facebook"
          icon={<Facebook className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 px-5 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} {store.name}
      </div>
    </AppShell>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

function SocialCard({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-4 text-xs font-medium shadow-[var(--shadow-card)]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </span>
      {label}
    </a>
  );
}

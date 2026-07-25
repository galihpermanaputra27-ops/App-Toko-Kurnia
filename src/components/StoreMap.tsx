import { useStore } from "@/lib/store-data";

const DEFAULT_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d247.45394705116823!2d108.37612992165582!3d-7.095466554619338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1784953863142!5m2!1sid!2sid";

export function StoreMap() {
  const { store } = useStore();

  const embedUrl =
    "mapEmbedUrl" in store && store.mapEmbedUrl
      ? (store.mapEmbedUrl as string)
      : DEFAULT_MAP_EMBED_URL;

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Lokasi Toko Kurnia Panawangan"
        className="h-full w-full rounded-3xl"
      />
    </div>
  );
}

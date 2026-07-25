import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Home, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/success")({
  component: Success,
});

function Success() {
  const [waUrl, setWaUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = localStorage.getItem("last_order_url");
    if (url) {
      setWaUrl(url);
    }
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col items-center px-5 py-24 text-center">
        <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary-soft">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-xl font-bold">Pesanan dikirim!</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Kami mencoba membuka WhatsApp secara otomatis dengan ringkasan pesananmu. Silakan
          lanjutkan chat untuk konfirmasi ketersediaan dan ongkir.
        </p>

        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-2 rounded-full border border-primary bg-primary-soft px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            <MessageCircle className="h-4 w-4" /> Kirim Ulang via WhatsApp
          </a>
        )}

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          <Home className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
    </AppShell>
  );
}

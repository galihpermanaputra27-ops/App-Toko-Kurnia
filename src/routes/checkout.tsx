import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, Locate, Loader2, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/lib/cart";
import { STORE, formatIDR } from "@/lib/store-data";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
});

type Delivery = "delivery" | "pickup";
type Payment = "cod" | "transfer" | "qris";
type DeliveryTime = "pagi" | "sore";

function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function Checkout() {
  const { detailed, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("delivery");
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>("pagi");
  const [payment, setPayment] = useState<Payment>("cod");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [manualZone, setManualZone] = useState<"<3km" | ">=3km">("<3km");
  const [isLocating, setIsLocating] = useState(false);

  // Shipping fee calculation: < 3 km = Rp 5.000, >= 3 km = Rp 10.000
  const effectiveZone = distanceKm !== null ? (distanceKm < 3 ? "<3km" : ">=3km") : manualZone;
  const shippingFee = delivery === "delivery" ? (effectiveZone === "<3km" ? 5000 : 10000) : 0;
  const grandTotal = subtotal + shippingFee;

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Fitur geolokasi tidak didukung oleh browser Anda.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const dist = getHaversineDistanceKm(STORE.lat, STORE.lng, lat, lng);
        const roundedDist = Math.round(dist * 10) / 10;

        setDistanceKm(roundedDist);
        if (roundedDist < 3) {
          setManualZone("<3km");
        } else {
          setManualZone(">=3km");
        }

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
              toast.success(`Lokasi terdeteksi! Jarak: ${roundedDist} km`);
              setIsLocating(false);
              return;
            }
          }
        } catch {
          // Fallback if reverse geocoding API fails
        }

        setAddress((prev) => (prev ? prev : `Titik lokasi (${lat.toFixed(4)}, ${lng.toFixed(4)})`));
        toast.success(`Lokasi terdeteksi! Jarak ke toko: ${roundedDist} km`);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn("Geolocation error:", err);
        toast.error(
          "Gagal mengakses lokasi GPS. Anda dapat mengetik alamat dan memilih zona jarak secara manual.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleCheckout = () => {
    if (detailed.length === 0) {
      toast.error("Keranjang belanja kosong. Silakan pilih produk terlebih dahulu.");
      return;
    }
    if (!name.trim()) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }
    if (payment !== "cod" && !phone.trim()) {
      toast.error("Nomor WhatsApp wajib diisi.");
      return;
    }
    if (delivery === "delivery" && !address.trim()) {
      toast.error("Alamat pengiriman wajib diisi.");
      return;
    }

    sendWA();
  };

  const sendWA = () => {
    const lines: string[] = [];
    lines.push(`*Pesanan Baru — ${STORE.name}*`);
    lines.push("");
    lines.push(`Nama : ${name}`);
    if (payment !== "cod") {
      lines.push(`No HP: ${phone}`);
    }
    lines.push(
      `Metode Pengiriman: ${delivery === "delivery" ? "Antar ke alamat" : "Ambil di toko"}`,
    );

    if (delivery === "delivery") {
      lines.push(
        `Waktu Antar: ${deliveryTime === "pagi" ? "Pagi (08.00 - 10.00 WIB)" : "Sore (14.00 - 16.00 WIB)"}`,
      );
      lines.push(`Alamat: ${address}`);
      if (distanceKm !== null) {
        lines.push(`Estimasi Jarak: ${distanceKm} km`);
      }
      lines.push(`Ongkos Kirim: ${formatIDR(shippingFee)}`);
    }

    lines.push(`Metode Pembayaran: ${payment.toUpperCase()}`);
    if (notes) lines.push(`Catatan: ${notes}`);
    lines.push("");
    lines.push("*Rincian Pesanan:*");
    detailed.forEach(({ product, qty, lineTotal }, i) => {
      lines.push(`${i + 1}. ${product.name}`);
      lines.push(`   ${qty} × ${formatIDR(lineTotal / qty)} = ${formatIDR(lineTotal)}`);
    });
    lines.push("");
    lines.push(`Subtotal: ${formatIDR(subtotal)}`);
    if (delivery === "delivery") {
      lines.push(`Ongkir: ${formatIDR(shippingFee)}`);
      lines.push(`*Total Bayar: ${formatIDR(grandTotal)}*`);
    } else {
      lines.push(`*Total Bayar: ${formatIDR(subtotal)}*`);
    }
    lines.push("");
    lines.push("Mohon konfirmasi ketersediaan & pesanan. Terima kasih 🙏");

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${STORE.phone}?text=${text}`;

    localStorage.setItem("last_order_url", url);

    clear();
    navigate({ to: "/success" });

    try {
      const w = window.open(url, "_blank");
      if (!w || w.closed || typeof w.closed === "undefined") {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  };

  return (
    <AppShell>
      <header className="px-5 pb-3 pt-6">
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold">Checkout</h1>
        </div>
      </header>

      <div className="space-y-4 px-5 pb-20">
        <Section title="Informasi Pelanggan">
          <Field label="Nama Lengkap" value={name} onChange={setName} placeholder="Nama lengkap" />
          {payment !== "cod" && (
            <Field
              label="No. WhatsApp"
              value={phone}
              onChange={setPhone}
              placeholder="08…"
              type="tel"
            />
          )}
        </Section>

        <Section title="Metode Pengiriman">
          <div className="grid grid-cols-2 gap-2">
            <OptionCard
              active={delivery === "delivery"}
              onClick={() => setDelivery("delivery")}
              label="Antar"
              desc="Diantar ke alamat"
            />
            <OptionCard
              active={delivery === "pickup"}
              onClick={() => setDelivery("pickup")}
              label="Ambil di Toko"
              desc="Datang ke lokasi"
            />
          </div>

          {delivery === "delivery" && (
            <div className="mt-4 space-y-3.5 border-t border-border pt-3.5">
              {/* Delivery Time Option */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Waktu Diantar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryTime("pagi")}
                    className={`rounded-xl border p-2.5 text-left transition ${
                      deliveryTime === "pagi"
                        ? "border-primary bg-primary-soft text-primary font-semibold"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-bold text-foreground">Diantar Pagi</div>
                    <div className="text-[11px]">Jam 08.00 – 10.00</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryTime("sore")}
                    className={`rounded-xl border p-2.5 text-left transition ${
                      deliveryTime === "sore"
                        ? "border-primary bg-primary-soft text-primary font-semibold"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-bold text-foreground">Diantar Sore</div>
                    <div className="text-[11px]">Jam 14.00 – 16.00</div>
                  </button>
                </div>
              </div>

              {/* Address with Locate Me */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Alamat Pengiriman
                  </label>
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                        Mendeteksi…
                      </>
                    ) : (
                      <>
                        <Locate className="h-3 w-3 text-emerald-600" />
                        Locate Me
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ketik alamat lengkap & patokan rumah Anda..."
                  rows={3}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />

                {/* Distance & Shipping Fee Indicator */}
                <div className="mt-2.5 rounded-xl bg-muted/60 p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-muted-foreground">Estimasi Jarak Pengiriman:</span>
                    <span className="font-bold text-foreground">
                      {distanceKm !== null ? `${distanceKm} km` : "Pilih / Deteksi"}
                    </span>
                  </div>

                  {/* Manual Zone selector if distance not auto-detected or to allow quick override */}
                  {distanceKm === null && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-muted-foreground">Pilih zona jarak:</span>
                      <button
                        type="button"
                        onClick={() => setManualZone("<3km")}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                          manualZone === "<3km"
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-background border border-border text-foreground"
                        }`}
                      >
                        &lt; 3 km (Rp 5.000)
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualZone(">=3km")}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                          manualZone === ">=3km"
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-background border border-border text-foreground"
                        }`}
                      >
                        &ge; 3 km (Rp 10.000)
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border/60 pt-1.5">
                    <span className="text-muted-foreground">Ongkos Kirim:</span>
                    <span className="font-bold text-emerald-600">{formatIDR(shippingFee)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Section>

        <Section title="Metode Pembayaran">
          <div className="grid grid-cols-1 gap-2">
            <OptionCard
              active={payment === "cod"}
              onClick={() => setPayment("cod")}
              label="COD (Bayar di Tempat)"
              desc="Pembayaran tunai saat barang diterima"
            />
          </div>
        </Section>

        <Section title="Catatan (opsional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: beras jangan pecah, dll."
            rows={2}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </Section>

        <Section title="Ringkasan Pesanan">
          <div className="space-y-2">
            {detailed.map(({ product, qty, lineTotal }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="line-clamp-1">
                  {qty} × {product.name}
                </span>
                <span className="font-medium">{formatIDR(lineTotal)}</span>
              </div>
            ))}
            <div className="mt-2 space-y-1.5 border-t border-border pt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal Produk</span>
                <span className="font-semibold">{formatIDR(subtotal)}</span>
              </div>
              {delivery === "delivery" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span className="font-semibold text-emerald-600">{formatIDR(shippingFee)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border/80 pt-2 font-bold text-base">
                <span>Total Pembayaran</span>
                <span className="text-primary">{formatIDR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md px-5 pb-3">
        <button
          onClick={handleCheckout}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" />
          Kirim Pesanan via WhatsApp
        </button>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="mb-3 block last:mb-0">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function OptionCard({
  active,
  onClick,
  label,
  desc,
  small,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc: string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition ${
        active ? "border-primary bg-primary-soft" : "border-border bg-background"
      }`}
    >
      <div className={`font-semibold ${small ? "text-xs" : "text-sm"}`}>{label}</div>
      <div className="text-[11px] text-muted-foreground">{desc}</div>
    </button>
  );
}

import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useStore } from "@/lib/store-data";

const API_KEY =
  (process.env.GOOGLE_MAPS_PLATFORM_KEY as string) ||
  (import.meta as unknown as { env: { VITE_GOOGLE_MAPS_PLATFORM_KEY?: string } }).env
    ?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as unknown as { GOOGLE_MAPS_PLATFORM_KEY?: string }).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

export function StoreMap() {
  const { store } = useStore();

  // Default position for the store
  const position = {
    lat: "lat" in store ? (store.lat as number) : -7.1352,
    lng: "lng" in store ? (store.lng as number) : 108.3615,
  };

  if (!hasValidKey) {
    return (
      <div className="flex h-40 w-full flex-col items-center justify-center rounded-3xl border border-border bg-muted/50 p-4 text-center">
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Google Maps API Key Required
        </p>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Please add <code>GOOGLE_MAPS_PLATFORM_KEY</code> to your project secrets in Settings.
        </p>
      </div>
    );
  }

  return (
    <div className="h-40 w-full overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={position}
          defaultZoom={15}
          mapId="DEMO_MAP_ID"
          gestureHandling="greedy"
          disableDefaultUI
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          style={{ width: "100%", height: "100%" }}
        >
          <AdvancedMarker position={position}>
            <Pin background="#059669" glyphColor="#fff" borderColor="#047857" />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}

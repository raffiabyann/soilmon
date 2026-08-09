import { MetricCard } from "@/components/dashboard/MetricCard";
import type { KpiCard } from "@/types/dashboard";
import { useAutoRefresh } from "@/app/AutoRefreshContext";
import { useWibTime } from "@/hooks/useWibTime";
import { formatWibTime } from "@/lib/time";

/**
 * KPI / summary card row (SPEC §32.7).
 *
 * Four equal-width cards in a single row on desktop.
 *
 * The Gateway Status card secondary text ("Last Sync: HH:mm WIB") is
 * overridden here to use the same live lastSyncTime from AutoRefreshContext
 * that the Sidebar and System Information already use — keeping all three
 * Last Sync displays consistent.
 */
export function KpiRow({ cards }: { cards: KpiCard[] }) {
  const { lastSyncTime } = useAutoRefresh();
  const { now: initTime } = useWibTime();

  // Format the sync timestamp — falls back to page-load time before first refresh.
  const syncDate = lastSyncTime ?? initTime;
  const syncStr = formatWibTime(syncDate);

  // Override only the gateway card's secondary text. All other cards pass through.
  const resolvedCards: KpiCard[] = cards.map((card) =>
    card.id === "gateway-status"
      ? { ...card, secondary: `Last Sync: ${syncStr}` }
      : card
  );

  return (
    <section
      aria-label="System summary"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
    >
      {resolvedCards.map((card) => (
        <MetricCard key={card.id} card={card} />
      ))}
    </section>
  );
}

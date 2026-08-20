/**
 * Dashboard data adapter (SPEC §22, §23).
 *
 * This is the single seam between the UI and the eventual data source. Today it
 * returns MOCK data. When the real SoilMon gateway/backend contract is defined,
 * only this adapter changes to translate the real transport (UNKNOWN: MQTT /
 * REST / WebSocket — SPEC §23) into the app-level `DashboardData` model.
 *
 * Presentational components must never import mock data or a transport client
 * directly — they consume the model via `useDashboardData`.
 */
import type { DashboardData, EnvironmentalPoint, NodeData, PowerData } from "@/types/dashboard";
import { mockDashboardData } from "@/data/mock/dashboard.mock";
import { formatWibTime } from "@/lib/time";

/** Polling interval in milliseconds. Change here to adjust globally. */
export const AUTO_REFRESH_INTERVAL_MS = 10_000;

export function getDashboardData(): DashboardData {
  // TODO(hardware): replace with real gateway/backend-derived data once the
  // SoilMon telemetry contract is confirmed (SPEC §5, §28).
  return mockDashboardData;
}

/** Clamp a number within [min, max]. */
function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Apply a small bounded random variation: ±half of `range`. */
function vary(v: number, range: number): number {
  return v + (Math.random() - 0.5) * range;
}

/**
 * Returns a fresh DashboardData snapshot with small realistic variations
 * applied to telemetry values.  Used by the Auto Refresh polling loop.
 *
 * Variation bounds (per refresh cycle):
 *   temperature  ±0.2 °C  (clamped 10–50)
 *   moisture     ±1 %     (clamped 0–100)
 *   pH           ±0.05    (clamped 0–14)
 *   battery      −0–0.5 % (clamped 0–100, never increases)
 *   rssi         ±2 dBm   (clamped −120–0)
 *
 * Environmental series: each point receives the same small perturbation so
 * the chart updates without becoming visually chaotic.
 */
export function refreshDashboardData(current: DashboardData): DashboardData {
  // Format the current WIB time once for all nodes in this refresh cycle.
  const lastUpdate = formatWibTime(new Date());

  // Vary node telemetry
  const nodes: NodeData[] = current.nodes.map((node) => ({
    ...node,
    lastUpdate,
    telemetry: node.telemetry.map((m) => {
      switch (m.key) {
        case "temperature":
          return { ...m, value: Math.round(clamp(vary(m.value, 0.4), 10, 50) * 10) / 10 };
        case "moisture":
          return { ...m, value: Math.round(clamp(vary(m.value, 2), 0, 100)) };
        case "ph":
          return { ...m, value: Math.round(clamp(vary(m.value, 0.1), 0, 14) * 100) / 100 };
        case "battery":
          // Battery only decreases slowly (0–0.5% per cycle) — never increases in mock
          return { ...m, value: Math.round(clamp(m.value - Math.random() * 0.5, 0, 100) * 10) / 10 };
        case "rssi":
          return { ...m, value: Math.round(clamp(vary(m.value, 4), -120, 0)) };
        default:
          return m;
      }
    }),
  }));

  // Vary environmental time-series points
  const points: EnvironmentalPoint[] = current.environmentalSeries.points.map((p) => ({
    time: p.time,
    temperature: p.temperature !== undefined
      ? Math.round(clamp(vary(p.temperature, 0.4), 10, 50) * 10) / 10
      : undefined,
    moisture: p.moisture !== undefined
      ? Math.round(clamp(vary(p.moisture, 2), 0, 40) * 10) / 10
      : undefined,
    ph: p.ph !== undefined
      ? Math.round(clamp(vary(p.ph, 0.1), 0, 14) * 100) / 100
      : undefined,
  }));

  return {
    ...current,
    nodes,
    environmentalSeries: { ...current.environmentalSeries, points },
    // Vary power telemetry if present. Variation bounds are illustrative —
    // TBD(hardware): real bounds depend on panel rating and charge controller.
    power: current.power
      ? ((): PowerData => {
          const p = current.power!;
          return {
            ...p,
            // Battery varies ±0.2% per cycle (slow drain/charge simulation)
            batteryPercent: Math.round(clamp(vary(p.batteryPercent, 0.4), 0, 100) * 10) / 10,
            // Solar varies ±2 W per cycle (cloud cover simulation)
            solarInputWatts: Math.round(Math.max(0, vary(p.solarInputWatts, 4)) * 10) / 10,
            // voltage and current are not displayed in UI — pass through unchanged
            // TBD(hardware): re-enable variation once hardware spec confirms source/range
            voltage: p.voltage,
            current: p.current,
            // History is static between refreshes — only live values update
            history: p.history,
          };
        })()
      : undefined,
    // Irrigation zone status is static — no variation between refreshes.
    // TBD(hardware): when real actuator data is available, map it here.
    irrigationZones: current.irrigationZones,
    // Historical records are static — auto-refresh must NOT regenerate them.
    // TBD(backend): real records will be fetched from the backend on demand,
    // not re-derived from live telemetry on each poll cycle.
    history: current.history,
  };
}

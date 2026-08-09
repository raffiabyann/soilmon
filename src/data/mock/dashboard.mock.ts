/**
 * MOCK / DEMO dashboard data (SPEC §24).
 *
 * These values are NOT real telemetry. They exist only so the frontend shell
 * can be developed before the SoilMon gateway/node contract is defined
 * (SPEC §5, §9, §32.19). The structure mirrors a plausible future API shape so
 * it can be swapped for real data via the adapter (SPEC §22, §23) without
 * touching presentational components.
 */
import type {
  AlertEntry,
  DashboardData,
  EnvironmentalPoint,
  KpiCard,
  NodeData,
  SystemInfoEntry,
} from "@/types/dashboard";

/** Four KPI / summary cards in the exact approved order (SPEC §32.7). */
const summary: KpiCard[] = [
  {
    id: "gateway-status",
    icon: "gateway",
    label: "Gateway Status",
    value: "Online",
    secondary: undefined,
    status: "ok",
  },
  {
    id: "data-received-today",
    icon: "database",
    label: "Data Received (Today)",
    value: "1,248",
    secondary: "records",
    status: "info",
  },
  {
    id: "data-trend-24h",
    icon: "chart",
    label: "Data Trend (24 Hours)",
    value: "+12.4%",
    secondary: "vs yesterday",
    status: "ok",
    trend: "up",
  },
  {
    id: "system-uptime",
    icon: "clock4",
    label: "System Uptime",
    value: "99.8%",
    secondary: "7 hari 14 jam",
    status: "ok",
  },
];

/**
 * 24-hour environmental series (mock). Hourly samples for temperature (°C),
 * moisture (%), and pH. Gentle synthetic variation — not real measurements.
 *
 * Values calibrated to match the approved chart axis domains:
 *   Temperature: ~29–35°C  (left axis 0–40)
 *   Moisture:    ~19–24%   (left axis 0–40)
 *   pH:          ~7.5–8.0  (right axis 0–14)
 */
function buildEnvironmentalPoints(): EnvironmentalPoint[] {
  const points: EnvironmentalPoint[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    // Diurnal-ish shape: rises through morning, peaks midday, falls evening.
    const phase = (hour / 24) * Math.PI * 2;
    const temperature = 32 + Math.sin(phase - Math.PI / 2) * 3;    // ~29–35°C
    const moisture    = 21.5 + Math.cos(phase - Math.PI * 0.6) * 2.5; // ~19–24%
    const ph          = 7.8 + Math.sin(phase - Math.PI / 2) * 0.2;  // ~7.6–8.0

    points.push({
      time: `${String(hour).padStart(2, "0")}:00`,
      temperature: Math.round(temperature * 10) / 10,
      moisture:    Math.round(moisture * 10) / 10,
      ph:          Math.round(ph * 100) / 100,
    });
  }
  return points;
}

/**
 * Four SoilMon monitoring nodes (SPEC §7, §32.9).
 *
 * All telemetry values are visual placeholders — NOT real measurements (SPEC
 * §32.19). Node names, locations, and confirmed metric set are UNKNOWN (SPEC
 * §5); structure is intentionally generic so any field can be updated once
 * the hardware contract is defined.
 */
const nodes: NodeData[] = [
  {
    id: "node-1",
    name: "Node 1",
    location: "Kebun Utara",
    status: "online",
    lastUpdate: "10:24 WIB",
    telemetry: [
      { key: "temperature", value: 28.5,  unit: "°C",  status: "ok" },
      { key: "moisture",    value: 65,    unit: "%",   status: "ok" },
      { key: "ph",          value: 6.5,   unit: "",    status: "ok" },
      { key: "battery",     value: 92,    unit: "%",   status: "ok" },
      { key: "rssi",        value: -67,   unit: " dBm", status: "ok" },
    ],
  },
  {
    id: "node-2",
    name: "Node 2",
    location: "Kebun Tengah",
    status: "online",
    lastUpdate: "10:24 WIB",
    telemetry: [
      { key: "temperature", value: 32.5,  unit: "°C",  status: "ok" },
      { key: "moisture",    value: 55,    unit: "%",   status: "warning" },
      { key: "ph",          value: 6.2,   unit: "",    status: "ok" },
      { key: "battery",     value: 85,    unit: "%",   status: "ok" },
      { key: "rssi",        value: -70,   unit: " dBm", status: "ok" },
    ],
  },
  {
    id: "node-3",
    name: "Node 3",
    location: "Kebun Selatan",
    status: "online",
    lastUpdate: "10:24 WIB",
    telemetry: [
      { key: "temperature", value: 27.8,  unit: "°C",  status: "ok" },
      { key: "moisture",    value: 58,    unit: "%",   status: "ok" },
      { key: "ph",          value: 4.8,   unit: "",    status: "error" },
      { key: "battery",     value: 78,    unit: "%",   status: "ok" },
      { key: "rssi",        value: -72,   unit: " dBm", status: "ok" },
    ],
  },
  {
    id: "node-4",
    name: "Node 4",
    location: "Kebun Barat",
    status: "online",
    lastUpdate: "10:24 WIB",
    telemetry: [
      { key: "temperature", value: 29.1,  unit: "°C",  status: "ok" },
      { key: "moisture",    value: 62,    unit: "%",   status: "ok" },
      { key: "ph",          value: 8.1,   unit: "",    status: "warning" },
      { key: "battery",     value: 70,    unit: "%",   status: "ok" },
      { key: "rssi",        value: -72,   unit: " dBm", status: "ok" },
    ],
  },
];

/**
 * Recent alerts (SPEC §11, §32.10).
 *
 * Alert mechanism is NOT confirmed (SPEC §11). These are visual placeholders
 * only (SPEC §32.19). Structure kept minimal so the real alert contract can
 * be dropped in without changing the component.
 */
const alerts: AlertEntry[] = [
  {
    id: "alert-1",
    severity: "warning",
    title: "pH Level Warning",
    detail: "Node 3 (Kebun Selatan) - pH is below normal range",
    time: "10:15 WIB",
    nodeId: "node-3",
  },
  {
    id: "alert-2",
    severity: "warning",
    title: "Moisture Low",
    detail: "Node 2 (Kebun Tengah) - Soil moisture is low",
    time: "09:45 WIB",
    nodeId: "node-2",
  },
  {
    id: "alert-3",
    severity: "info",
    title: "Battery Low",
    detail: "Node 3 (Kebun Selatan) - Battery level is 78%",
    time: "09:30 WIB",
    nodeId: "node-3",
  },
];

/**
 * System information entries (SPEC §12, §32.10).
 *
 * The confirmed fields are NOT known (SPEC §12). These are visual placeholders
 * only (SPEC §32.19). Do not fabricate real firmware versions, IP addresses,
 * or network details.
 */
const systemInfo: SystemInfoEntry[] = [
  { id: "sys-fw-version",  label: "Firmware Version", value: "v1.2.3"       },
  { id: "sys-network",     label: "Network",          value: "LoRa 868 MHz" },
  { id: "sys-wifi-signal", label: "WiFi Signal",      value: "-61 dBm"      },
  { id: "sys-last-sync",   label: "Last Sync",        value: ""             },
];

export const mockDashboardData: DashboardData = {
  summary,
  environmentalSeries: {
    range: "24h",
    points: buildEnvironmentalPoints(),
  },
  nodes,
  alerts,
  systemInfo,
};

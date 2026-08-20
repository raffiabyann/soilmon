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
  IrrigationZone,
  KpiCard,
  NodeData,
  PowerData,
  PowerHistoryPoint,
  SystemInfoEntry,
  TelemetryRecord,
} from "@/types/dashboard";

/** Four KPI / summary cards in the exact approved order (SPEC §32.7). */
const summary: KpiCard[] = [
  {
    id: "gateway-status",
    icon: "gateway",
    label: "Gateway Status",
    value: "Online",
    secondary: "Simulated",
    status: "ok",
  },
  {
    id: "data-received-today",
    icon: "database",
    label: "Data Received (Today)",
    value: "—",
    secondary: undefined,
    status: "info",
  },
  {
    id: "data-trend-24h",
    icon: "chart",
    label: "Data Trend (24 Hours)",
    value: "—",
    secondary: undefined,
    status: undefined,
    trend: undefined,
  },
  {
    id: "system-uptime",
    icon: "clock4",
    label: "System Uptime",
    value: "—",
    secondary: undefined,
    status: undefined,
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
      { key: "moisture",    value: 55,    unit: "%",   status: "ok" },
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
      { key: "ph",          value: 4.8,   unit: "",    status: "ok" },
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
      { key: "ph",          value: 8.1,   unit: "",    status: "ok" },
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
 *
 * Each entry now carries a `category` field so UI components can resolve icons
 * and filter labels without brittle title-string matching.
 *
 * Threshold-based alerts (pH, moisture, battery, temperature) are NOT included
 * here because no sensor thresholds have been confirmed yet. Only
 * infrastructure/connectivity alerts are present as conceptual examples.
 * TBD(hardware): threshold-based alerts will be added once threshold rules
 * are confirmed via the hardware R&D process.
 */
const alerts: AlertEntry[] = [
  {
    id: "alert-5",
    severity: "info",
    category: "signal",
    title: "Signal Weak",
    detail: "Node 4 (Kebun Barat) - Sinyal koneksi lemah",
    time: "08:20 WIB",
    nodeId: "node-4",
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
  { id: "sys-fw-version",  label: "Firmware Version", value: "—" },
  { id: "sys-network",     label: "Network",          value: "—" },
  { id: "sys-wifi-signal", label: "WiFi Signal",      value: "—" },
  { id: "sys-last-sync",   label: "Last Sync",        value: ""  },
];

/**
 * 24-hour power history series (mock).
 *
 * Solar output follows a diurnal bell curve — zero at night, peaks near solar
 * noon. Battery charges during the day and discharges slowly overnight.
 * These are synthetic shapes for UI demonstration ONLY; they do NOT represent
 * confirmed hardware specs, panel ratings, or real charge/discharge curves.
 *
 * TBD(hardware): replace with real gateway telemetry once the power monitoring
 * contract is defined. Axis domains in PowerChart must also be revisited.
 */
function buildPowerHistory(): PowerHistoryPoint[] {
  const points: PowerHistoryPoint[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    // Solar: bell curve centered on hour 12 (solar noon), zero outside daylight.
    // Shape: sin²(π · (h−6) / 12) for h in [6, 18], else 0.
    // Peak ~120 W is illustrative only — NOT a confirmed panel spec.
    const inDaylight = hour >= 6 && hour <= 18;
    const solarWatts = inDaylight
      ? Math.round(120 * Math.pow(Math.sin((Math.PI * (hour - 6)) / 12), 2) * 10) / 10
      : 0;

    // Battery: starts ~72%, rises to ~91% during daylight, slowly drains at night.
    // Rates are illustrative; real values depend on panel size, load, and capacity.
    let batteryPercent: number;
    if (hour < 6) {
      // Pre-dawn drain from overnight discharge
      batteryPercent = 72 + (hour / 6) * 0; // flat overnight starting value
      batteryPercent = 72 - (5 - hour) * 0.8;
    } else if (hour <= 18) {
      // Charging during daylight
      batteryPercent = 68 + ((hour - 6) / 12) * 23;
    } else {
      // Discharging after sunset
      batteryPercent = 91 - ((hour - 18) / 6) * 8;
    }
    batteryPercent = Math.round(Math.max(0, Math.min(100, batteryPercent)) * 10) / 10;

    points.push({
      time: `${String(hour).padStart(2, "0")}:00`,
      solarWatts,
      batteryPercent,
    });
  }
  return points;
}

/**
 * Current-snapshot power data (mock).
 *
 * Snapshot is taken at a representative mid-afternoon moment (solar panel
 * actively charging). All values are illustrative placeholders — NOT
 * confirmed hardware specifications.
 *
 * TBD(hardware): voltage range, current range, and charging status derivation
 * logic must be defined once the charge controller spec is confirmed.
 */
const power: PowerData = {
  batteryPercent: 84,
  solarInputWatts: 97,
  chargingStatus: "unknown",
  voltage: 13.6,   // TBD(hardware): nominal range unknown
  current: 7.1,    // TBD(hardware): nominal range unknown
  history: buildPowerHistory(),
};

/**
 * Irrigation zone states (mock).
 *
 * Display-only placeholders — NOT connected to any hardware actuator.
 * No automation, trigger rules, or control logic is implemented.
 * Status values and zone boundaries are illustrative only.
 *
 * TBD(hardware): zone boundaries, valve/pump spec, and control protocol
 * must be confirmed before any real data or automation is added.
 */
const irrigationZones: IrrigationZone[] = [
  {
    id: "zone-1",
    name: "Zona 1",
    location: "Kebun Utara",
    status: "unknown",
    lastActivity: "—",
    nodeId: "node-1",
  },
  {
    id: "zone-2",
    name: "Zona 2",
    location: "Kebun Tengah",
    status: "unknown",
    lastActivity: "—",
    nodeId: "node-2",
  },
  {
    id: "zone-3",
    name: "Zona 3",
    location: "Kebun Selatan",
    status: "unknown",
    lastActivity: "—",
    nodeId: "node-3",
  },
  {
    id: "zone-4",
    name: "Zona 4",
    location: "Kebun Barat",
    status: "unknown",
    lastActivity: "—",
    nodeId: "node-4",
  },
];

/**
 * Historical telemetry records (mock).
 *
 * Generated from the same 4 nodes and 5 metrics as the live dashboard.
 * 24 hourly snapshots per node per metric = 4 × 5 × 24 = 480 records.
 * Values follow the same diurnal sine curves used in buildEnvironmentalPoints()
 * so the history is visually consistent with the live charts.
 *
 * Sorted newest-first (highest timestampMs first).
 *
 * TBD(backend): real records will come from the gateway/backend data contract.
 * Timestamps are approximated using Date.now() at module init time — they will
 * drift if the page is loaded much later, which is acceptable for mock data.
 * Real timestamps, date range, and retention policy are unknown until the
 * telemetry contract is confirmed.
 */
function buildTelemetryHistory(): TelemetryRecord[] {
  const now = Date.now();

  // Node base values and per-metric config — mirrors the nodes[] mock data.
  const nodeConfigs = [
    {
      id: "node-1", name: "Node 1", location: "Kebun Utara",
      base: { temperature: 28.5, moisture: 65, ph: 6.5, battery: 92, rssi: -67 },
      status: { temperature: "ok", moisture: "ok", ph: "ok", battery: "ok", rssi: "ok" } as Record<string, string>,
    },
    {
      id: "node-2", name: "Node 2", location: "Kebun Tengah",
      base: { temperature: 32.5, moisture: 55, ph: 6.2, battery: 85, rssi: -70 },
      status: { temperature: "ok", moisture: "ok", ph: "ok", battery: "ok", rssi: "ok" } as Record<string, string>,
    },
    {
      id: "node-3", name: "Node 3", location: "Kebun Selatan",
      base: { temperature: 27.8, moisture: 58, ph: 4.8, battery: 78, rssi: -72 },
      status: { temperature: "ok", moisture: "ok", ph: "ok", battery: "ok", rssi: "ok" } as Record<string, string>,
    },
    {
      id: "node-4", name: "Node 4", location: "Kebun Barat",
      base: { temperature: 29.1, moisture: 62, ph: 8.1, battery: 70, rssi: -72 },
      status: { temperature: "ok", moisture: "ok", ph: "ok", battery: "ok", rssi: "ok" } as Record<string, string>,
    },
  ] as const;

  const metricUnits: Record<string, string> = {
    temperature: "°C",
    moisture:    "%",
    ph:          "",
    battery:     "%",
    rssi:        " dBm",
  };

  const records: TelemetryRecord[] = [];

  for (const node of nodeConfigs) {
    for (let hour = 0; hour < 24; hour++) {
      const tsMs = now - (23 - hour) * 3_600_000;
      const phase = (hour / 24) * Math.PI * 2;

      // Apply same diurnal variation used in buildEnvironmentalPoints()
      const variation: Record<string, number> = {
        temperature: Math.sin(phase - Math.PI / 2) * 3,
        moisture:    Math.cos(phase - Math.PI * 0.6) * 2.5,
        ph:          Math.sin(phase - Math.PI / 2) * 0.2,
        battery:     -((23 - hour) / 24) * 5, // slow drain toward oldest
        rssi:        Math.sin(phase) * 3,
      };

      const date = new Date(tsMs);
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const timestamp = `${hh}:${mm} WIB`;

      for (const metric of ["temperature", "moisture", "ph", "battery", "rssi"] as const) {
        const rawValue = (node.base[metric] as number) + variation[metric];
        const value = Math.round(rawValue * 10) / 10;

        records.push({
          id:           `${node.id}-${metric}-${hour}`,
          timestamp,
          timestampMs:  tsMs,
          nodeId:       node.id,
          nodeName:     node.name,
          nodeLocation: node.location,
          metric,
          value,
          unit:         metricUnits[metric],
          status:       "ok" as TelemetryRecord["status"],
        });
      }
    }
  }

  // Sort newest first
  return records.sort((a, b) => b.timestampMs - a.timestampMs);
}

export const mockDashboardData: DashboardData = {
  summary,
  environmentalSeries: {
    range: "24h",
    points: buildEnvironmentalPoints(),
  },
  nodes,
  alerts,
  systemInfo,
  power,
  irrigationZones,
  history: buildTelemetryHistory(),
};

/**
 * SoilMon dashboard application-level data model (SPEC §22).
 *
 * The UI consumes this clean model; it must not couple to any transport
 * (MQTT/REST/WebSocket) — see SPEC §23. All telemetry values are mock/demo
 * during frontend development (SPEC §5, §24) and the exact schema must follow
 * the real hardware specification once confirmed.
 *
 * Stage 3 implements only `summary` (KPI cards) and `environmentalSeries`
 * (Environmental Overview). Other sections are declared for structural
 * continuity but are NOT implemented in this stage.
 */

/** Semantic status used across the UI (SPEC §17). */
export type StatusLevel = "ok" | "warning" | "error" | "info";

/** Direction of a KPI trend, when applicable. */
export type TrendDirection = "up" | "down" | "flat";

/**
 * A single KPI / summary card (SPEC §9, §32.7).
 *
 * Values are visual placeholders (SPEC §9, §32.19). `status` optionally maps a
 * card to a semantic color (e.g. Gateway Status). Definitions of Data Received
 * / Data Trend / System Uptime are NOT confirmed and must remain replaceable.
 */
export interface KpiCard {
  id: string;
  /** Semantic icon key resolved via lib/icons (single lucide family). */
  icon: "gateway" | "history" | "chart" | "signal" | "database" | "activity" | "trendUp" | "clock4";
  label: string;
  value: string;
  /** Optional supporting line under the value (e.g. "vs yesterday"). */
  secondary?: string;
  status?: StatusLevel;
  trend?: TrendDirection;
}

/**
 * One sample in the environmental time series (SPEC §8).
 *
 * Metric fields are optional because the confirmed sensor list is UNKNOWN
 * (SPEC §5). The chart must render whatever metrics are present.
 */
export interface EnvironmentalPoint {
  /** Display label for the x-axis (e.g. "00:00"). */
  time: string;
  temperature?: number;
  moisture?: number;
  ph?: number;
}

/** Selectable range for the Environmental Overview (SPEC §32.8). */
export type EnvironmentalRange = "24h";

export interface EnvironmentalSeries {
  range: EnvironmentalRange;
  points: EnvironmentalPoint[];
}

/** Node availability state (SPEC §7). Source/semantics are UNKNOWN/TBD. */
export type NodeStatus = "online" | "warning" | "offline";

/**
 * A single node telemetry field (SPEC §7).
 *
 * The confirmed telemetry field set is UNKNOWN (SPEC §5), so nodes carry a
 * flexible list of metrics rather than fixed properties. `status` optionally
 * flags a value semantically (e.g. an out-of-range pH) so the card can colour
 * it. Thresholds are NOT defined by the project yet (SPEC §11) — any status in
 * mock data is a visual placeholder only.
 */
export type NodeMetricKey =
  | "temperature"
  | "moisture"
  | "ph"
  | "battery"
  | "rssi";

export interface NodeMetric {
  key: NodeMetricKey;
  value: number;
  unit: string;
  status?: StatusLevel;
}

/**
 * A SoilMon monitoring node (SPEC §7, §32.9).
 *
 * Data-driven: `telemetry` holds whatever fields are present so the card is not
 * hardcoded to a fixed set. All values are mock placeholders (SPEC §32.19).
 */
export interface NodeData {
  id: string;
  name: string;
  location: string;
  status: NodeStatus;
  lastUpdate: string;
  telemetry: NodeMetric[];
}

/**
 * A single alert entry (SPEC §11, §32.10).
 *
 * Alert rules, thresholds, and generation mechanism are NOT confirmed (SPEC §11).
 * These are visual placeholders only. The component is data-driven so any field
 * can be swapped out once the real contract is known.
 */
export type AlertSeverity = "warning" | "error" | "info";

export interface AlertEntry {
  id: string;
  severity: AlertSeverity;
  /** Short human-readable alert title (e.g. "Low Signal Strength"). */
  title: string;
  /** Optional supporting detail line. */
  detail?: string;
  /** Display timestamp string (mock — SPEC §32.19). */
  time: string;
  /** Optional node this alert is associated with. */
  nodeId?: string;
}

/**
 * A single system information row (SPEC §12, §32.10).
 *
 * Fields are NOT confirmed requirements — keep modular and easy to remove.
 * Do not fabricate real gateway firmware/network/storage data (SPEC §12).
 */
export interface SystemInfoEntry {
  id: string;
  label: string;
  value: string;
  /** Optional semantic status indicator. */
  status?: StatusLevel;
}

/**
 * Power supply charging status.
 *
 * Derived from panel/battery conditions. Exact derivation logic is TBD —
 * depends on hardware spec (charge controller output, voltage thresholds, etc.).
 * In mock data this is approximated from time-of-day.
 */
export type PowerChargingStatus = "charging" | "full" | "idle" | "low";

/**
 * One sample in the 24-hour power history series.
 *
 * Fields are optional so the chart renders whatever the gateway actually
 * provides. Units and confirmed ranges are TBD pending hardware spec.
 */
export interface PowerHistoryPoint {
  /** Display label for the x-axis — same format as EnvironmentalPoint ("HH:00"). */
  time: string;
  /**
   * Solar panel output power.
   * TBD(hardware): unit assumed watts; confirmed range unknown.
   */
  solarWatts?: number;
  /**
   * Battery state of charge.
   * TBD(hardware): 0–100 % assumed; exact source/sensor unknown.
   */
  batteryPercent?: number;
}

/**
 * Power monitoring data for the solar panel / battery system.
 *
 * All numeric fields carry TBD comments because the confirmed hardware spec
 * (sensor type, voltage/current ranges, charge controller protocol) is NOT
 * yet known. The shape is intentionally extensible — add fields once the
 * hardware contract is defined without breaking existing consumers.
 *
 * This data is consumed only by PowerMonitorSection via the dashboard hook.
 * Components must not import mock data directly.
 */
export interface PowerData {
  /**
   * Battery state of charge (%).
   * TBD(hardware): source sensor and calibration curve unknown.
   */
  batteryPercent: number;
  /**
   * Instantaneous solar panel output.
   * TBD(hardware): unit assumed W; confirmed panel rating unknown.
   */
  solarInputWatts: number;
  /**
   * Charging status derived from panel/battery state.
   * TBD(hardware): exact derivation depends on charge controller output.
   */
  chargingStatus: PowerChargingStatus;
  /**
   * Panel/system supply voltage.
   * TBD(hardware): nominal range unknown; displayed as-is.
   */
  voltage: number;
  /**
   * Charging current.
   * TBD(hardware): nominal range unknown; displayed as-is.
   */
  current: number;
  /** 24-hour history for the time-series chart. */
  history: PowerHistoryPoint[];
}

/**
 * Full dashboard model (SPEC §22). Sections beyond the current stage are
 * optional and intentionally unpopulated.
 */
export interface DashboardData {
  summary: KpiCard[];
  environmentalSeries: EnvironmentalSeries;
  nodes: NodeData[];
  /** Recent alert list (SPEC §11, §32.10). Visual placeholders — SPEC §32.19. */
  alerts: AlertEntry[];
  /** System information rows (SPEC §12, §32.10). Visual placeholders — SPEC §32.19. */
  systemInfo: SystemInfoEntry[];
  /**
   * Power monitoring data (solar panel + battery).
   *
   * Optional — the dashboard renders the Power Monitor section only when this
   * field is present. This allows the section to be omitted cleanly if the
   * gateway does not yet supply power telemetry.
   */
  power?: PowerData;
}

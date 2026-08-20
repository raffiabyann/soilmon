/**
 * Shared metric display configuration.
 *
 * Centralizes metric label, icon, and status label mappings used across
 * NodeCard, DataHistoryPage, and ReportsPage.
 * A single source of truth prevents consumers from diverging when new
 * metrics are added to the confirmed sensor set.
 */
import type { NodeMetricKey, StatusLevel } from "@/types/dashboard";
import type { icons } from "@/lib/icons";

/**
 * Full metric labels — used in tables and analytics (DataHistoryPage, ReportsPage).
 * NodeCard uses METRIC_LABEL_SHORT for compact display.
 */
export const METRIC_LABEL: Record<NodeMetricKey, string> = {
  temperature: "Temperature",
  moisture:    "Moisture",
  ph:          "pH",
  battery:     "Battery",
  rssi:        "Signal",
};

/**
 * Short metric labels — used in compact card layouts (NodeCard).
 */
export const METRIC_LABEL_SHORT: Record<NodeMetricKey, string> = {
  temperature: "Temp",
  moisture:    "Moisture",
  ph:          "pH",
  battery:     "Battery",
  rssi:        "Signal",
};

/** Icon key per metric, resolved via the icons registry. */
export const METRIC_ICON: Record<NodeMetricKey, keyof typeof icons> = {
  temperature: "temperature",
  moisture:    "moisture",
  ph:          "ph",
  battery:     "battery",
  rssi:        "signal",
};

/** Human-readable label per status level. */
export const STATUS_LABEL: Record<StatusLevel, string> = {
  ok:      "OK",
  warning: "Warning",
  error:   "Error",
  info:    "Info",
};

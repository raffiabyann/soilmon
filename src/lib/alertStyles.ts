/**
 * Shared alert icon and style configuration.
 *
 * Centralizes the category→icon and severity→style mappings used by both
 * RecentAlerts (dashboard panel) and AlertsPage (full alerts view).
 * A single source of truth prevents the two consumers from diverging when
 * new alert categories are added.
 */
import type { AlertCategory, AlertSeverity } from "@/types/dashboard";
import type { icons } from "@/lib/icons";

/** Icon key per alert category, resolved via the icons registry. */
export const ALERT_CATEGORY_ICON: Record<AlertCategory, keyof typeof icons> = {
  moisture:    "moisture",
  ph:          "ph",
  temperature: "temperature",
  battery:     "battery",
  power:       "solar",
  signal:      "signal",
  system:      "info",
  generic:     "alert",
};

/** Icon background + text color per alert severity. */
export const ALERT_SEV_STYLE: Record<AlertSeverity, { iconBg: string; iconText: string }> = {
  error:   { iconBg: "bg-status-error/10", iconText: "text-status-error" },
  warning: { iconBg: "bg-status-warn/10",  iconText: "text-status-warn"  },
  info:    { iconBg: "bg-status-info/10",  iconText: "text-status-info"  },
};

/**
 * Per-category color overrides that take precedence over severity defaults.
 * Used when a category has a fixed semantic color regardless of severity level.
 */
export const ALERT_CATEGORY_STYLE: Partial<Record<AlertCategory, { iconBg: string; iconText: string }>> = {
  moisture: { iconBg: "bg-status-info/10", iconText: "text-status-info" },
  battery:  { iconBg: "bg-status-warn/10", iconText: "text-status-warn" },
  signal:   { iconBg: "bg-status-info/10", iconText: "text-status-info" },
};

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { useDashboardData } from "@/hooks/useDashboardData";
import type {
  AlertCategory,
  AlertEntry,
  AlertSeverity,
  IrrigationZone,
  IrrigationZoneStatus,
  StatusLevel,
} from "@/types/dashboard";

/**
 * Alerts page — full implementation replacing the previous stub.
 *
 * Sections:
 *   1. Alert list with severity filter tabs (All / Error / Warning / Info)
 *   2. Irrigation Zones — display-only status panel
 *
 * No threshold logic, no trigger rules, no actuator controls.
 * All data consumed via useDashboardData() — same pipeline as the dashboard.
 *
 * TBD(hardware): irrigation zone status source and alert generation mechanism
 * are not yet confirmed. Both sections show mock/placeholder data.
 */

// ─── Shared icon/style maps (mirrors RecentAlerts) ───────────────────────────

const CATEGORY_ICON: Record<AlertCategory, keyof typeof icons> = {
  moisture:    "moisture",
  ph:          "ph",
  temperature: "temperature",
  battery:     "battery",
  power:       "solar",
  signal:      "signal",
  system:      "info",
  generic:     "alert",
};

const SEV_STYLE: Record<AlertSeverity, { iconBg: string; iconText: string }> = {
  error:   { iconBg: "bg-status-error/10", iconText: "text-status-error" },
  warning: { iconBg: "bg-status-warn/10",  iconText: "text-status-warn"  },
  info:    { iconBg: "bg-status-info/10",  iconText: "text-status-info"  },
};

const CATEGORY_STYLE: Partial<Record<AlertCategory, { iconBg: string; iconText: string }>> = {
  moisture: { iconBg: "bg-status-info/10", iconText: "text-status-info" },
  battery:  { iconBg: "bg-status-warn/10", iconText: "text-status-warn" },
  signal:   { iconBg: "bg-status-info/10", iconText: "text-status-info" },
};

function resolveAlertStyle(alert: AlertEntry) {
  return CATEGORY_STYLE[alert.category] ?? SEV_STYLE[alert.severity];
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterValue = "all" | AlertSeverity;

interface FilterTab {
  value: FilterValue;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { value: "all",     label: "All"     },
  { value: "error",   label: "Error"   },
  { value: "warning", label: "Warning" },
  { value: "info",    label: "Info"    },
];

function filterAlerts(alerts: AlertEntry[], filter: FilterValue): AlertEntry[] {
  if (filter === "all") return alerts;
  return alerts.filter((a) => a.severity === filter);
}

function countBySeverity(alerts: AlertEntry[], severity: AlertSeverity): number {
  return alerts.filter((a) => a.severity === severity).length;
}

// ─── Alert row ────────────────────────────────────────────────────────────────

function AlertRow({ alert, last }: { alert: AlertEntry; last: boolean }) {
  const iconKey = CATEGORY_ICON[alert.category];
  const Icon = icons[iconKey];
  const style = resolveAlertStyle(alert);

  return (
    <li
      className={cn(
        "flex items-start gap-3 py-3",
        !last && "border-b border-border",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-inner",
          style.iconBg,
          style.iconText,
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-semibold text-text leading-tight">
            {alert.title}
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-muted whitespace-nowrap">
            {alert.time}
          </span>
        </div>
        {alert.detail && (
          <p className="mt-0.5 text-[11px] text-muted leading-snug">{alert.detail}</p>
        )}
      </div>
    </li>
  );
}

// ─── Alerts section ───────────────────────────────────────────────────────────

function AlertsSection({ alerts }: { alerts: AlertEntry[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const BellIcon = icons.bell;
  const filtered = filterAlerts(alerts, filter);

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <BellIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
        <h2 className="text-sm font-semibold text-text">Alert History</h2>
      </div>

      {/* Filter tabs */}
      <div
        className="mb-4 flex flex-wrap gap-1.5"
        role="group"
        aria-label="Filter alerts by severity"
      >
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.value;
          const count =
            tab.value === "all"
              ? alerts.length
              : countBySeverity(alerts, tab.value as AlertSeverity);

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors duration-150 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                isActive
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-muted hover:border-accent/50 hover:text-text",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-border text-muted",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alert list */}
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          {filter === "all" ? "No alerts" : `No ${filter} alerts`}
        </p>
      ) : (
        <ul aria-label="Alert list">
          {filtered.map((alert, i) => (
            <AlertRow key={alert.id} alert={alert} last={i === filtered.length - 1} />
          ))}
        </ul>
      )}
    </Card>
  );
}

// ─── Irrigation zones section ─────────────────────────────────────────────────

const ZONE_STATUS_LEVEL: Record<IrrigationZoneStatus, StatusLevel> = {
  active:   "ok",
  inactive: "info",
  unknown:  "warning",
};

const ZONE_STATUS_LABEL: Record<IrrigationZoneStatus, string> = {
  active:   "Active",
  inactive: "Inactive",
  unknown:  "Unknown",
};

function ZoneRow({ zone, last }: { zone: IrrigationZone; last: boolean }) {
  const DropletIcon = icons.moisture;
  const ClockIcon = icons.clock;

  return (
    <li
      className={cn(
        "flex items-center gap-3 py-2.5",
        !last && "border-b border-border",
      )}
    >
      <DropletIcon
        className="h-[15px] w-[15px] shrink-0 text-muted"
        strokeWidth={1.8}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <span className="text-[13px] font-medium text-text">{zone.name}</span>
        <span className="ml-2 text-[11px] text-muted">{zone.location}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {zone.lastActivity !== "—" && (
          <span className="hidden items-center gap-1 text-[11px] text-muted sm:flex">
            <ClockIcon className="h-3 w-3" strokeWidth={2} aria-hidden />
            <span className="tabular-nums">{zone.lastActivity}</span>
          </span>
        )}
        <StatusBadge
          status={ZONE_STATUS_LEVEL[zone.status]}
          label={ZONE_STATUS_LABEL[zone.status]}
        />
      </div>
    </li>
  );
}

function IrrigationSection({ zones }: { zones: IrrigationZone[] }) {
  const DropletIcon = icons.moisture;

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-1 flex items-center gap-2.5">
        <DropletIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
        <h2 className="text-sm font-semibold text-text">Irrigation Zones</h2>
      </div>
      <p className="mb-3 text-[11px] text-muted leading-tight">
        Status zona irigasi — simulated data, hardware belum terkonfigurasi
      </p>

      {zones.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No irrigation zones configured</p>
      ) : (
        <ul aria-label="Irrigation zones">
          {zones.map((zone, i) => (
            <ZoneRow key={zone.id} zone={zone} last={i === zones.length - 1} />
          ))}
        </ul>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AlertsPage() {
  const { alerts, irrigationZones } = useDashboardData();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-[22px] font-semibold text-text leading-tight">Alerts</h1>
        <p className="mt-0.5 text-sm text-muted">
          Riwayat alert sensor dan status zona irigasi
        </p>
      </div>

      {/* Alert list with filter */}
      <AlertsSection alerts={alerts} />

      {/* Irrigation zones — rendered only when data is present */}
      {irrigationZones && irrigationZones.length > 0 && (
        <IrrigationSection zones={irrigationZones} />
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { ALERT_CATEGORY_ICON, ALERT_SEV_STYLE, ALERT_CATEGORY_STYLE } from "@/lib/alertStyles";
import type { AlertEntry } from "@/types/dashboard";

/**
 * Recent Alerts panel (design_specs §F).
 *
 * Header: Bell icon + "Recent Alerts" title.
 * Per-alert row: semantic icon in a square tinted container (not circle),
 * title + detail, timestamp right-aligned.
 * "View all alerts →" link at bottom.
 *
 * Icon and color are resolved from alert.category via shared alertStyles config.
 */

function alertIconStyle(alert: AlertEntry): { iconBg: string; iconText: string } {
  return ALERT_CATEGORY_STYLE[alert.category] ?? ALERT_SEV_STYLE[alert.severity];
}

function AlertRow({ alert, last }: { alert: AlertEntry; last: boolean }) {
  const iconKey = ALERT_CATEGORY_ICON[alert.category];
  const Icon = icons[iconKey];
  const style = alertIconStyle(alert);

  return (
    <li className={cn("flex items-start gap-3 py-3 transition-colors duration-150 ease-out motion-safe:hover:bg-bg rounded-inner -mx-1 px-1", !last && "border-b border-border")}>
      {/* Square tinted icon container per spec */}
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
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold text-text leading-tight">{alert.title}</p>
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

export function RecentAlerts({ alerts }: { alerts: AlertEntry[] }) {
  const BellIcon = icons.bell;

  return (
    <Card className="flex flex-col p-5">
      {/* Header: Bell icon + title + "View all alerts" link at right (design_specs §F) */}
      <div className="mb-1 flex items-center gap-2.5">
        <BellIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
        <h2 className="text-[14px] font-semibold text-text">Recent Alerts</h2>
        <Link
          to="/alerts"
          className="ml-auto text-[12px] font-medium text-accent transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:rounded-sm"
        >
          View all alerts →
        </Link>
      </div>

      {alerts.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No recent alerts</p>
      ) : (
        <ul aria-label="Recent alerts">
          {alerts.map((alert, i) => (
            <AlertRow key={alert.id} alert={alert} last={i === alerts.length - 1} />
          ))}
        </ul>
      )}
    </Card>
  );
}

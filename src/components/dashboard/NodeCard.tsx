import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/cn";
import type { NodeData, NodeMetric, NodeMetricKey, StatusLevel } from "@/types/dashboard";

/**
 * Single node monitoring card (SPEC §7, §32.9).
 *
 * Layout matches the approved reference:
 *   - Header: leaf icon + node name/location + status badge
 *   - Primary metrics row: Temperature | Moisture | pH (3 columns, prominent values)
 *   - Divider
 *   - Bottom metadata row: Battery | Signal | Last Sync (compact with icons)
 *
 * All values are mock placeholders (SPEC §32.19).
 */

const METRIC_ICON: Partial<Record<NodeMetricKey, keyof typeof icons>> = {
  temperature: "temperature",
  moisture:    "moisture",
  ph:          "ph",
  battery:     "battery",
  rssi:        "signal",
};

const NODE_STATUS_LEVEL: Record<NodeData["status"], StatusLevel> = {
  online:  "ok",
  warning: "warning",
  offline: "error",
};

const NODE_STATUS_LABEL: Record<NodeData["status"], string> = {
  online:  "Online",
  warning: "Warning",
  offline: "Offline",
};

const METRIC_VALUE_COLOR: Record<string, string> = {
  ok:      "text-text",
  warning: "text-status-warn",
  error:   "text-status-error",
  info:    "text-status-info",
};

const METRIC_LABEL: Record<NodeMetricKey, string> = {
  temperature: "Temp",
  moisture:    "Moisture",
  ph:          "pH",
  battery:     "Battery",
  rssi:        "Signal",
};

/** Primary metric — large value with label below */
function PrimaryMetric({ metric }: { metric: NodeMetric }) {
  const valueColor = metric.status ? (METRIC_VALUE_COLOR[metric.status] ?? "text-text") : "text-text";
  const label = METRIC_LABEL[metric.key];

  return (
    <div className="flex flex-1 flex-col items-center gap-0.5">
      <span className={cn("text-[22px] font-bold tabular-nums leading-none", valueColor)}>
        {metric.value}
        {metric.unit && (
          <span className="ml-0.5 text-sm font-normal text-muted">{metric.unit}</span>
        )}
      </span>
      <span className="text-[11px] text-muted lg:text-[13px]">{label}</span>
    </div>
  );
}

/** Bottom metadata item — icon + value in a compact row */
function MetaItem({ metric }: { metric: NodeMetric }) {
  const iconKey = METRIC_ICON[metric.key];
  const Icon = iconKey ? icons[iconKey] : null;
  const valueColor = metric.status ? (METRIC_VALUE_COLOR[metric.status] ?? "text-muted") : "text-muted";

  return (
    <div className="flex items-center gap-1.5">
      {Icon && (
        <Icon
          className={cn("h-3.5 w-3.5 shrink-0", valueColor)}
          strokeWidth={2}
          aria-hidden
        />
      )}
      <span className={cn("text-[12px] tabular-nums font-medium", valueColor)}>
        {metric.value}{metric.unit}
      </span>
    </div>
  );
}

export function NodeCard({ node }: { node: NodeData }) {
  const statusLevel = NODE_STATUS_LEVEL[node.status];
  const statusLabel = NODE_STATUS_LABEL[node.status];
  const NodeIcon = icons.node; // Cpu — IoT sensor/device identity (blue)

  // Icon container color follows node status: info-blue (online), warn-orange, error-red
  const NODE_ICON_STYLE: Record<NodeData["status"], { bg: string; text: string }> = {
    online:  { bg: "bg-status-info/10",  text: "text-status-info"  },
    warning: { bg: "bg-status-warn/10",  text: "text-status-warn"  },
    offline: { bg: "bg-status-error/10", text: "text-status-error" },
  };
  const iconStyle = NODE_ICON_STYLE[node.status];

  // Split telemetry into primary (temp/moisture/pH) and meta (battery/rssi)
  const PRIMARY_KEYS: NodeMetricKey[] = ["temperature", "moisture", "ph"];
  const META_KEYS: NodeMetricKey[]    = ["battery", "rssi"];

  const primaryMetrics = node.telemetry.filter((m) => PRIMARY_KEYS.includes(m.key));
  const metaMetrics    = node.telemetry.filter((m) => META_KEYS.includes(m.key));

  return (
    <Card className="flex flex-col p-5 gap-3 motion-safe:hover:-translate-y-px motion-safe:hover:shadow-[0_6px_16px_rgba(0,0,0,0.10)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-150 motion-safe:ease-out">
      {/* ── Header: icon + name/location + status ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-inner transition-transform duration-150 ease-out motion-safe:hover:scale-110", iconStyle.bg, iconStyle.text)}>
            <NodeIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-text leading-tight">{node.name}</p>
            <p className="text-[11px] text-muted leading-tight">{node.location}</p>
          </div>
        </div>
        <StatusBadge status={statusLevel} label={statusLabel} className="shrink-0 text-[11px]" />
      </div>

      {/* ── Primary metrics: Temp | Moisture | pH ── */}
      {primaryMetrics.length > 0 && (
        <div className="flex items-stretch divide-x divide-border py-3">
          {primaryMetrics.map((m) => (
            <PrimaryMetric key={m.key} metric={m} />
          ))}
        </div>
      )}

      {/* ── Bottom metadata row ── */}
      {(metaMetrics.length > 0 || node.lastUpdate) && (
        <div className="flex items-center justify-between border-t border-border pt-2">
          <div className="flex items-center gap-3">
            {metaMetrics.map((m) => (
              <MetaItem key={m.key} metric={m} />
            ))}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted lg:text-[13px]">
            <icons.clock className="h-3 w-3" strokeWidth={2} aria-hidden />
            <span className="tabular-nums">{node.lastUpdate}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

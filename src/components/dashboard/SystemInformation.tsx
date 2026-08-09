import { Card } from "@/components/ui/Card";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/cn";
import type { SystemInfoEntry, StatusLevel } from "@/types/dashboard";
import { useWibTime } from "@/hooks/useWibTime";
import { useAutoRefresh } from "@/app/AutoRefreshContext";
import { formatWibTime } from "@/lib/time";

/**
 * System Information panel (design_specs §F).
 *
 * The "Last Sync" row uses lastSyncTime from AutoRefreshContext so it
 * updates whenever a data refresh completes, keeping it in sync with
 * the Sidebar's Last Sync display.
 */

const STATUS_TEXT: Record<StatusLevel, string> = {
  ok:      "text-status-ok",
  warning: "text-status-warn",
  error:   "text-status-error",
  info:    "text-status-info",
};

const ROW_ICON: Record<string, keyof typeof icons> = {
  "sys-fw-version":  "shieldCheck",
  "sys-network":     "wifi",
  "sys-wifi-signal": "signal",
  "sys-last-sync":   "clock",
};

function InfoRow({ entry, last }: { entry: SystemInfoEntry; last: boolean }) {
  const iconKey = (ROW_ICON[entry.id] ?? "info") as keyof typeof icons;
  const Icon = icons[iconKey];

  return (
    <li className={cn("flex items-center gap-3 py-2.5", !last && "border-b border-border")}>
      <Icon className="h-[15px] w-[15px] shrink-0 text-muted" strokeWidth={1.8} aria-hidden />
      <span className="flex-1 text-[13px] text-muted">{entry.label}</span>
      <span
        className={cn(
          "text-[13px] font-semibold tabular-nums",
          entry.status ? STATUS_TEXT[entry.status] : "text-text",
        )}
      >
        {entry.value}
      </span>
    </li>
  );
}

export function SystemInformation({ entries }: { entries: SystemInfoEntry[] }) {
  const InfoIcon = icons.info;
  const { lastSyncTime } = useAutoRefresh();
  const { now: initTime } = useWibTime();

  // Use the last refresh timestamp if available, else fall back to page-load time.
  const syncDate = lastSyncTime ?? initTime;
  const syncStr = formatWibTime(syncDate);

  const resolvedEntries: SystemInfoEntry[] = entries.map((e) =>
    e.id === "sys-last-sync" ? { ...e, value: syncStr } : e
  );

  return (
    <Card className="flex flex-col p-5">
      <div className="mb-1 flex items-center gap-2.5">
        <InfoIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
        <h2 className="text-[14px] font-semibold text-text">System Information</h2>
      </div>

      <ul aria-label="System information">
        {resolvedEntries.map((entry, i) => (
          <InfoRow key={entry.id} entry={entry} last={i === resolvedEntries.length - 1} />
        ))}
      </ul>
    </Card>
  );
}

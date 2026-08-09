import { cn } from "@/lib/cn";
import type { StatusLevel } from "@/types/dashboard";

/**
 * Semantic status badge (SPEC §17, §32.5).
 *
 * Status is conveyed by color + text (never color alone). Colors map to the
 * theme status tokens and keep their meaning across light/dark:
 * ok=green, warning=amber, error=red, info=blue.
 */
const STYLES: Record<StatusLevel, string> = {
  ok: "bg-status-ok/15 text-status-ok",
  warning: "bg-status-warn/15 text-status-warn",
  error: "bg-status-error/15 text-status-error",
  info: "bg-status-info/15 text-status-info",
};

const DOT: Record<StatusLevel, string> = {
  ok: "bg-status-ok",
  warning: "bg-status-warn",
  error: "bg-status-error",
  info: "bg-status-info",
};

interface StatusBadgeProps {
  status: StatusLevel;
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        STYLES[status],
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", DOT[status])} />
      {label}
    </span>
  );
}

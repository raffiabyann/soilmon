import { icons } from "@/lib/icons";
import { useWibTime } from "@/hooks/useWibTime";
import { useAutoRefresh } from "@/app/AutoRefreshContext";
import { formatWibTime } from "@/lib/time";

/**
 * Gateway status card for the lower sidebar (SPEC §32.2, §32.5, design_specs §A).
 *
 * Gateway Online: single line with green dot + bold text (design_specs §A).
 * Auto Refresh: real toggle switch — clicking changes the shared AutoRefreshContext
 * state, which is also reflected in the Header.
 * Last Sync: shows lastSyncTime from context (set after each data refresh),
 * falling back to the current WIB time on first load.
 */

function ToggleSwitch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="shrink-0 cursor-pointer bg-transparent border-0 p-0 leading-none"
      title={on ? "Turn off Auto Refresh" : "Turn on Auto Refresh"}
    >
      <svg width="28" height="16" viewBox="0 0 28 16" aria-hidden>
        <rect
          x="0" y="0" width="28" height="16" rx="8"
          fill={on ? "rgb(var(--color-status-ok))" : "rgba(255,255,255,0.2)"}
        />
        <circle cx={on ? "20" : "8"} cy="8" r="5" fill="white" />
      </svg>
    </button>
  );
}

export function SidebarStatus() {
  const Refresh = icons.autoRefresh;
  const ClockIcon = icons.clock;
  const { enabled, toggle, lastSyncTime } = useAutoRefresh();
  const { now: initTime } = useWibTime();

  // Use lastSyncTime from context if available; otherwise fall back to page-load time.
  const syncDate = lastSyncTime ?? initTime;
  const syncStr = formatWibTime(syncDate);

  return (
    <div className="space-y-2.5 rounded-[8px] border border-white/10 bg-white/10 p-3.5 text-sidebar-text">
      {/* Gateway Online */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-status-ok" aria-hidden />
        <div className="flex min-w-0 flex-col">
          <span className="text-[13px] font-bold tracking-tight text-sidebar-text leading-tight">Gateway Online</span>
          <span className="text-[10px] text-sidebar-text/50 leading-tight tracking-wide">Simulated</span>
        </div>
      </div>

      {/* Last Sync — updates after each data refresh */}
      <div className="flex items-center justify-between text-[11px] text-sidebar-text/60 lg:text-[13px]">
        <span className="flex items-center gap-1.5">
          <ClockIcon className="h-3 w-3" strokeWidth={2} aria-hidden />
          Last Sync
        </span>
        <span className="tabular-nums text-sidebar-text/80">{syncStr}</span>
      </div>

      {/* Auto Refresh — real toggle, shared state with Header */}
      <div className="flex items-center justify-between text-[11px] text-sidebar-text/60 lg:text-[13px]">
        <span className="flex items-center gap-1.5">
          <Refresh className="h-3 w-3" strokeWidth={2} aria-hidden />
          Auto Refresh
        </span>
        <ToggleSwitch on={enabled} onClick={toggle} />
      </div>
    </div>
  );
}

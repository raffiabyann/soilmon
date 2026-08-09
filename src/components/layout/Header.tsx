import { HeaderLogos } from "@/components/layout/HeaderLogos";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { icons } from "@/lib/icons";
import { useWibTime } from "@/hooks/useWibTime";
import { useAutoRefresh } from "@/app/AutoRefreshContext";

/**
 * Structural dashboard header (SPEC §16, §32.3, §32.6).
 *
 * Auto Refresh state is shared via AutoRefreshContext so Header and
 * SidebarStatus always reflect the same enabled/disabled status.
 * Clicking "Auto Refresh ON/OFF" toggles the shared state.
 */
export function Header() {
  const Refresh = icons.autoRefresh;
  const { dateStr, timeStr } = useWibTime();
  const { enabled, toggle } = useAutoRefresh();

  return (
    <header className="flex min-h-[88px] items-center justify-between gap-4 border-b border-border py-3">
      {/* Left: title + subtitle */}
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold tracking-tight text-text">
          Dashboard
        </h1>
        <p className="text-xs text-muted">Monitoring overview</p>
      </div>

      {/* Right group */}
      <div className="flex items-center gap-3">
        <HeaderLogos />

        <span className="h-8 w-px bg-border" aria-hidden />

        {/* Date / time — live WIB clock */}
        <div className="hidden flex-col items-end leading-snug lg:flex">
          <span className="text-[13px] font-medium text-text">{dateStr}</span>
          <span className="text-[11px] tabular-nums text-muted">{timeStr}</span>
        </div>

        <span className="hidden h-8 w-px bg-border lg:block" aria-hidden />

        {/* Auto Refresh — clickable, reflects shared enabled state */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled}
          className="hidden cursor-pointer items-center gap-1.5 rounded-inner bg-transparent border-0 px-2 py-1 transition-colors duration-150 ease-out hover:bg-status-ok/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-ok/40 lg:inline-flex"
          title={enabled ? "Click to turn off Auto Refresh" : "Click to turn on Auto Refresh"}
        >
          <Refresh
            className="h-3.5 w-3.5 text-status-ok"
            strokeWidth={2}
            aria-hidden
          />
          <span className={`text-[13px] ${enabled ? "text-status-ok" : "text-muted"}`}>
            Auto Refresh {enabled ? "ON" : "OFF"}
          </span>
        </button>

        <span className="hidden h-8 w-px bg-border lg:block" aria-hidden />

        {/* Theme label + toggle */}
        <span className="hidden items-center gap-2 lg:inline-flex">
          <span className="text-[13px] text-muted">Theme</span>
          <ThemeToggle />
        </span>
        {/* Mobile: toggle only */}
        <span className="lg:hidden">
          <ThemeToggle />
        </span>
      </div>
    </header>
  );
}

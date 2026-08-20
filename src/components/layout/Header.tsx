import { HeaderLogos } from "@/components/layout/HeaderLogos";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { icons } from "@/lib/icons";
import { useWibTime } from "@/hooks/useWibTime";
import { useAutoRefresh } from "@/app/AutoRefreshContext";

interface HeaderProps {
  /** Called when the hamburger button is pressed (mobile only). */
  onMenuOpen?: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
  const Refresh = icons.autoRefresh;
  const { dateStr, timeStr } = useWibTime();
  const { enabled, toggle } = useAutoRefresh();

  return (
    <header className="flex min-h-[64px] items-center gap-2 border-b border-border py-2 lg:min-h-[88px] lg:gap-4 lg:py-3">

      {/* Hamburger — mobile only, fixed width */}
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-inner text-muted transition-colors duration-150 hover:bg-border/20 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 lg:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <line x1="2" y1="4" x2="16" y2="4" />
          <line x1="2" y1="9" x2="16" y2="9" />
          <line x1="2" y1="14" x2="16" y2="14" />
        </svg>
      </button>

      {/* Title — flex-1 so it takes available space and never gets clipped */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-semibold tracking-tight text-text lg:text-[22px]">
          Dashboard
        </h1>
        <p className="hidden text-xs text-muted lg:block lg:text-sm">Monitoring overview</p>
      </div>

      {/* Compact Auto Refresh — mobile only, icon + state label */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        title={enabled ? "Click to turn off Auto Refresh" : "Click to turn on Auto Refresh"}
        className="flex shrink-0 items-center gap-1 rounded-inner bg-transparent border-0 px-1.5 py-1 text-[11px] font-medium transition-colors duration-150 hover:bg-status-ok/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-ok/40 lg:hidden"
      >
        <Refresh
          className="h-3 w-3 shrink-0 text-status-ok"
          strokeWidth={2}
          aria-hidden
        />
        <span className={enabled ? "text-status-ok" : "text-muted"}>
          {enabled ? "ON" : "OFF"}
        </span>
      </button>

      {/* Logos — always visible, smaller on mobile */}
      <div className="shrink-0">
        <HeaderLogos />
      </div>

      {/* Desktop-only divider + date/time */}
      <span className="hidden h-8 w-px bg-border lg:block" aria-hidden />
      <div className="hidden flex-col items-end leading-snug lg:flex">
        <span className="text-[13px] font-medium text-text">{dateStr}</span>
        <span className="text-[11px] tabular-nums text-muted">{timeStr}</span>
      </div>

      {/* Desktop-only divider + Auto Refresh full button */}
      <span className="hidden h-8 w-px bg-border lg:block" aria-hidden />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        className="hidden cursor-pointer items-center gap-1.5 rounded-inner bg-transparent border-0 px-2 py-1 transition-colors duration-150 ease-out hover:bg-status-ok/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-ok/40 lg:inline-flex"
        title={enabled ? "Click to turn off Auto Refresh" : "Click to turn on Auto Refresh"}
      >
        <Refresh className="h-3.5 w-3.5 text-status-ok" strokeWidth={2} aria-hidden />
        <span className={`text-[13px] ${enabled ? "text-status-ok" : "text-muted"}`}>
          Auto Refresh {enabled ? "ON" : "OFF"}
        </span>
      </button>

      {/* Desktop-only divider + theme label */}
      <span className="hidden h-8 w-px bg-border lg:block" aria-hidden />
      <span className="hidden items-center gap-2 lg:inline-flex">
        <span className="text-[13px] text-muted">Theme</span>
        <ThemeToggle />
      </span>

      {/* Mobile theme toggle — standalone */}
      <span className="shrink-0 lg:hidden">
        <ThemeToggle />
      </span>
    </header>
  );
}

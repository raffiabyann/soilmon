import { Card } from "@/components/ui/Card";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/cn";
import type { KpiCard } from "@/types/dashboard";

/**
 * Tiny inline sparkline for the Data Trend card (SPEC design_specs §C.3).
 * Pure SVG — no chart library dependency for this micro-element.
 * Green upward line matching the spec's "grafik garis sparkline hijau kecil".
 */
function SparklineTrend() {
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-status-ok"
    >
      <polyline
        points="0,20 8,16 16,18 24,12 32,8 40,4 48,2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * KPI summary card (SPEC §32.7, design_specs §C).
 *
 * Layout per spec: icon on the LEFT in a tinted square container,
 * label + value + secondary to the right of it.
 *
 * Icon colors per spec:
 *   Gateway  → green  (status-ok)
 *   Database → blue   (status-info)
 *   Chart    → green  (status-ok / accent)
 *   Clock    → purple (status-purple)
 *
 * Value colors per spec:
 *   Gateway  "Online"  → green
 *   Trend    "+12.4%"  → green
 *   Others            → slate-800 (text)
 */

const ICON_MAP = {
  gateway:  icons.gateway,
  history:  icons.history,
  chart:    icons.chart,
  signal:   icons.signal,
  database: icons.database,
  activity: icons.activity,
  trendUp:  icons.trendUp,
  clock4:   icons.clock4,
} as const;

const TREND_ICON = {
  up:   icons.trendArrowUp,
  down: icons.trendDown,
  flat: icons.trendFlat,
} as const;

/** Icon container + icon color per card */
const ICON_STYLE: Record<string, { bg: string; text: string }> = {
  gateway:  { bg: "bg-status-ok/10",     text: "text-status-ok"     },
  database: { bg: "bg-status-info/10",   text: "text-status-info"   },
  chart:    { bg: "bg-status-ok/10",     text: "text-status-ok"     },
  clock4:   { bg: "bg-status-purple/10", text: "text-status-purple" },
  activity: { bg: "bg-status-ok/10",     text: "text-status-ok"     },
  signal:   { bg: "bg-status-info/10",   text: "text-status-info"   },
  trendUp:  { bg: "bg-status-ok/10",     text: "text-status-ok"     },
  history:  { bg: "bg-status-info/10",   text: "text-status-info"   },
};

/** Value text color per card */
function valueColor(card: KpiCard): string {
  if (card.icon === "gateway") return "text-status-ok";
  if (card.icon === "chart" && card.trend === "up") return "text-status-ok";
  return "text-text";
}

export function MetricCard({ card }: { card: KpiCard }) {
  const Icon = ICON_MAP[card.icon as keyof typeof ICON_MAP] ?? icons.activity;
  const style = ICON_STYLE[card.icon] ?? { bg: "bg-accent/10", text: "text-accent" };
  const TrendIcon = card.trend ? TREND_ICON[card.trend] : null;

  // Right-edge decorations per spec design_specs §C:
  // Card 2 (database): small blue bar-chart icon
  // Card 3 (chart):    small green sparkline
  const showBarChart = card.icon === "database";
  const showSparkline = card.icon === "chart";

  return (
    <Card className="flex min-h-[120px] items-center gap-4 px-5 py-5 motion-safe:hover:-translate-y-px motion-safe:hover:shadow-[0_6px_16px_rgba(0,0,0,0.10)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-150 motion-safe:ease-out">
      {/* Left: icon in tinted square */}
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-inner transition-transform duration-150 ease-out motion-safe:hover:scale-110",
          style.bg, style.text,
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden />
      </span>

      {/* Center: label / value / secondary */}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-muted">{card.label}</p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className={cn("text-[26px] font-bold leading-none tabular-nums", valueColor(card))}>
            {card.value}
          </span>
          {TrendIcon && (
            <span className={cn("inline-flex items-center text-[13px] font-semibold", valueColor(card))}>
              <TrendIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </span>
          )}
        </div>
        {card.secondary && (
          <p className="mt-0.5 text-[11px] text-muted">{card.secondary}</p>
        )}
      </div>

      {/* Right-edge decoration (spec design_specs §C.2 and §C.3) */}
      {showBarChart && (
        <icons.barChart
          className="h-5 w-5 shrink-0 text-status-info"
          strokeWidth={1.5}
          aria-hidden
        />
      )}
      {showSparkline && <SparklineTrend />}
    </Card>
  );
}

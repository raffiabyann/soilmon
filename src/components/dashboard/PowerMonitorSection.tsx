import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/cn";
import type { PowerData, PowerChargingStatus, StatusLevel } from "@/types/dashboard";

/**
 * Power Monitor section — solar panel & battery overview.
 *
 * Displays four live stat tiles (Battery %, Solar Input, Voltage, Current)
 * and a 24-hour area chart of solar output vs battery level.
 *
 * Data source: PowerData from the dashboard adapter (mock during development).
 * All values are simulated placeholders — NOT confirmed hardware specs.
 * TBD(hardware): units, nominal ranges, and charging status logic must be
 * revisited once the power monitoring hardware contract is defined.
 *
 * Design follows the existing SoilMon dashboard patterns:
 * - Card + p-5 padding
 * - text-sm / text-[11px] typography scale
 * - Design token colors (no hard-coded hex)
 * - Recharts ComposedChart (same library as EnvironmentalChart)
 * - StatusBadge for charging status
 * - icons registry — no direct lucide imports
 */

// ─── Color tokens (match EnvironmentalChart convention) ──────────────────────
const SOLAR_COLOR   = "rgb(var(--color-status-warn))";   // amber — daylight/energy
const BATTERY_COLOR = "rgb(var(--color-status-info))";   // blue  — stored charge
const AXIS_COLOR = "rgb(var(--color-text-muted))";
const GRID_COLOR = "rgb(var(--color-border))";

// ─── Charging status → StatusBadge mapping ───────────────────────────────────
const CHARGING_STATUS_LEVEL: Record<PowerChargingStatus, StatusLevel> = {
  charging: "ok",
  full:     "ok",
  idle:     "info",
  low:      "warning",
};

const CHARGING_STATUS_LABEL: Record<PowerChargingStatus, string> = {
  charging: "Charging",
  full:     "Full",
  idle:     "Idle",
  low:      "Low Battery",
};

// ─── Chart legend items ───────────────────────────────────────────────────────
const POWER_METRICS = [
  { label: "Solar Input (W)", color: SOLAR_COLOR   },
  { label: "Battery (%)",     color: BATTERY_COLOR },
];

// ─── Stat tile ────────────────────────────────────────────────────────────────
interface StatTileProps {
  icon: keyof typeof icons;
  label: string;
  value: string;
  unit: string;
}

function StatTile({ icon, label, value, unit }: StatTileProps) {
  const Icon = icons[icon];
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.8} aria-hidden />
        <span className="text-[11px] text-muted truncate">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold tabular-nums leading-none text-text">
          {value}
        </span>
        <span className="text-sm font-normal text-muted">{unit}</span>
      </div>
    </div>
  );
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────
function PowerTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-inner border border-border bg-surface px-3 py-2 text-[11px] shadow-card">
      <p className="mb-1 font-medium text-text">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="tabular-nums">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── Chart ───────────────────────────────────────────────────────────────────
function PowerChart({ data }: { data: PowerData["history"] }) {
  return (
    <div className="h-[180px] w-full sm:h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 4, right: 20, bottom: 0, left: -4 }}
        >
          <defs>
            <linearGradient id="fill-solar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={SOLAR_COLOR}   stopOpacity={0.15} />
              <stop offset="95%" stopColor={SOLAR_COLOR}   stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="fill-battery" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={BATTERY_COLOR} stopOpacity={0.12} />
              <stop offset="95%" stopColor={BATTERY_COLOR} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID_COLOR}
            strokeOpacity={0.5}
            vertical={false}
          />

          {/* X axis — hourly ticks every 4 hours, same as EnvironmentalChart */}
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: AXIS_COLOR }}
            tickLine={false}
            axisLine={{ stroke: GRID_COLOR }}
            ticks={["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]}
          />

          {/* Left axis — solar watts. Domain open-ended; TBD(hardware). */}
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 10, fill: AXIS_COLOR }}
            tickLine={false}
            axisLine={false}
            domain={[0, 140]}
            tickFormatter={(v: number) => `${v}W`}
            width={44}
          />

          {/* Right axis — battery percent */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: AXIS_COLOR }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            width={34}
          />

          <Tooltip content={<PowerTooltip />} />

          {/* Solar input area */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="solarWatts"
            name="Solar Input (W)"
            stroke={SOLAR_COLOR}
            strokeWidth={2}
            fill="url(#fill-solar)"
            dot={false}
            activeDot={{ r: 3.5, strokeWidth: 0, fill: SOLAR_COLOR }}
            isAnimationActive={false}
          />

          {/* Battery level area */}
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="batteryPercent"
            name="Battery (%)"
            stroke={BATTERY_COLOR}
            strokeWidth={2}
            fill="url(#fill-battery)"
            dot={false}
            activeDot={{ r: 3.5, strokeWidth: 0, fill: BATTERY_COLOR }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
interface PowerMonitorSectionProps {
  data: PowerData;
}

export function PowerMonitorSection({ data }: PowerMonitorSectionProps) {
  const SolarIcon = icons.solar;
  const statusLevel  = CHARGING_STATUS_LEVEL[data.chargingStatus];
  const statusLabel  = CHARGING_STATUS_LABEL[data.chargingStatus];

  return (
    <Card className="p-5">
      {/* ── Header ── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <SolarIcon
              className="h-4 w-4 shrink-0 text-muted"
              strokeWidth={1.8}
              aria-hidden
            />
            <h2 className="text-sm font-semibold text-text leading-tight">
              Power Monitor
            </h2>
            <StatusBadge status={statusLevel} label={statusLabel} />
          </div>
          <p className="mt-0.5 text-[11px] text-muted leading-tight">
            Solar panel &amp; battery — simulated data
          </p>
        </div>

        {/* Chart legend — hidden on small screens to avoid overflow */}
        <ul className="hidden items-center gap-4 md:flex" aria-hidden>
          {POWER_METRICS.map((m) => (
            <li key={m.label} className="flex items-center gap-1.5 text-[11px] text-muted">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.label}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Stat tiles — responsive grid ── */}
      {/*
        2 columns on mobile, 4 on sm+.
        Uses divide-x on sm+ for the separator lines seen on NodeCard.
        On mobile the grid gap serves as visual separation.
      */}
      <div
        className={cn(
          "mb-4 grid grid-cols-2 gap-x-4 gap-y-4",
          "sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-border",
        )}
        role="list"
        aria-label="Power metrics"
      >
        <div role="listitem" className="sm:pr-4">
          <StatTile
            icon="battery"
            label="Battery"
            value={String(data.batteryPercent)}
            unit="%"
          />
        </div>
        <div role="listitem" className="sm:px-4">
          <StatTile
            icon="solar"
            label="Solar Input"
            value={String(data.solarInputWatts)}
            unit="W"
          />
        </div>
        <div role="listitem" className="sm:px-4">
          <StatTile
            icon="zap"
            label="Voltage"
            value={String(data.voltage)}
            unit="V"
          />
        </div>
        <div role="listitem" className="sm:pl-4">
          <StatTile
            icon="zap"
            label="Current"
            value={String(data.current)}
            unit="A"
          />
        </div>
      </div>

      {/* ── 24-hour chart ── */}
      <div className="border-t border-border pt-4">
        {/* Mobile legend shown above chart since header legend is hidden */}
        <ul className="mb-2 flex items-center gap-4 md:hidden" aria-hidden>
          {POWER_METRICS.map((m) => (
            <li key={m.label} className="flex items-center gap-1.5 text-[11px] text-muted">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.label}
            </li>
          ))}
        </ul>
        <PowerChart data={data.history} />
      </div>
    </Card>
  );
}

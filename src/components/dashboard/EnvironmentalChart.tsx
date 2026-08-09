import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EnvironmentalPoint } from "@/types/dashboard";

/**
 * Environmental Overview chart (SPEC §8, §32.8).
 *
 * Consumes the points prop from the dashboard data pipeline.
 * All visual configuration (axes, colors, lines, fills) is preserved.
 * The data source is props.points — no internal fallback dataset.
 */

const TEMP_COLOR     = "rgb(var(--color-accent))";        // green
const MOISTURE_COLOR = "rgb(var(--color-status-info))";   // blue
const PH_COLOR       = "rgb(var(--color-status-warn))";   // amber/orange

const AXIS_COLOR    = "rgb(var(--color-text-muted))";
const GRID_COLOR    = "rgb(var(--color-border))";
const SURFACE_COLOR = "rgb(var(--color-surface))";

/** Exported so the section header can render a matching legend. */
export const ENVIRONMENTAL_METRICS = [
  { label: "Temperature (°C)", color: TEMP_COLOR     },
  { label: "Moisture (%)",     color: MOISTURE_COLOR },
  { label: "pH",               color: PH_COLOR       },
];

export function EnvironmentalChart({ points }: { points: EnvironmentalPoint[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={points}
          margin={{ top: 4, right: 20, bottom: 0, left: -8 }}
        >
          <defs>
            <linearGradient id="fill-temperature" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={TEMP_COLOR}     stopOpacity={0.15} />
              <stop offset="95%" stopColor={TEMP_COLOR}     stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="fill-moisture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={MOISTURE_COLOR} stopOpacity={0.12} />
              <stop offset="95%" stopColor={MOISTURE_COLOR} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID_COLOR}
            strokeOpacity={0.5}
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: AXIS_COLOR }}
            tickLine={false}
            axisLine={{ stroke: GRID_COLOR }}
            ticks={["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"]}
            dy={4}
          />

          {/* Left axis: 0–40 for temperature and moisture */}
          <YAxis
            yAxisId="left"
            domain={[0, 40]}
            ticks={[0, 10, 20, 30, 40]}
            tick={{ fontSize: 10, fill: AXIS_COLOR }}
            tickLine={false}
            axisLine={false}
            width={32}
          />

          {/* Right axis: 0–14 for pH */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 14]}
            ticks={[0, 3.5, 7, 10.5, 14]}
            tick={{ fontSize: 10, fill: AXIS_COLOR }}
            tickLine={false}
            axisLine={false}
            width={32}
          />

          <Tooltip
            contentStyle={{
              background: SURFACE_COLOR,
              border: `1px solid ${GRID_COLOR}`,
              borderRadius: "8px",
              fontSize: "11px",
              padding: "8px 12px",
            }}
            itemStyle={{ color: AXIS_COLOR }}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />

          {/* Area fills */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="none"
            fill="url(#fill-temperature)"
            isAnimationActive={false}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="moisture"
            stroke="none"
            fill="url(#fill-moisture)"
            isAnimationActive={false}
          />

          {/* Temperature line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            name="Temperature (°C)"
            stroke={TEMP_COLOR}
            strokeWidth={2}
            dot={{ r: 2, stroke: TEMP_COLOR, fill: SURFACE_COLOR, strokeWidth: 1.5 }}
            activeDot={{ r: 3.5, strokeWidth: 0, fill: TEMP_COLOR }}
            isAnimationActive={false}
          />

          {/* Moisture line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="moisture"
            name="Moisture (%)"
            stroke={MOISTURE_COLOR}
            strokeWidth={2}
            dot={{ r: 2, stroke: MOISTURE_COLOR, fill: SURFACE_COLOR, strokeWidth: 1.5 }}
            activeDot={{ r: 3.5, strokeWidth: 0, fill: MOISTURE_COLOR }}
            isAnimationActive={false}
          />

          {/* pH line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="ph"
            name="pH"
            stroke={PH_COLOR}
            strokeWidth={2}
            dot={{ r: 2, stroke: PH_COLOR, fill: SURFACE_COLOR, strokeWidth: 1.5 }}
            activeDot={{ r: 3.5, strokeWidth: 0, fill: PH_COLOR }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

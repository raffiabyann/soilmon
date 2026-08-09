import { Card } from "@/components/ui/Card";
import {
  EnvironmentalChart,
  ENVIRONMENTAL_METRICS,
} from "@/components/dashboard/EnvironmentalChart";
import type { EnvironmentalSeries } from "@/types/dashboard";

/**
 * Environmental Overview section (SPEC §8, §32.8).
 *
 * Full-width card below the KPI row. Compact header: title + legend + range
 * selector. Chart height is restrained so the rest of the dashboard stays
 * visible within the initial viewport.
 */
export function EnvironmentalOverview({ series }: { series: EnvironmentalSeries }) {
  return (
    <Card className="p-5">
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {/* Title — no icon box per design_specs §D */}
        <div>
          <h2 className="text-sm font-semibold text-text leading-tight">
            Environmental Overview (24 Hours)
          </h2>
          <p className="text-[11px] text-muted leading-tight">Soil &amp; environmental trend</p>
        </div>

        {/* Legend + range selector */}
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-4 md:flex">
            {ENVIRONMENTAL_METRICS.map((m) => (
              <li key={m.label} className="flex items-center gap-1.5 text-[11px] text-muted">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: m.color }}
                />
                {m.label}
              </li>
            ))}
          </ul>
          <div className="inline-flex rounded-inner border border-border p-0.5">
            <span className="rounded-[6px] bg-accent px-2.5 py-1 text-[11px] font-medium text-white">
              24 Hours
            </span>
          </div>
        </div>
      </div>

      <EnvironmentalChart points={series.points} />
    </Card>
  );
}

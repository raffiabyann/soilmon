import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { useAnalytics } from "@/hooks/useAnalytics";
import { METRIC_LABEL, METRIC_ICON, STATUS_LABEL } from "@/lib/metricConfig";
import type { MetricStats, NodeSummary, CrossNodeRanking } from "@/lib/analytics";
import type { TrendDirection } from "@/types/dashboard";

/**
 * Reports & Analytics page.
 *
 * Presents deterministic statistical analysis of the 24-hour telemetry history.
 * All insights are traceable to specific calculations in src/lib/analytics.ts.
 *
 * Sections:
 *   1. Disclaimer banner (always shown when isMockData = true)
 *   2. Node Summaries — per-node stats: min/max/mean, trend, anomaly count
 *   3. Cross-Node Comparison — one card per metric, nodes ranked by current value
 *
 * What is deliberately NOT here:
 * - No KPI cards (those are on the Dashboard)
 * - No live charts (those are on the Dashboard)
 * - No AI labels, confidence scores, or recommendation language
 * - No chatbot UI
 * - No date range picker or export
 */

// ─── Trend icon and label ─────────────────────────────────────────────────────

function TrendIndicator({ trend }: { trend: TrendDirection | null }) {
  if (trend === null) {
    return <span className="text-[11px] text-muted">—</span>;
  }

  if (trend === "up") {
    const Icon = icons.trendArrowUp;
    return (
      <span className="inline-flex items-center gap-0.5 text-status-ok" title="Trending up">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        <span className="sr-only">Trending up</span>
      </span>
    );
  }

  if (trend === "down") {
    const Icon = icons.trendDown;
    return (
      <span className="inline-flex items-center gap-0.5 text-status-error" title="Trending down">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        <span className="sr-only">Trending down</span>
      </span>
    );
  }

  // flat
  const Icon = icons.trendFlat;
  return (
    <span className="inline-flex items-center gap-0.5 text-muted" title="Stable">
      <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      <span className="sr-only">Stable</span>
    </span>
  );
}

// ─── Metric stats row ─────────────────────────────────────────────────────────

function MetricStatsRow({
  stats,
  last,
  isMockData,
}: {
  stats: MetricStats;
  last: boolean;
  isMockData: boolean;
}) {
  const MetricIcon = icons[METRIC_ICON[stats.metric]];
  const u = stats.unit;

  return (
    <li className={cn("flex items-center gap-3 py-2.5", !last && "border-b border-border")}>
      <MetricIcon className="h-[15px] w-[15px] shrink-0 text-muted" strokeWidth={1.8} aria-hidden />

      {/* Metric name */}
      <span className="w-[80px] shrink-0 text-[13px] text-muted">
        {METRIC_LABEL[stats.metric]}
      </span>

      {/* Min | Avg | Max — three cells with vertical pipe separators */}
      <div className="flex min-w-0 flex-1 items-center divide-x divide-border text-[13px] tabular-nums">
        <div className="flex flex-col items-end pr-3 min-w-0">
          <span className="text-[10px] uppercase tracking-wide text-muted leading-tight">Min</span>
          <span className="text-muted">{stats.min}{u}</span>
        </div>
        <div className="flex flex-col items-center px-3 min-w-0">
          <span className="text-[10px] uppercase tracking-wide text-muted leading-tight">Avg</span>
          <span className="font-medium text-text">{stats.mean}{u}</span>
        </div>
        <div className="flex flex-col items-start pl-3 min-w-0">
          <span className="text-[10px] uppercase tracking-wide text-muted leading-tight">Max</span>
          <span className="text-muted">{stats.max}{u}</span>
        </div>
      </div>

      {/* Trend */}
      <div className="shrink-0 w-5 flex justify-center">
        <TrendIndicator trend={stats.trend} />
      </div>

      {/* Anomaly badge — suppressed when isMockData because anomaly counts are
          derived from hardcoded mock statuses, not real threshold-based detection.
          Will be re-enabled once real alert/threshold rules are confirmed. */}
      {!isMockData && (
        <div className="shrink-0 flex justify-end">
          {stats.anomalyCount > 0 ? (
            <StatusBadge
              status={stats.worstStatus}
              label={`${stats.anomalyCount}× anomaly`}
            />
          ) : (
            <StatusBadge status="ok" label="OK" />
          )}
        </div>
      )}
    </li>
  );
}

// ─── Node summary card ────────────────────────────────────────────────────────

function NodeSummaryCard({
  summary,
  isMockData,
}: {
  summary: NodeSummary;
  isMockData: boolean;
}) {
  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-text leading-tight truncate">
            {summary.nodeName}
          </p>
          <p className="text-[12px] text-muted leading-tight">{summary.nodeLocation}</p>
        </div>
        <StatusBadge
          status={summary.overallStatus}
          label={STATUS_LABEL[summary.overallStatus]}
          className="shrink-0"
        />
      </div>

      {/* Column headers */}
      <div className="mb-1 flex items-center gap-3 pb-1 border-b border-border">
        <span className="w-[15px] shrink-0" />
        <span className="w-[80px] shrink-0 text-[10px] uppercase tracking-wide text-muted">
          Metrik
        </span>
        <span className="flex-1 text-[10px] uppercase tracking-wide text-muted">
          Min / Avg / Max
        </span>
        <span className="w-5 shrink-0 text-center text-[10px] uppercase tracking-wide text-muted">
          Trend
        </span>
      </div>

      <ul aria-label={`Metric stats for ${summary.nodeName}`}>
        {summary.metricStats.map((stats, i) => (
          <MetricStatsRow
            key={stats.metric}
            stats={stats}
            last={i === summary.metricStats.length - 1}
            isMockData={isMockData}
          />
        ))}
      </ul>
    </Card>
  );
}

// ─── Cross-node comparison card ───────────────────────────────────────────────

function CrossNodeCard({ ranking }: { ranking: CrossNodeRanking }) {
  const MetricIcon = icons[METRIC_ICON[ranking.metric]];
  const highest = ranking.ranked[0]?.value ?? 0;

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <MetricIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.8} aria-hidden />
        <h3 className="text-[13px] font-semibold text-text">
          {METRIC_LABEL[ranking.metric]}
        </h3>
        <span className="text-[12px] text-muted">— perbandingan antar node</span>
      </div>

      <ul aria-label={`Cross-node comparison: ${METRIC_LABEL[ranking.metric]}`}>
        {ranking.ranked.map((entry, i) => {
          // Bar width proportional to value vs highest; for negative values (rssi) use absolute
          const absHighest = Math.abs(highest) || 1;
          const absValue   = Math.abs(entry.value);
          const barPct = Math.round((absValue / absHighest) * 100);

          return (
            <li
              key={entry.nodeId}
              className={cn(
                "flex items-center gap-3 py-2",
                i < ranking.ranked.length - 1 && "border-b border-border",
              )}
            >
              {/* Rank */}
              <span className="w-4 shrink-0 text-[12px] tabular-nums text-muted text-center">
                {i + 1}
              </span>

              {/* Node name */}
              <div className="w-[80px] shrink-0">
                <span className="text-[13px] font-medium text-text">{entry.nodeName}</span>
                <span className="hidden text-[11px] text-muted sm:block truncate">
                  {entry.nodeLocation}
                </span>
              </div>

              {/* Proportional bar */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent/60 transition-none"
                    style={{ width: `${barPct}%` }}
                    aria-hidden
                  />
                </div>
                <span className="shrink-0 text-[13px] tabular-nums text-text w-[52px] text-right">
                  {entry.value}{ranking.unit}
                </span>
              </div>

              {/* Status */}
              <div className="shrink-0">
                <StatusBadge
                  status={entry.status}
                  label={STATUS_LABEL[entry.status]}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// ─── Disclaimer banner ────────────────────────────────────────────────────────

function MockDataBanner() {
  const InfoIcon = icons.info;
  return (
    <div className="flex items-start gap-2.5 rounded-inner border border-border bg-surface px-4 py-3">
      <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
      <p className="text-[13px] text-muted leading-relaxed">
        Analisis ini dihitung dari <strong className="text-text font-medium">simulated data</strong> — bukan pembacaan sensor nyata.
        Semua nilai, tren, dan anomali bersifat ilustratif.
        Hasil akan akurat setelah data sensor nyata dari gateway tersedia.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const report = useAnalytics();
  const BarChartIcon = icons.barChart;

  if (!report) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold text-text leading-tight">
            Reports &amp; Analytics
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            Analisis statistik data telemetri 24 jam
          </p>
        </div>
        <Card className="p-5">
          <p className="py-10 text-center text-sm text-muted">
            Data historis belum tersedia — analisis tidak dapat dihitung.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-[22px] font-semibold text-text leading-tight">
          Reports &amp; Analytics
        </h1>
        <p className="mt-0.5 text-sm text-muted">
          Analisis statistik {report.totalRecords} pembacaan sensor dalam 24 jam terakhir
        </p>
      </div>

      {/* Disclaimer — always shown while data is mock */}
      {report.isMockData && <MockDataBanner />}

      {/* Node summaries */}
      <section aria-label="Node summaries">
        <div className="mb-3 flex items-center gap-2">
          <BarChartIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
          <h2 className="text-sm font-semibold text-text">Ringkasan per Node</h2>
          <span className="text-[12px] text-muted">min · rata-rata · max (24 jam)</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {report.nodeSummaries.map((summary) => (
            <NodeSummaryCard
              key={summary.nodeId}
              summary={summary}
              isMockData={report.isMockData}
            />
          ))}
        </div>
      </section>

      {/* Cross-node comparison */}
      <section aria-label="Cross-node comparison">
        <div className="mb-3 flex items-center gap-2">
          <BarChartIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
          <h2 className="text-sm font-semibold text-text">Perbandingan Antar Node</h2>
          <span className="text-[12px] text-muted">nilai terkini, tertinggi ke terendah</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {report.crossNodeComparisons.map((ranking) => (
            <CrossNodeCard key={ranking.metric} ranking={ranking} />
          ))}
        </div>
      </section>
    </div>
  );
}

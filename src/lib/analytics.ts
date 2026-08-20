/**
 * SoilMon analytics engine — pure computation, no React.
 *
 * All functions take typed data model inputs and return typed outputs.
 * No side effects, no imports from components or hooks.
 *
 * Design principles:
 * - Every output value is traceable to a specific calculation on real input data.
 * - If data is insufficient, functions return null rather than fabricating results.
 * - No invented thresholds, no domain heuristics, no confidence scores.
 * - No AI/LLM calls — all analysis is deterministic statistical computation.
 * - The seam is clean: when real backend data replaces mock data, these
 *   functions produce real analysis without modification.
 *
 * Analyses implemented:
 *   1. Descriptive stats per node per metric (min, max, mean, range) over 24h history
 *   2. Trend direction: last 6 readings vs previous 6 readings (mean delta)
 *   3. Anomaly count: readings where status !== "ok" per node per metric
 *   4. Cross-node comparison: rank nodes by current telemetry value per metric
 */

import type {
  NodeData,
  NodeMetricKey,
  StatusLevel,
  TelemetryRecord,
  TrendDirection,
} from "@/types/dashboard";

// ─── Output types ─────────────────────────────────────────────────────────────

/**
 * Descriptive statistics + trend for a single node+metric combination.
 * Derived from TelemetryRecord history (24h window).
 */
export interface MetricStats {
  metric: NodeMetricKey;
  unit: string;
  /** Number of records used for this calculation. */
  sampleCount: number;
  min: number;
  max: number;
  /** Arithmetic mean over all samples, rounded to 1 decimal. */
  mean: number;
  /** Latest (most recent) recorded value. */
  latest: number;
  /**
   * Trend direction: comparison of mean(last 6 samples) vs mean(previous 6 samples).
   * "up"   — last 6 mean > prev 6 mean by more than TREND_THRESHOLD
   * "down" — last 6 mean < prev 6 mean by more than TREND_THRESHOLD
   * "flat" — difference within TREND_THRESHOLD
   * null   — insufficient data (fewer than 12 samples)
   */
  trend: TrendDirection | null;
  /**
   * Count of readings where status !== "ok".
   * Reflects the status field from TelemetryRecord — which in mock data is
   * derived from hardcoded node status, NOT from real computed thresholds.
   */
  anomalyCount: number;
  /** Worst status across all readings for this node+metric. */
  worstStatus: StatusLevel;
}

/**
 * Aggregated analysis for a single node across all its metrics.
 */
export interface NodeSummary {
  nodeId: string;
  nodeName: string;
  nodeLocation: string;
  /** Worst status across all MetricStats for this node. */
  overallStatus: StatusLevel;
  metricStats: MetricStats[];
}

/**
 * Cross-node comparison for a single metric: nodes ranked by current value.
 * "Current value" is the latest telemetry reading from NodeData (live snapshot),
 * not the historical mean — so the ranking reflects current conditions.
 */
export interface CrossNodeRanking {
  metric: NodeMetricKey;
  unit: string;
  /**
   * Nodes sorted from highest to lowest current value.
   * Each entry includes the current value and its status from live telemetry.
   */
  ranked: {
    nodeId: string;
    nodeName: string;
    nodeLocation: string;
    value: number;
    status: StatusLevel;
  }[];
}

/**
 * Complete analytics report produced from DashboardData.
 *
 * isMockData: always true until the gateway data contract is confirmed.
 * The UI must display a disclaimer when this is true.
 */
export interface AnalyticsReport {
  /** Epoch ms when this report was computed. */
  generatedAt: number;
  /**
   * True when the underlying data is synthetic mock data.
   * The UI must show a clear disclaimer when true — analysis results
   * on mock data are illustrative only.
   */
  isMockData: boolean;
  /** Total number of TelemetryRecord inputs used. */
  totalRecords: number;
  /** Per-node summaries, one per node in nodes[]. */
  nodeSummaries: NodeSummary[];
  /** Cross-node comparison, one per metric. */
  crossNodeComparisons: CrossNodeRanking[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Minimum absolute difference between last-6 and prev-6 means
 * to be classified as "up" or "down" rather than "flat".
 *
 * Set conservatively low so we detect genuine diurnal variation
 * without inventing signal from noise. Not a domain threshold —
 * purely a trend-detection sensitivity parameter.
 */
const TREND_THRESHOLD = 0.1;

/** Minimum total samples required to compute a trend direction. */
const MIN_SAMPLES_FOR_TREND = 12;

// ─── Status ordering (for worst-status aggregation) ──────────────────────────

const STATUS_SEVERITY: Record<StatusLevel, number> = {
  ok:      0,
  info:    1,
  warning: 2,
  error:   3,
};

function worstOf(a: StatusLevel, b: StatusLevel): StatusLevel {
  return STATUS_SEVERITY[a] >= STATUS_SEVERITY[b] ? a : b;
}

// ─── Core computation functions ───────────────────────────────────────────────

/**
 * Compute descriptive statistics and trend for a set of TelemetryRecord values
 * belonging to a single node+metric combination.
 *
 * Records must be pre-filtered to the correct nodeId and metric, and
 * sorted newest-first (as produced by buildTelemetryHistory).
 *
 * Returns null if records is empty.
 */
function computeMetricStats(
  records: TelemetryRecord[],
): MetricStats | null {
  if (records.length === 0) return null;

  const values = records.map((r) => r.value);
  const min  = Math.round(Math.min(...values) * 10) / 10;
  const max  = Math.round(Math.max(...values) * 10) / 10;
  const mean = Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10;
  // records are newest-first, so index 0 is the latest
  const latest = values[0];

  // Trend: compare mean of last 6 (newest) vs mean of previous 6
  let trend: TrendDirection | null = null;
  if (records.length >= MIN_SAMPLES_FOR_TREND) {
    // newest-first: [0..5] = most recent 6, [6..11] = previous 6
    const last6  = values.slice(0, 6);
    const prev6  = values.slice(6, 12);
    const meanLast = last6.reduce((s, v) => s + v, 0) / 6;
    const meanPrev = prev6.reduce((s, v) => s + v, 0) / 6;
    const delta = meanLast - meanPrev;
    if (delta > TREND_THRESHOLD)       trend = "up";
    else if (delta < -TREND_THRESHOLD) trend = "down";
    else                               trend = "flat";
  }

  // Anomaly count and worst status
  let anomalyCount = 0;
  let worstStatus: StatusLevel = "ok";
  for (const r of records) {
    if (r.status !== "ok") {
      anomalyCount++;
      worstStatus = worstOf(worstStatus, r.status);
    }
  }

  return {
    metric:       records[0].metric,
    unit:         records[0].unit,
    sampleCount:  records.length,
    min,
    max,
    mean,
    latest,
    trend,
    anomalyCount,
    worstStatus,
  };
}

/**
 * Compute NodeSummary for a single node from the history records.
 *
 * Filters records to this node, then computes MetricStats per metric.
 * Returns null if no records exist for this node.
 */
function computeNodeSummary(
  nodeId: string,
  nodeName: string,
  nodeLocation: string,
  records: TelemetryRecord[],
): NodeSummary | null {
  const nodeRecords = records.filter((r) => r.nodeId === nodeId);
  if (nodeRecords.length === 0) return null;

  // Group by metric
  const byMetric = new Map<NodeMetricKey, TelemetryRecord[]>();
  for (const r of nodeRecords) {
    const existing = byMetric.get(r.metric) ?? [];
    existing.push(r);
    byMetric.set(r.metric, existing);
  }

  const metricStats: MetricStats[] = [];
  let overallStatus: StatusLevel = "ok";

  for (const [, metricRecords] of byMetric) {
    const stats = computeMetricStats(metricRecords);
    if (stats) {
      metricStats.push(stats);
      overallStatus = worstOf(overallStatus, stats.worstStatus);
    }
  }

  if (metricStats.length === 0) return null;

  return { nodeId, nodeName, nodeLocation, overallStatus, metricStats };
}

/**
 * Compute cross-node ranking for a single metric using live NodeData telemetry.
 *
 * Uses the current snapshot value from NodeData.telemetry, not the historical mean,
 * so the ranking reflects present conditions. Nodes missing the metric are excluded.
 */
function computeCrossNodeRanking(
  nodes: NodeData[],
  metric: NodeMetricKey,
): CrossNodeRanking | null {
  const entries: CrossNodeRanking["ranked"] = [];
  let unit = "";

  for (const node of nodes) {
    const m = node.telemetry.find((t) => t.key === metric);
    if (!m) continue;
    unit = m.unit;
    entries.push({
      nodeId:       node.id,
      nodeName:     node.name,
      nodeLocation: node.location,
      value:        m.value,
      status:       (m.status ?? "ok") as StatusLevel,
    });
  }

  if (entries.length === 0) return null;

  // Sort highest to lowest
  entries.sort((a, b) => b.value - a.value);

  return { metric, unit, ranked: entries };
}

// ─── Public API ───────────────────────────────────────────────────────────────

const ALL_METRICS: NodeMetricKey[] = [
  "temperature",
  "moisture",
  "ph",
  "battery",
  "rssi",
];

/**
 * Build a complete AnalyticsReport from the available dashboard data.
 *
 * Returns null if history is absent or empty — the UI must handle this
 * gracefully and show an explicit "insufficient data" message rather than
 * attempting to render an empty report.
 *
 * isMockData is always true until a real backend data contract is in place.
 */
export function buildAnalyticsReport(
  nodes: NodeData[],
  history: TelemetryRecord[],
  isMockData = true,
): AnalyticsReport | null {
  if (!history || history.length === 0) return null;
  if (!nodes || nodes.length === 0) return null;

  const nodeSummaries: NodeSummary[] = [];
  for (const node of nodes) {
    const summary = computeNodeSummary(
      node.id,
      node.name,
      node.location,
      history,
    );
    if (summary) nodeSummaries.push(summary);
  }

  const crossNodeComparisons: CrossNodeRanking[] = [];
  for (const metric of ALL_METRICS) {
    const ranking = computeCrossNodeRanking(nodes, metric);
    if (ranking) crossNodeComparisons.push(ranking);
  }

  return {
    generatedAt:         Date.now(),
    isMockData,
    totalRecords:        history.length,
    nodeSummaries,
    crossNodeComparisons,
  };
}

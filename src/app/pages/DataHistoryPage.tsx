import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { useDashboardData } from "@/hooks/useDashboardData";
import type { TelemetryMetricKey, TelemetryRecord, StatusLevel } from "@/types/dashboard";

/**
 * Data History page — tabular view of historical telemetry records.
 *
 * Features:
 *   - Filter by node (All Nodes or specific node)
 *   - Filter by metric (All Metrics or specific metric)
 *   - Pagination: 20 rows per page, resets on filter change
 *   - Newest records first (pre-sorted in mock data)
 *   - Empty state when filters produce no results
 *
 * No date range picker, export, search, chart, AI, or sorting controls.
 * Auto-refresh does NOT regenerate historical records — history is static.
 *
 * TBD(backend): real records will come from the gateway/backend data contract.
 * All values are simulated — see dashboard.mock.ts buildTelemetryHistory().
 */

// ─── Status label map ─────────────────────────────────────────────────────────

const STATUS_LABEL: Record<StatusLevel, string> = {
  ok:      "OK",
  warning: "Warning",
  error:   "Error",
  info:    "Info",
};

const PAGE_SIZE = 20;

// ─── Metric display config ────────────────────────────────────────────────────

const METRIC_LABEL: Record<TelemetryMetricKey, string> = {
  temperature: "Temperature",
  moisture:    "Moisture",
  ph:          "pH",
  battery:     "Battery",
  rssi:        "Signal",
};

const METRIC_ICON: Record<TelemetryMetricKey, keyof typeof icons> = {
  temperature: "temperature",
  moisture:    "moisture",
  ph:          "ph",
  battery:     "battery",
  rssi:        "signal",
};

// ─── Filter helpers ───────────────────────────────────────────────────────────

function getUniqueNodes(records: TelemetryRecord[]): { id: string; name: string; location: string }[] {
  const seen = new Set<string>();
  const nodes: { id: string; name: string; location: string }[] = [];
  for (const r of records) {
    if (!seen.has(r.nodeId)) {
      seen.add(r.nodeId);
      nodes.push({ id: r.nodeId, name: r.nodeName, location: r.nodeLocation });
    }
  }
  return nodes;
}

function getUniqueMetrics(records: TelemetryRecord[]): TelemetryMetricKey[] {
  const seen = new Set<TelemetryMetricKey>();
  for (const r of records) seen.add(r.metric);
  return Array.from(seen);
}

// ─── Select styling ───────────────────────────────────────────────────────────
// Native <select> styled to match existing SoilMon tokens.
// No custom dropdown component — native works correctly on mobile.

const SELECT_CLASS =
  "h-8 rounded-inner border border-border bg-surface px-2 pr-7 text-[13px] text-text " +
  "focus:outline-none focus:ring-2 focus:ring-accent/50 focus-visible:ring-2 focus-visible:ring-accent/50 " +
  "cursor-pointer appearance-none";

// ─── Table row ────────────────────────────────────────────────────────────────

function TableRow({ record, last }: { record: TelemetryRecord; last: boolean }) {
  const MetricIcon = icons[METRIC_ICON[record.metric]];

  return (
    <tr
      className={cn(
        "transition-colors duration-100 ease-out hover:bg-bg",
        !last && "border-b border-border",
      )}
    >
      {/* Timestamp */}
      <td className="py-2.5 pl-4 pr-3 text-[13px] tabular-nums text-muted whitespace-nowrap">
        {record.timestamp}
      </td>

      {/* Node — name + location on desktop, name-only on mobile */}
      <td className="py-2.5 px-3 text-[13px] text-text">
        <span className="font-medium">{record.nodeName}</span>
        <span className="hidden text-muted sm:inline"> · {record.nodeLocation}</span>
      </td>

      {/* Metric — icon + label on desktop, icon-only on mobile */}
      <td className="py-2.5 px-3 text-[13px] text-text whitespace-nowrap">
        <span className="flex items-center gap-1.5">
          <MetricIcon className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.8} aria-hidden />
          <span className="hidden sm:inline">{METRIC_LABEL[record.metric]}</span>
          <span className="sr-only sm:hidden">{METRIC_LABEL[record.metric]}</span>
        </span>
      </td>

      {/* Value */}
      <td className="py-2.5 px-3 text-[13px] tabular-nums text-text whitespace-nowrap">
        {record.value}{record.unit}
      </td>

      {/* Status */}
      <td className="py-2.5 pl-3 pr-4 text-[13px]">
        <StatusBadge status={record.status} label={STATUS_LABEL[record.status]} />
      </td>
    </tr>
  );
}

// ─── Pagination controls ──────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border pt-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={page === 1}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-inner border border-border px-3 py-1.5 text-[13px] font-medium",
          "transition-colors duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          page === 1
            ? "cursor-not-allowed text-muted opacity-40"
            : "text-text hover:border-accent/50 hover:text-accent",
        )}
      >
        ← Prev
      </button>

      <span className="text-[13px] text-muted tabular-nums">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={page === totalPages}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-inner border border-border px-3 py-1.5 text-[13px] font-medium",
          "transition-colors duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          page === totalPages
            ? "cursor-not-allowed text-muted opacity-40"
            : "text-text hover:border-accent/50 hover:text-accent",
        )}
      >
        Next →
      </button>
    </div>
  );
}

// ─── History table section ────────────────────────────────────────────────────

interface HistoryTableProps {
  records: TelemetryRecord[];
}

function HistoryTable({ records }: HistoryTableProps) {
  const HistoryIcon = icons.history;

  // Derive unique node and metric options from the full dataset once
  const nodeOptions  = useMemo(() => getUniqueNodes(records),   [records]);
  const metricOptions = useMemo(() => getUniqueMetrics(records), [records]);

  const [nodeFilter,   setNodeFilter]   = useState<string>("all");
  const [metricFilter, setMetricFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Apply filters — memoized to avoid re-running on every render
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (nodeFilter   !== "all" && r.nodeId  !== nodeFilter)   return false;
      if (metricFilter !== "all" && r.metric  !== metricFilter) return false;
      return true;
    });
  }, [records, nodeFilter, metricFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Paginate
  const pageRecords = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Handlers — reset page on filter change
  function handleNodeFilter(value: string) {
    setNodeFilter(value);
    setPage(1);
  }

  function handleMetricFilter(value: string) {
    setMetricFilter(value);
    setPage(1);
  }

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <HistoryIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
        <h2 className="text-sm font-semibold text-text">Riwayat Pembacaan Sensor</h2>
      </div>

      {/* Filter row */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Node filter */}
        <div className="relative">
          <select
            value={nodeFilter}
            onChange={(e) => handleNodeFilter(e.target.value)}
            className={SELECT_CLASS}
            aria-label="Filter by node"
          >
            <option value="all">Semua Node</option>
            {nodeOptions.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} · {n.location}
              </option>
            ))}
          </select>
          {/* Chevron indicator */}
          <span className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
            <svg className="h-3 w-3 text-muted" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>

        {/* Metric filter */}
        <div className="relative">
          <select
            value={metricFilter}
            onChange={(e) => handleMetricFilter(e.target.value)}
            className={SELECT_CLASS}
            aria-label="Filter by metric"
          >
            <option value="all">Semua Metrik</option>
            {metricOptions.map((m) => (
              <option key={m} value={m}>
                {METRIC_LABEL[m]}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
            <svg className="h-3 w-3 text-muted" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>

        {/* Record count — right-aligned */}
        <span className="ml-auto text-[12px] text-muted tabular-nums">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          Tidak ada data untuk filter yang dipilih
        </p>
      ) : (
        <>
          {/* Scrollable wrapper prevents horizontal overflow on mobile */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse" aria-label="Telemetry history">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pl-4 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Waktu
                  </th>
                  <th className="py-2 px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Node
                  </th>
                  <th className="py-2 px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Metrik
                  </th>
                  <th className="py-2 px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Nilai
                  </th>
                  <th className="py-2 pl-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRecords.map((record, i) => (
                  <TableRow
                    key={record.id}
                    record={record}
                    last={i === pageRecords.length - 1}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DataHistoryPage() {
  const { history } = useDashboardData();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-[22px] font-semibold text-text leading-tight">Data History</h1>
        <p className="mt-0.5 text-sm text-muted">
          Riwayat pembacaan sensor — simulated data, 24 jam terakhir
        </p>
      </div>

      {/* History table — rendered only when data is present */}
      {history && history.length > 0 ? (
        <HistoryTable records={history} />
      ) : (
        <Card className="p-5">
          <p className="py-10 text-center text-sm text-muted">
            Data historis belum tersedia
          </p>
        </Card>
      )}
    </div>
  );
}

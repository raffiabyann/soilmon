import { useMemo } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { buildAnalyticsReport, type AnalyticsReport } from "@/lib/analytics";

/**
 * Provides a computed AnalyticsReport derived from the current dashboard data.
 *
 * The report is memoized on [history, nodes] — both of which are static during
 * the session (history is frozen at mock init, nodes change only in telemetry
 * values which do not affect the historical analysis). The memo will recompute
 * only when these references change, which in practice means once per page load.
 *
 * Returns null if history is absent or empty — the page must render an explicit
 * "insufficient data" state rather than attempting to display an empty report.
 */
export function useAnalytics(): AnalyticsReport | null {
  const { history, nodes } = useDashboardData();

  return useMemo(() => {
    if (!history || history.length === 0) return null;
    if (!nodes || nodes.length === 0) return null;
    // isMockData: true until the gateway/backend data contract is confirmed
    return buildAnalyticsReport(nodes, history, true);
  }, [history, nodes]);
}

import { useState, useEffect, useCallback } from "react";
import type { DashboardData } from "@/types/dashboard";
import {
  getDashboardData,
  refreshDashboardData,
  AUTO_REFRESH_INTERVAL_MS,
} from "@/data/adapter/dashboardAdapter";
import { useAutoRefresh } from "@/app/AutoRefreshContext";

/**
 * Provides the dashboard data model to the UI (SPEC §22).
 *
 * When Auto Refresh is enabled, polls the adapter every
 * AUTO_REFRESH_INTERVAL_MS milliseconds and notifies the
 * AutoRefreshContext of each successful sync timestamp.
 *
 * Components depend on this hook — not on the mock or transport directly —
 * so the data source can later be replaced behind the adapter without
 * touching presentational code.
 */
export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>(() => getDashboardData());
  const { enabled, recordSync } = useAutoRefresh();

  const doRefresh = useCallback(() => {
    setData((prev) => refreshDashboardData(prev));
    recordSync(new Date());
  }, [recordSync]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(doRefresh, AUTO_REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, doRefresh]);

  return data;
}

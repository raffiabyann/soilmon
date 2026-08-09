import { useState, useCallback, type ReactNode } from "react";
import { AutoRefreshContext } from "@/app/AutoRefreshContext";

/**
 * Provides shared Auto Refresh state to the application.
 *
 * - `enabled` starts true (Auto Refresh ON by default).
 * - `toggle` flips enabled on/off; consumed by SidebarStatus and Header.
 * - `lastSyncTime` is null until the first refresh completes.
 * - `recordSync` is called by useDashboardData after each successful poll.
 */
export function AutoRefreshProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const toggle = useCallback(() => setEnabled((v) => !v), []);
  const recordSync = useCallback((at: Date) => setLastSyncTime(at), []);

  return (
    <AutoRefreshContext.Provider value={{ enabled, toggle, lastSyncTime, recordSync }}>
      {children}
    </AutoRefreshContext.Provider>
  );
}

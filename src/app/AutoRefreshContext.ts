import { createContext, useContext } from "react";

export interface AutoRefreshContextValue {
  /** Whether polling is currently active. */
  enabled: boolean;
  /** Toggle polling on/off. */
  toggle: () => void;
  /** Timestamp of the last successful data refresh. Null before the first refresh. */
  lastSyncTime: Date | null;
  /** Called by useDashboardData after each successful refresh to record the timestamp. */
  recordSync: (at: Date) => void;
}

export const AutoRefreshContext =
  createContext<AutoRefreshContextValue | null>(null);

/**
 * Consume the shared Auto Refresh state.
 * Throws if used outside AutoRefreshProvider.
 */
export function useAutoRefresh(): AutoRefreshContextValue {
  const ctx = useContext(AutoRefreshContext);
  if (!ctx) {
    throw new Error("useAutoRefresh must be used within AutoRefreshProvider");
  }
  return ctx;
}

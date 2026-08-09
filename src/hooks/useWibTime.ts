import { useState, useEffect } from "react";
import { formatWibTime } from "@/lib/time";

/**
 * Returns live-updating WIB (Asia/Jakarta, UTC+7) date and time strings.
 *
 * - `dateStr`    — formatted date, e.g. "09 Aug 2026"
 * - `timeStr`    — formatted time, e.g. "14:23 WIB"  (via formatWibTime)
 * - `now`        — the raw Date object for the current tick
 *
 * Updates every 30 seconds — UI only shows minute precision so per-second
 * ticks are unnecessary.  Clears the interval on unmount (no memory leak).
 *
 * Timezone is explicitly forced to "Asia/Jakarta" regardless of the
 * browser's local timezone setting.
 */

const JAKARTA_TZ = "Asia/Jakarta";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: JAKARTA_TZ,
  day:   "2-digit",
  month: "short",
  year:  "numeric",
});

function buildStrings(d: Date): { dateStr: string; timeStr: string } {
  // "09 Aug 2026"
  const dateStr = DATE_FMT.format(d);
  // "14:23 WIB" — delegates to shared formatWibTime utility
  const timeStr = formatWibTime(d);
  return { dateStr, timeStr };
}

export interface WibTime {
  dateStr: string;
  timeStr: string;
  now: Date;
}

export function useWibTime(): WibTime {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Align the first tick to the next minute boundary so the display
    // updates exactly when the minute flips, then run every 30 s.
    const msUntilNextMinute =
      (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds();

    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 30_000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return { ...buildStrings(now), now };
}

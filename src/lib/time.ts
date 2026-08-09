/**
 * Pure WIB (Asia/Jakarta, UTC+7) time formatting utilities.
 *
 * No React dependency. No side effects. Safe to import from any module
 * including non-React data layers (e.g. dashboardAdapter.ts).
 */

const JAKARTA_TZ = "Asia/Jakarta";

/** Module-level singleton — constructed once, reused on every call. */
const WIB_TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: JAKARTA_TZ,
  hour:   "2-digit",
  minute: "2-digit",
  hour12: false,
});

/**
 * Format a Date as "HH:mm WIB" in the Asia/Jakarta timezone.
 *
 * @example formatWibTime(new Date()) // "14:23 WIB"
 */
export function formatWibTime(date: Date): string {
  return `${WIB_TIME_FMT.format(date)} WIB`;
}

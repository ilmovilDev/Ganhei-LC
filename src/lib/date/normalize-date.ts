/**
 * Returns a new Date with time set to midnight **UTC**.
 *
 * WHY UTC:
 * `setHours(0,0,0,0)` uses the server's local timezone. If the server is in UTC
 * and the user is in GMT-3, a day registered at 22:00 local time is stored as
 * the *next* calendar day in UTC — a silent, hard-to-debug data corruption.
 *
 * `setUTCHours(0,0,0,0)` anchors the timestamp to UTC midnight regardless of
 * where the server runs, making dates timezone-safe.
 */
export function normalizeToMidnight(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

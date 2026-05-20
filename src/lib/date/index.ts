// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses a "YYYY-MM-DD" string into its numeric parts.
 * Single source of truth for string splitting — used by all parse functions.
 */
function parseDateParts(value: string): [number, number, number] {
  const [year, month, day] = value.split("-").map(Number);
  return [year, month, day];
}

/**
 * Formats a number as a zero-padded 2-digit string.
 */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calendar Date → "YYYY-MM-DD" (local timezone, safe for DST).
 *
 * Uses local date parts — never UTC — so the string always matches
 * what the user sees in their timezone.
 */
export function toDayDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/**
 * "YYYY-MM-DD" → local Date at noon (12:00).
 *
 * NEVER use new Date("2026-05-14") — it parses as UTC midnight,
 * which shifts the day backwards in UTC- timezones.
 * The noon anchor prevents DST edge cases from flipping the date.
 *
 * Use for: Calendar display, format(), UI rendering.
 * Do NOT use for: DB writes (use dayDateToDatabase instead).
 */
export function parseDayDate(value: string): Date {
  const [year, month, day] = parseDateParts(value);
  return new Date(year, month - 1, day, 12);
}

/**
 * Returns today as "YYYY-MM-DD" in the local timezone.
 */
export function todayDayDate(): string {
  return toDayDate(new Date());
}

/**
 * "YYYY-MM-DD" → UTC midnight Date for DB storage.
 *
 * Stores dates as UTC midnight so they are timezone-neutral in the DB.
 * Read back with databaseDateToDayDate (uses getUTC* methods symmetrically).
 */
export function dayDateToDatabase(value: string): Date {
  const [year, month, day] = parseDateParts(value);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * DB Date (UTC midnight) → "YYYY-MM-DD".
 *
 * Reads using getUTC* methods to mirror the UTC midnight write strategy.
 * NEVER use getFullYear/getMonth/getDate here — they apply local offset
 * and would return the wrong day for users west of UTC.
 */
export function databaseDateToDayDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

/**
 * Current month as a number (1–12).
 */
export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

/**
 * Current year as a 4-digit number.
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * UTC Date boundaries [from, to) for a given month/year.
 * Used for DB range queries: date >= from AND date < to.
 */
export function monthRangeUTC(
  year: number,
  month: number,
): { from: Date; to: Date } {
  return {
    from: new Date(Date.UTC(year, month - 1, 1)),
    to: new Date(Date.UTC(year, month, 1)),
  };
}

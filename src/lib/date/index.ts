// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Canonical application date format.
 *
 * Represents a calendar date without timezone:
 * YYYY-MM-DD
 */
export type DayDate = string;

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses a YYYY-MM-DD string into numeric date parts.
 *
 * Single source of truth for date splitting.
 */
function parseDateParts(
  value: DayDate,
): [year: number, month: number, day: number] {
  const [year, month, day] = value.split("-").map(Number);

  return [year, month, day];
}

/**
 * Pads a number to 2 digits.
 */
function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

// ─────────────────────────────────────────────────────────────────────────────
// UI DATE HELPERS (LOCAL TIMEZONE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Date → YYYY-MM-DD using LOCAL timezone.
 *
 * Safe for UI rendering and date inputs.
 *
 * NEVER use toISOString() here because it converts to UTC
 * and may shift the day for UTC- users.
 */
export function toDayDate(date: Date): DayDate {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/**
 * YYYY-MM-DD → local Date at noon (12:00).
 *
 * Noon anchor prevents DST edge-case rollover.
 *
 * Use ONLY for:
 * - UI rendering
 * - date-fns formatting
 * - calendars
 * - charts
 *
 * NEVER use for DB persistence.
 */
export function parseDayDate(value: DayDate): Date {
  const [year, month, day] = parseDateParts(value);

  return new Date(year, month - 1, day, 12);
}

/**
 * Returns today's date as YYYY-MM-DD in LOCAL timezone.
 */
export function todayDayDate(): DayDate {
  return toDayDate(new Date());
}

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE DATE HELPERS (UTC)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * YYYY-MM-DD → UTC midnight Date.
 *
 * Canonical persistence strategy.
 *
 * Database always stores:
 * 00:00:00.000 UTC
 *
 * This guarantees timezone-neutral storage.
 */
export function dayDateToDatabase(value: DayDate): Date {
  const [year, month, day] = parseDateParts(value);

  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * UTC DB Date → YYYY-MM-DD.
 *
 * MUST use getUTC* methods symmetrically
 * with dayDateToDatabase().
 *
 * NEVER use local getters here.
 */
export function databaseDateToDayDate(date: Date): DayDate {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUERY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * UTC month boundaries for DB range queries.
 *
 * Usage:
 * WHERE date >= from
 *   AND date < to
 */
export function monthRangeUTC(
  year: number,
  month: number,
): {
  from: Date;
  to: Date;
} {
  return {
    from: new Date(Date.UTC(year, month - 1, 1)),
    to: new Date(Date.UTC(year, month, 1)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE INFO HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Current month number (1-12).
 */
export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

/**
 * Current year (4 digits).
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

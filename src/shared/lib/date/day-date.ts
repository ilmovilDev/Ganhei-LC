export type DayDate = `${number}-${number}-${number}`;

function parseDateParts(
  value: DayDate,
): [year: number, month: number, day: number] {
  const [year, month, day] = value.split("-").map(Number);
  return [year, month, day];
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Centralized DayDate constructor.
 *
 * Single source of truth for DayDate formatting.
 */
function createDayDate(year: number, month: number, day: number): DayDate {
  return `${year}-${pad2(month)}-${pad2(day)}` as DayDate;
}

// ─────────────────────────────────────────
// UI
// ─────────────────────────────────────────
export function toDayDate(date: Date): DayDate {
  return createDayDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function parseDayDate(value: DayDate): Date {
  const [year, month, day] = parseDateParts(value);
  return new Date(year, month - 1, day, 12);
}

export function todayDayDate(): DayDate {
  return toDayDate(new Date());
}

// ─────────────────────────────────────────
// DATABASE
// ─────────────────────────────────────────
export function dayDateToDatabase(value: DayDate): Date {
  const [year, month, day] = parseDateParts(value);
  return new Date(Date.UTC(year, month - 1, day));
}

export function databaseDateToDayDate(date: Date): DayDate {
  return createDayDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
}

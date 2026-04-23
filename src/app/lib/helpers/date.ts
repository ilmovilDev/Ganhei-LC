/**
 * Devuelve el mes actual en formato "MM"
 */
export function getCurrentMonth(): string {
  const now = new Date();
  return String(now.getMonth() + 1).padStart(2, "0");
}

/**
 * Normaliza un mes a formato "MM"
 */
export function normalizeMonth(month?: string | null): string {
  if (!month) return getCurrentMonth();

  const normalized = month.padStart(2, "0");

  const isValid = Number(normalized) >= 1 && Number(normalized) <= 12;

  return isValid ? normalized : getCurrentMonth();
}

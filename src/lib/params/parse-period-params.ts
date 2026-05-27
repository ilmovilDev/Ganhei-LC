import { z } from "zod";
import { getCurrentMonth, getCurrentYear } from "@/lib/date";

/* -------------------------------------------------------------------------- */
/* SCHEMA                                                                      */
/* -------------------------------------------------------------------------- */

const periodSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2026).max(3026),
});

/* -------------------------------------------------------------------------- */
/* TYPES                                                                       */
/* -------------------------------------------------------------------------- */

export interface Period {
  month: number; // 1-12
  year: number; // 2026-2100
}

/* -------------------------------------------------------------------------- */
/* PARSER                                                                      */
/* -------------------------------------------------------------------------- */
export function parsePeriodParams(
  params: Record<string, string | string[] | undefined>,
): Period {
  const parsed = periodSchema.safeParse({
    month: params.month,
    year: params.year,
  });

  if (parsed.success) return parsed.data;

  // Fallback granular — si solo uno falla, rescata el otro
  const monthParsed = periodSchema.shape.month.safeParse(params.month);
  const yearParsed = periodSchema.shape.year.safeParse(params.year);

  return {
    month: monthParsed.success ? monthParsed.data : getCurrentMonth(),
    year: yearParsed.success ? yearParsed.data : getCurrentYear(),
  };
}

/* -------------------------------------------------------------------------- */
/* URL BUILDER                                                                 */
/* -------------------------------------------------------------------------- */
export function buildPeriodParams({ month, year }: Period): string {
  return new URLSearchParams({
    month: String(month),
    year: String(year),
  }).toString();
}

"use server";

import { AppError, ErrorCodes, fail, mapError } from "@/lib/errors";
import { GetDaysByMonthActionOutput } from "../types";
import { PERIOD_LIMITS } from "@/tokens";
import { requireAuth } from "@/lib/auth/require-auth";
import { DayService } from "../services/day.service";

export async function getDaysByMonthAction(
  month: number,
  year: number,
  limit?: number,
): Promise<GetDaysByMonthActionOutput> {
  try {
    const userId = await requireAuth();

    const {
      MONTH: { MIN: MIN_MONTH, MAX: MAX_MONTH },
      YEAR: { MIN: MIN_YEAR, MAX: MAX_YEAR },
    } = PERIOD_LIMITS;

    if (
      month < MIN_MONTH ||
      month > MAX_MONTH ||
      year < MIN_YEAR ||
      year > MAX_YEAR
    ) {
      throw new AppError(
        ErrorCodes.VALIDATION_ERROR,
        422,
        "Mês ou ano inválido.",
      );
    }

    return DayService.getDaysByMonth({ clerkId: userId, month, year, limit });
  } catch (error) {
    return fail(mapError(error));
  }
}

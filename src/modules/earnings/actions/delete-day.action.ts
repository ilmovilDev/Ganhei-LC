"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { AppError, ErrorCodes, fail, mapError } from "@/lib/errors";
import { DeleteDayActionOutput } from "../types";
import { DayService } from "../services/day.service";
import { revalidatePath } from "next/cache";

export async function deleteDayAction(
  dayId: string,
): Promise<DeleteDayActionOutput> {
  try {
    const userId = await requireAuth();

    if (!dayId?.trim()) {
      throw new AppError(
        ErrorCodes.VALIDATION_ERROR,
        422,
        "ID do dia é obrigatório.",
      );
    }

    const result = await DayService.deleteDay({ id: dayId, clerkId: userId });

    if (result.success) {
      revalidatePath("/dashboard");
      revalidatePath("/earnings");
    }

    return result;
  } catch (error) {
    return fail(mapError(error));
  }
}

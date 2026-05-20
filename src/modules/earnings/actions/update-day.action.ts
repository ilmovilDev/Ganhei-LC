"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { UpdateDayActionOutput } from "../types";
import { AppError, ErrorCodes, fail, mapError } from "@/lib/errors";
import { dayFormSchema } from "../schemas/day.schema";
import { DayService } from "../services/day.service";
import { revalidatePath } from "next/cache";

export async function updateDayAction(
  dayId: string,
  formData: unknown,
): Promise<UpdateDayActionOutput> {
  try {
    const userId = await requireAuth();

    if (!dayId?.trim()) {
      throw new AppError(
        ErrorCodes.VALIDATION_ERROR,
        422,
        "ID do dia é obrigatório.",
      );
    }

    const parsed = dayFormSchema.safeParse(formData);

    if (!parsed.success) {
      return fail({
        code: ErrorCodes.VALIDATION_ERROR,
        status: 422,
        message: "Dados inválidos.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await DayService.updateDay({
      clerkId: userId,
      data: parsed.data,
      id: dayId.trim(),
    });

    if (result.success) {
      revalidatePath("/earnings");
    }

    return result;
  } catch (error) {
    return fail(mapError(error));
  }
}

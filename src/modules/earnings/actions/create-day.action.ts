"use server";

import { auth } from "@clerk/nextjs/server";
import { dayService } from "@/modules/earnings/services/day.service";
import { dayFormSchema } from "@/modules/earnings/schemas";
import { AppError } from "@/lib/errors/app-error";
import { ErrorCode } from "@/lib/errors/error-codes";
import { fail, mapError } from "@/lib/errors/result";
import { Result } from "@/types/result";

export type CreateDayResult = Result<{ success: true }>;

export async function createDayAction(
  formData: unknown,
): Promise<CreateDayResult> {
  try {
    // 1. Auth
    const { userId } = await auth();

    if (!userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401, "Não autorizado.");
    }

    // 2. Validate
    const parsed = dayFormSchema.safeParse(formData);

    if (!parsed.success) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        422,
        "Dados inválidos.",
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }

    // 3. Service
    return await dayService.createDay(userId, parsed.data);
  } catch (error) {
    return fail(mapError(error));
  }
}

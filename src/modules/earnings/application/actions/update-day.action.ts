"use server";

import { auth } from "@clerk/nextjs/server";
import { dayFormSchema } from "../../schemas/day.schema";
import { UpdateDayActionResult } from "../../types/results.types";
import { UpdateDayUseCase } from "../use-cases/update-day.use-case";
import { mapError } from "@/lib/errors/map-error";

export async function updateDayAction(
  id: string,

  formData: unknown,
): Promise<UpdateDayActionResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: { message: "Unauthorized" },
        code: "UNAUTHORIZED",
      };
    }

    const parsed = dayFormSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: false,
        error: { message: "Validation error" },
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      };
    }

    const useCase = new UpdateDayUseCase();
    await useCase.execute({
      id,
      clerkId: userId,
      data: parsed.data,
    });

    return {
      success: true,
      data: {
        success: true,
      },
    };
  } catch (error) {
    return mapError(error);
  }
}

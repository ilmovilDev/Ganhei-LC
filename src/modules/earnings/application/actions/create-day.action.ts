"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { dayFormSchema } from "../../schemas/day.schema";
import { mapError } from "@/lib/errors/map-error";
import { CreateDayActionResult } from "../../types/results.types";
import { CreateDayUseCase } from "../use-cases/create-day.use-case";

const createDayUseCase = new CreateDayUseCase();

export async function createDayAction(
  formData: unknown,
): Promise<CreateDayActionResult> {
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

    await createDayUseCase.execute({
      clerkId: userId,
      data: parsed.data,
    });

    revalidateTag("earnings", "max");

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

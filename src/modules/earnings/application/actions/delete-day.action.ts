"use server";

import { auth } from "@clerk/nextjs/server";
import { mapError } from "@/lib/errors/map-error";
import { DeleteDayActionResult } from "../../types/results.types";
import { DeleteDayUseCase } from "../use-cases/delete-dat.use-case";

export async function deleteDayAction(
  id: string,
): Promise<DeleteDayActionResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: { message: "Unauthorized" },
        code: "UNAUTHORIZED",
      };
    }

    console.log("Deleting day with id:", id, "for user:", userId);

    const useCase = new DeleteDayUseCase();
    await useCase.execute({
      id,
      clerkId: userId,
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

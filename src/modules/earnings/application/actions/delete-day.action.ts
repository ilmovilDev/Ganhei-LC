"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { mapError } from "@/lib/errors/map-error";
import { DeleteDayActionResult } from "../../types/results.types";
import { DeleteDayUseCase } from "../use-cases/delete-dat.use-case";

const deleteDayUseCase = new DeleteDayUseCase();

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

    await deleteDayUseCase.execute({
      id,
      clerkId: userId,
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

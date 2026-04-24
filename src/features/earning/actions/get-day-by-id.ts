"use server";

import { auth } from "@clerk/nextjs/server";
import { earningService } from "../services/earning-service";
import { handleError } from "@/app/lib/errors/handle-error";
import { AppError } from "@/components/shared/errors/app-errors";

export async function getDayByIdAction(dayId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new AppError("UNAUTHORIZED", "Não autorizado");
    }

    return await earningService.getDayById(userId, dayId);
  } catch (error) {
    handleError(error);
  }
}

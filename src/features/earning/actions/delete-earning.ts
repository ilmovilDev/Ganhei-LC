"use server";

import { auth } from "@clerk/nextjs/server";
import { deleteEarningSchema } from "../schemas/earning-schema";
import { earningService } from "../services/earning-service";
import { handleError } from "@/app/lib/errors/handle-error";
import { AppError } from "@/components/shared/errors/app-errors";

export async function deleteEarningAction(input: unknown) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new AppError("UNAUTHORIZED", "Não autorizado");
    }

    const parsed = deleteEarningSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return await earningService.deleteEarning(userId, parsed.data);
  } catch (error) {
    handleError(error);
  }
}

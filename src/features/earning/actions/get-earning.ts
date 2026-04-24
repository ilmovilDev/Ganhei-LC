"use server";

import { auth } from "@clerk/nextjs/server";
import { getEarningsSchema } from "../schemas/earning-schema";
import { earningService } from "../services/earning-service";
import { handleError } from "@/app/lib/errors/handle-error";
import { AppError } from "@/components/shared/errors/app-errors";

export async function getEarningsAction(input: unknown) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new AppError("UNAUTHORIZED", "Não autorizado");
    }

    const parsed = getEarningsSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return await earningService.getEarnings(userId, parsed.data.month);
  } catch (error) {
    handleError(error);
  }
}

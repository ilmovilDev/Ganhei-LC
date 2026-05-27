"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { DayId } from "../../types/domain.types";
import { DeleteDayResult } from "../../types/result.types";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { mapError } from "@/lib/errors/map-error";
import { AppError } from "@/lib/errors/app-error";

export async function deleteDayAction(id: DayId): Promise<DeleteDayResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: { message: "Unauthorized" },
      code: "UNAUTHORIZED",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const dayRepo = new DayRepository(tx);

      const existing = await dayRepo.findById(id);

      if (!existing || existing.clerkId !== userId) {
        throw new AppError("Dia não encontrado.", "NOT_FOUND");
      }

      await dayRepo.delete(id);
    });

    return { success: true, data: { success: true } };
  } catch (error) {
    return mapError(error);
  }
}

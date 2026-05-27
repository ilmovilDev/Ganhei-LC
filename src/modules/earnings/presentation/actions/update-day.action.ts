"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { DayId } from "../../types/domain.types";
import { DayFormInput, dayFormSchema } from "../../schemas/day.schema";
import { UpdateDayResult } from "../../types/result.types";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { syncDayFinancialState } from "../../domain/workflows/sync-day-financial-state";
import { dayDateToDatabase } from "@/lib/date";
import { mapError } from "@/lib/errors/map-error";
import { AppError } from "@/lib/errors/app-error";

export async function updateDayAction(
  id: DayId,
  input: DayFormInput,
): Promise<UpdateDayResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: { message: "Unauthorized" },
      code: "UNAUTHORIZED",
    };
  }

  const parsed = dayFormSchema.safeParse(input);

  if (!parsed.success) {
    return mapError(parsed.error);
  }

  const { date, hours, kilometers, earnings } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const dayRepo = new DayRepository(tx);

      const existing = await dayRepo.findById(id);

      if (!existing || existing.clerkId !== userId) {
        throw new AppError("Dia não encontrado.", "NOT_FOUND");
      }

      await dayRepo.update(id, {
        date: dayDateToDatabase(date),
        hours,
        kilometers,
      });

      await syncDayFinancialState({ tx, dayId: id, earnings });
    });

    return { success: true, data: { success: true } };
  } catch (error) {
    return mapError(error);
  }
}

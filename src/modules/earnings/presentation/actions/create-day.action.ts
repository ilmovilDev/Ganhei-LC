"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { dayFormSchema, DayFormInput } from "../../schemas/day.schema";
import { CreateDayResult } from "../../types/result.types";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { syncDayFinancialState } from "../../domain/workflows/sync-day-financial-state";
import { dayDateToDatabase } from "@/lib/date";
import { mapError } from "@/lib/errors/map-error";

export async function createDayAction(
  input: DayFormInput,
): Promise<CreateDayResult> {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: { message: "Unauthorized" },
      code: "UNAUTHORIZED",
    };
  }

  // ─── Validation ───────────────────────────────────────────────────────────
  const parsed = dayFormSchema.safeParse(input);

  if (!parsed.success) {
    return mapError(parsed.error);
  }

  const { date, hours, kilometers, earnings } = parsed.data;

  // ─── Persistence ──────────────────────────────────────────────────────────
  try {
    await prisma.$transaction(async (tx) => {
      const dayRepo = new DayRepository(tx);

      const day = await dayRepo.create({
        clerkId: userId,
        date: dayDateToDatabase(date),
        hours,
        kilometers,
      });

      await syncDayFinancialState({ tx, dayId: day.id, earnings });
    });

    return { success: true, data: { success: true } };
  } catch (error) {
    return mapError(error);
  }
}

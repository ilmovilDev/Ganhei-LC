import { prisma } from "@/lib/db/prisma";
import { createDaySchema } from "../schemas/create-day.schema";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { toDayDto } from "../../infrastructure/mappers/day.mapper";
import { syncDayFinancialState } from "../services/sync-day-financial-state.service";
import { CreateDayInput } from "../../types";
import { dayDateToDatabase } from "@/shared/lib/date/day-date";

interface CreateDayUseCaseRequest {
  clerkId: string;
  data: CreateDayInput;
}

export class CreateDayUseCase {
  async execute({ clerkId, data }: CreateDayUseCaseRequest) {
    const validatedData = createDaySchema.parse(data);

    return prisma.$transaction(async (tx) => {
      const repository = new DayRepository(tx);

      // ─────────────────────────────────────────
      // 1. CREATE BASE DAY
      // ─────────────────────────────────────────
      const createdDay = await repository.create({
        clerkId,
        date: dayDateToDatabase(validatedData.date),
        hours: validatedData.hours,
        kilometers: validatedData.kilometers,
      });

      // ─────────────────────────────────────────
      // 2. SYNC FINANCIAL STATE
      // ─────────────────────────────────────────
      await syncDayFinancialState({
        tx,
        dayId: createdDay.id,
        clerkId,
        earnings: validatedData.earnings,
      });

      // ─────────────────────────────────────────
      // 3. REFETCH HYDRATED AGGREGATE
      // ─────────────────────────────────────────
      const hydratedDay = await repository.findById({
        id: createdDay.id,
        clerkId,
      });

      if (!hydratedDay) {
        throw new Error("Failed to hydrate created day.");
      }

      return toDayDto(hydratedDay);
    });
  }
}

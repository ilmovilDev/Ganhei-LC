import { prisma } from "@/lib/db/prisma";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { DeleteDayInput } from "../../types/inputs.types";

export class DeleteDayUseCase {
  async execute({ id, clerkId }: DeleteDayInput) {
    return prisma.$transaction(async (tx) => {
      const dayRepository = new DayRepository(tx);

      const existingDay = await dayRepository.findById(id);

      if (!existingDay) {
        throw new Error("Day not found.");
      }

      if (existingDay.clerkId !== clerkId) {
        throw new Error("Unauthorized.");
      }

      await dayRepository.delete(id);

      return {
        success: true,
      };
    });
  }
}

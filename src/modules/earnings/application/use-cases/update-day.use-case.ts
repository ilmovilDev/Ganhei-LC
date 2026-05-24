import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { EarningRepository } from "../../infrastructure/repositories/earning.repository";
import { UpdateDayInput } from "../../types/inputs.types";

export class UpdateDayUseCase {
  async execute({ id, clerkId, data }: UpdateDayInput) {
    return prisma.$transaction(async (tx) => {
      const dayRepository = new DayRepository(tx);
      const earningRepository = new EarningRepository(tx);
      const existingDay = await dayRepository.findById(id);

      if (!existingDay) {
        throw new Error("Day not found.");
      }

      if (existingDay.clerkId !== clerkId) {
        throw new Error("Unauthorized.");
      }

      const totalEarnings = data.earnings.reduce(
        (sum, earning) => sum + earning.amount,
        0,
      );

      await earningRepository.deleteByDay(id);

      await earningRepository.createMany(
        data.earnings.map((earning) => ({
          dayId: id,

          app: earning.app,

          amount: new Prisma.Decimal(earning.amount),
        })),
      );

      return dayRepository.update(id, {
        date: new Date(data.date),
        hours: data.hours,
        kilometers: new Prisma.Decimal(data.kilometers),
        totalEarnings: new Prisma.Decimal(totalEarnings),
        netProfit: new Prisma.Decimal(
          totalEarnings - Number(existingDay.totalExpenses),
        ),
      });
    });
  }
}

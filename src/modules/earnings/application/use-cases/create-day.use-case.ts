import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { EarningRepository } from "../../infrastructure/repositories/earning.repository";
import { CreateDayInput } from "../../types/inputs.types";

export class CreateDayUseCase {
  async execute({ clerkId, data }: CreateDayInput) {
    return prisma.$transaction(async (tx) => {
      const dayRepository = new DayRepository(tx);

      const earningRepository = new EarningRepository(tx);

      const totalEarnings = data.earnings.reduce(
        (sum, earning) => sum + earning.amount,
        0,
      );

      const day = await dayRepository.create({
        clerkId,
        date: new Date(data.date),
        hours: data.hours,
        kilometers: new Prisma.Decimal(data.kilometers),
        totalEarnings: new Prisma.Decimal(totalEarnings),
        totalExpenses: new Prisma.Decimal(0),
        netProfit: new Prisma.Decimal(totalEarnings),
      });

      await earningRepository.createMany(
        data.earnings.map((earning) => ({
          dayId: day.id,
          app: earning.app,
          amount: new Prisma.Decimal(earning.amount),
        })),
      );

      return day;
    });
  }
}

import { Prisma } from "@/generated/prisma/client";
import { Day } from "../../types/domain.types";

type PrismaDayWithEarnings = Prisma.DayGetPayload<{
  select: typeof import("../prisma/day.select").daySelect;
}>;

export function toDomainDay(day: PrismaDayWithEarnings): Day {
  return {
    id: day.id,
    clerkId: day.clerkId,
    date: day.date,
    hours: day.hours,
    kilometers: Number(day.kilometers),
    totalEarnings: Number(day.totalEarnings),
    totalExpenses: Number(day.totalExpenses),
    netProfit: Number(day.netProfit),
    createdAt: day.createdAt,
    updatedAt: day.updatedAt,
    earnings: day.earnings.map((earning) => ({
      id: earning.id,
      app: earning.app,
      amount: Number(earning.amount),
    })),
  };
}

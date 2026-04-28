import { prisma } from "@/lib/db/prisma";
import { DashboardRaw } from "../types/dashboard.types";

interface GetDashboardServiceProps {
  month: string;
  userId: string;
}

export async function getDashboardService({
  month,
  userId,
}: GetDashboardServiceProps): Promise<DashboardRaw> {
  const monthIndex = Number(month);
  console.log(monthIndex);

  if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
    throw new Error("Mês inválido");
  }

  const year = new Date().getFullYear();

  const startDate = new Date(year, monthIndex - 1, 1);
  const endDate = new Date(year, monthIndex, 1);

  // 👇 agregaciones en paralelo (performance)
  const [earningsAgg, expensesAgg, days] = await Promise.all([
    prisma.earning.aggregate({
      where: {
        day: {
          is: {
            clerkId: userId,
            date: { gte: startDate, lte: endDate },
          },
        },
      },
      _sum: { amount: true },
    }),

    prisma.expense.aggregate({
      where: {
        day: {
          is: {
            clerkId: userId,
            date: { gte: startDate, lte: endDate },
          },
        },
      },
      _sum: { amount: true },
    }),

    prisma.day.findMany({
      where: {
        clerkId: userId,
        date: { gte: startDate, lte: endDate },
      },
      select: {
        hours: true,
        kilometers: true,
      },
    }),
  ]);

  const totalEarnings = Number(earningsAgg._sum.amount ?? 0);
  const totalExpenses = Number(expensesAgg._sum.amount ?? 0);

  const totalHours = days.reduce((acc, d) => acc + (d.hours ?? 0), 0);
  const totalKm = days.reduce((acc, d) => acc + (d.kilometers ?? 0), 0);

  return {
    totalEarnings,
    totalExpenses,
    totalNet: totalEarnings - totalExpenses,
    totalHours,
    totalKm,
  };
}

import { Prisma } from "@/generated/prisma/client";

export async function calculateDayTotals(
  tx: Prisma.TransactionClient,
  dayId: string,
) {
  const [earnings, expenses] = await Promise.all([
    tx.earning.aggregate({
      where: { dayId },
      _sum: { amount: true },
    }),

    tx.expense.aggregate({
      where: { dayId },
      _sum: { amount: true },
    }),
  ]);

  const totalEarnings = earnings._sum.amount ?? new Prisma.Decimal(0);

  const totalExpenses = expenses._sum.amount ?? new Prisma.Decimal(0);

  return {
    totalEarnings,
    totalExpenses,
    netProfit: totalEarnings.sub(totalExpenses),
  };
}

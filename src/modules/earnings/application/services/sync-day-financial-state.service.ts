import { Prisma } from "@/generated/prisma/client";

import { App } from "@/generated/prisma/enums";

interface SyncDayFinancialStateParams {
  tx: Prisma.TransactionClient;
  dayId: string;
  clerkId: string;
  earnings: {
    app: App;
    amount: number;
  }[];
}

export async function syncDayFinancialState({
  tx,
  dayId,
  clerkId,
  earnings,
}: SyncDayFinancialStateParams) {
  // ─────────────────────────────────────────────────────────────
  // 1. RESYNC EARNINGS
  // ─────────────────────────────────────────────────────────────
  await tx.earning.deleteMany({
    where: {
      dayId,
    },
  });

  if (earnings.length > 0) {
    await tx.earning.createMany({
      data: earnings.map((earning) => ({
        dayId,
        app: earning.app,
        amount: earning.amount,
      })),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 2. AGGREGATE TOTALS
  // ─────────────────────────────────────────────────────────────
  const [earningsAggregate, expensesAggregate] = await Promise.all([
    tx.earning.aggregate({
      where: {
        dayId,
      },

      _sum: {
        amount: true,
      },
    }),

    tx.expense.aggregate({
      where: {
        dayId,
      },

      _sum: {
        amount: true,
      },
    }),
  ]);

  const totalEarnings = Number(earningsAggregate._sum.amount ?? 0);

  const totalExpenses = Number(expensesAggregate._sum.amount ?? 0);

  const netProfit = totalEarnings - totalExpenses;

  // ─────────────────────────────────────────────────────────────
  // 3. UPDATE SNAPSHOT
  // ─────────────────────────────────────────────────────────────
  await tx.day.update({
    where: {
      id: dayId,
      clerkId,
    },

    data: {
      totalEarnings,
      totalExpenses,
      netProfit,
    },
  });
}

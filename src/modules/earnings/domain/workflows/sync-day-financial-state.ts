import { Prisma } from "@/generated/prisma/client";
import { App } from "@/generated/prisma/enums";

interface SyncParams {
  tx: Prisma.TransactionClient;
  dayId: string;
  earnings: {
    app: App;
    amount: number;
  }[];
}

export async function syncDayFinancialState({
  tx,
  dayId,
  earnings,
}: SyncParams) {
  // ─── 1. Resync earnings ───────────────────────────────────────────────────
  await tx.earning.deleteMany({ where: { dayId } });

  if (earnings.length > 0) {
    await tx.earning.createMany({
      data: earnings.map((earning) => ({
        dayId,
        app: earning.app as App,
        amount: earning.amount,
      })),
    });
  }

  // ─── 2. Agregar totales ───────────────────────────────────────────────────
  const [earningsAgg, expensesAgg] = await Promise.all([
    tx.earning.aggregate({
      where: { dayId },
      _sum: { amount: true },
    }),
    tx.expense.aggregate({
      where: { dayId },
      _sum: { amount: true },
    }),
  ]);

  const totalEarnings = Number(earningsAgg._sum.amount ?? 0);
  const totalExpenses = Number(expensesAgg._sum.amount ?? 0);
  const netProfit = totalEarnings - totalExpenses;

  // ─── 3. Actualizar Day con los tres campos ────────────────────────────────
  await tx.day.update({
    where: { id: dayId },
    data: {
      totalEarnings,
      totalExpenses,
      netProfit,
    },
  });
}

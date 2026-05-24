import { Prisma } from "@/generated/prisma/client";

interface SyncParams {
  tx: Prisma.TransactionClient;
  dayId: string;
  earnings: {
    app: string;
    amount: number;
  }[];
}

export async function syncDayFinancialState({
  tx,
  dayId,
  earnings,
}: SyncParams) {
  await tx.earning.deleteMany({
    where: {
      dayId,
    },
  });

  if (earnings.length > 0) {
    await tx.earning.createMany({
      data: earnings.map((earning) => ({
        dayId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        app: earning.app as any,
        amount: earning.amount,
      })),
    });
  }

  const aggregates = await tx.earning.aggregate({
    where: {
      dayId,
    },
    _sum: {
      amount: true,
    },
  });

  await tx.day.update({
    where: {
      id: dayId,
    },
    data: {
      totalEarnings: aggregates._sum.amount || 0,
    },
  });
}

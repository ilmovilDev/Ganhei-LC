import { App, Prisma } from "@/generated/prisma/client";

export async function replaceDayEarnings(
  tx: Prisma.TransactionClient,
  dayId: string,
  earnings: {
    app: App;
    amount: number;
  }[],
) {
  await tx.earning.deleteMany({
    where: { dayId },
  });

  if (earnings.length === 0) {
    return;
  }

  await tx.earning.createMany({
    data: earnings.map((earning) => ({
      dayId,
      app: earning.app,
      amount: new Prisma.Decimal(earning.amount),
    })),
  });
}

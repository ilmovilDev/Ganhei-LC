import { App, Prisma } from "@/generated/prisma/client";
import { databaseDateToDayDate } from "@/lib/date";
import { Day } from "../../types";

type PrismaDayPayload = {
  id: string;
  date: Date;
  hours: number;
  kilometers: Prisma.Decimal;
  clerkId: string;
  totalEarnings: Prisma.Decimal;
  totalExpenses: Prisma.Decimal;
  netProfit: Prisma.Decimal;
  earnings: {
    id: string;
    app: App;
    amount: Prisma.Decimal;
  }[];
};

export function mapDay(day: PrismaDayPayload): Day {
  return {
    id: day.id,
    date: databaseDateToDayDate(day.date),
    hours: day.hours,
    kilometers: Number(day.kilometers),
    clerkId: day.clerkId,
    earnings: day.earnings.map((earning) => ({
      id: earning.id,
      app: earning.app,
      amount: Number(earning.amount),
    })),
    grossProfit: Number(day.totalEarnings),
    totalExpenses: Number(day.totalExpenses),
    netProfit: Number(day.netProfit),
  };
}

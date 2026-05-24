import { Prisma } from "@/generated/prisma/client";

import { App } from "@/generated/prisma/enums";

import { DayListItemDto } from "../dtos/day-list-item.dto";
import { databaseDateToDayDate } from "@/lib/date";

interface DayWithEarnings {
  id: string;
  date: Date;
  hours: number;
  kilometers: Prisma.Decimal;
  totalEarnings: Prisma.Decimal;
  totalExpenses: Prisma.Decimal;
  netProfit: Prisma.Decimal;
  createdAt: Date;

  earnings: {
    id: string;
    app: App;
    amount: Prisma.Decimal;
  }[];
}

export function toDayListItemDto(day: DayWithEarnings): DayListItemDto {
  return {
    id: day.id,
    date: databaseDateToDayDate(day.date),
    hours: day.hours,
    kilometers: Number(day.kilometers),
    totalEarnings: Number(day.totalEarnings),
    totalExpenses: Number(day.totalExpenses),
    netProfit: Number(day.netProfit),
    createdAt: day.createdAt.toISOString(),

    earnings: day.earnings.map((earning) => ({
      id: earning.id,
      app: earning.app,
      amount: Number(earning.amount),
    })),
  };
}

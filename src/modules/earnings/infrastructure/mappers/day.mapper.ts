import { databaseDateToDayDate } from "@/shared/lib/date/day-date";
import { DayListItemDto, EarningItemDto } from "../../application/dtos";
import {
  PrismaDayPayload,
  PrismaDayEarningPayload,
} from "../select/day.select";

function toEarningDto(earning: PrismaDayEarningPayload): EarningItemDto {
  return {
    id: earning.id,
    app: earning.app,
    amount: Number(earning.amount),
  };
}

export function toDayDto(day: PrismaDayPayload): DayListItemDto {
  return {
    id: day.id,
    date: databaseDateToDayDate(day.date),
    hours: day.hours,
    kilometers: Number(day.kilometers),
    totalEarnings: Number(day.totalEarnings),
    totalExpenses: Number(day.totalExpenses),
    netProfit: Number(day.netProfit),
    earnings: day.earnings.map(toEarningDto),
    createdAt: day.createdAt.toISOString(),
    updatedAt: day.updatedAt.toISOString(),
  };
}

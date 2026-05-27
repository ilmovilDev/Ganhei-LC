"use server";

import { auth } from "@clerk/nextjs/server";
import { GetDaysByMonthResult } from "../../types/result.types";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { DayListItemDto } from "../../application/dtos/day-list-item.dto";
import { toDomainDay } from "../../infrastructure/mappers/day.mapper";
import { databaseDateToDayDate, monthRangeUTC } from "@/lib/date";
import { mapError } from "@/lib/errors/map-error";

interface GetDaysByMonthParams {
  month: number;
  year: number;
}

export async function getDaysByMonthAction({
  month,
  year,
}: GetDaysByMonthParams): Promise<GetDaysByMonthResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: { message: "Unauthorized" },
      code: "UNAUTHORIZED",
    };
  }

  try {
    const { from, to } = monthRangeUTC(year, month);
    const dayRepo = new DayRepository();

    const rows = await dayRepo.findManyByMonth({
      clerkId: userId,
      startDate: from,
      endDate: to,
    });

    const data: DayListItemDto[] = rows.map((row) => {
      const domain = toDomainDay(row);

      return {
        id: domain.id,
        date: databaseDateToDayDate(domain.date),
        hours: domain.hours,
        kilometers: domain.kilometers,
        totalEarnings: domain.totalEarnings,
        totalExpenses: domain.totalExpenses,
        netProfit: domain.netProfit,
        createdAt: domain.createdAt.toISOString(),
        updatedAt: domain.updatedAt.toISOString(),
        earnings: domain.earnings.map((e) => ({
          id: e.id,
          app: e.app,
          amount: e.amount,
        })),
      };
    });

    return { success: true, data };
  } catch (error) {
    return mapError(error);
  }
}

"use server";

import { auth } from "@clerk/nextjs/server";
import { mapError } from "@/lib/errors/map-error";
import { GetDaysByMonthActionResult } from "../../types/results.types";
import { GetDaysByMonthUseCase } from "../use-cases/get-days-by-month.use-case";

const getDaysByMonthUseCase = new GetDaysByMonthUseCase();

interface Params {
  month: number;
  year: number;
  limit?: number;
}

export async function getDaysByMonthAction({
  month,
  year,
  limit,
}: Params): Promise<GetDaysByMonthActionResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: { message: "Unauthorized" },
        code: "UNAUTHORIZED",
      };
    }

    const data = await getDaysByMonthUseCase.execute({
      clerkId: userId,
      month,
      year,
      limit,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    return mapError(error);
  }
}

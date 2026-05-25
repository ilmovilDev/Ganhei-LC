"use server";

import { auth } from "@clerk/nextjs/server";
import { mapError } from "@/lib/errors/map-error";
import { GetDaysByMonthActionResult } from "../../types/results.types";
import { GetDaysByMonthUseCase } from "../use-cases/get-days-by-month.use-case";

interface Params {
  month: number;
  year: number;
}

export async function getDaysByMonthAction({
  month,
  year,
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

    const useCase = new GetDaysByMonthUseCase();
    const data = await useCase.execute({
      clerkId: userId,
      month,
      year,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    return mapError(error);
  }
}

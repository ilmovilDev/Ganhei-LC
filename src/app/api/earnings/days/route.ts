import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { mapError } from "@/lib/errors/map-error";
import { DayRepository } from "@/modules/earnings/infrastructure/repositories/day.repository";
import { GetDaysByMonthUseCase } from "@/modules/earnings/application/use-cases/get-days-by-month.use-case";
import { getAuthUser } from "@/lib/auth/get-auth-user";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (Number.isNaN(month) || Number.isNaN(year)) {
      return NextResponse.json(
        {
          success: false,

          error: "Invalid month or year.",
        },
        {
          status: 400,
        },
      );
    }

    const { clerkId } = await getAuthUser();

    const repository = new DayRepository(prisma);
    const useCase = new GetDaysByMonthUseCase(repository);

    const data = await useCase.execute({
      clerkId,
      month,
      year,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const mappedError = mapError(error);
    return NextResponse.json(
      {
        success: false,
        error: mappedError,
      },
      {
        status: 500,
      },
    );
  }
}

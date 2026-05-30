import { PrismaClient } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/errors/app-error";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";
import { dayDateToDatabase } from "@/shared/lib/date/day-date";
import { updateDaySchema } from "../schemas/update-day.schema";
import { DayListItemDto } from "../dtos";
import { syncDayFinancialState } from "../services/sync-day-financial-state.service";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { DayRepositoryContract } from "../../domain/contracts/day-repository.contract";
import { toDayDto } from "../../infrastructure/mappers/day.mapper";
import { APP_ERROR_CODES } from "@/lib/errors/app-error-code";
import { UpdateDayInput } from "../../types";

interface UpdateDayUseCaseRequest {
  clerkId: string;
  dayId: string;
  data: UpdateDayInput;
}

export class UpdateDayUseCase {
  constructor(private readonly db: PrismaClient = prisma) {}

  async execute({
    clerkId,
    dayId,
    data,
  }: Readonly<UpdateDayUseCaseRequest>): Promise<DayListItemDto> {
    // ─────────────────────────────────────
    // AUTH VALIDATION
    // ─────────────────────────────────────
    if (!clerkId) {
      throw new AppError({
        code: APP_ERROR_CODES.UNAUTHORIZED,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: 401,
      });
    }

    // ─────────────────────────────────────
    // INPUT VALIDATION
    // ─────────────────────────────────────
    const validatedData = updateDaySchema.parse(data);

    return this.db.$transaction(async (tx) => {
      const repository: DayRepositoryContract = new DayRepository(tx);

      // ───────────────────────────────────
      // EXISTS VALIDATION
      // ───────────────────────────────────
      const existingDay = await repository.findById({
        id: dayId,
        clerkId,
      });

      if (!existingDay) {
        throw new AppError({
          code: APP_ERROR_CODES.DAY_NOT_FOUND,
          message: ERROR_MESSAGES.DAY_NOT_FOUND,
          statusCode: 404,
        });
      }

      // ───────────────────────────────────
      // DUPLICATE DATE VALIDATION
      // ───────────────────────────────────

      if (validatedData.date) {
        const normalizedDate = dayDateToDatabase(validatedData.date);

        const duplicateDay = await repository.existsByDate({
          clerkId,
          date: normalizedDate,
        });

        const isChangingDate =
          normalizedDate.getTime() !== existingDay.date.getTime();

        if (duplicateDay && isChangingDate) {
          throw new AppError({
            code: APP_ERROR_CODES.DAY_ALREADY_EXISTS,
            message: ERROR_MESSAGES.DAY_ALREADY_EXISTS,
            statusCode: 409,
          });
        }
      }

      // ───────────────────────────────────
      // UPDATE
      // ───────────────────────────────────
      await repository.update({
        id: dayId,
        clerkId,
        data: {
          hours: validatedData.hours,
          kilometers: validatedData.kilometers,
        },
      });

      // ───────────────────────────────────
      // FINANCIAL RESYNC
      // ───────────────────────────────────
      if (validatedData.earnings) {
        await syncDayFinancialState({
          tx,
          dayId,
          clerkId,
          earnings: validatedData.earnings,
        });
      }

      // ───────────────────────────────────
      // HYDRATE
      // ───────────────────────────────────
      const hydratedDay = await repository.findById({
        id: dayId,
        clerkId,
      });

      if (!hydratedDay) {
        throw new AppError({
          code: APP_ERROR_CODES.FAILED_TO_LOAD_DAY,
          message: ERROR_MESSAGES.FAILED_TO_LOAD_DAY,
          statusCode: 500,
        });
      }

      return toDayDto(hydratedDay);
    });
  }
}

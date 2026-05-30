import { PrismaClient } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/errors/app-error";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";
import { deleteDaySchema } from "../schemas/delete-day.schema";
import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { DayRepositoryContract } from "../../domain/contracts/day-repository.contract";
import { APP_ERROR_CODES } from "@/lib/errors/app-error-code";

interface DeleteDayUseCaseRequest {
  clerkId: string;
  dayId: string;
}

export class DeleteDayUseCase {
  constructor(private readonly db: PrismaClient = prisma) {}

  async execute({
    clerkId,
    dayId,
  }: Readonly<DeleteDayUseCaseRequest>): Promise<void> {
    // AUTH
    if (!clerkId) {
      throw new AppError({
        code: APP_ERROR_CODES.UNAUTHORIZED,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: 401,
      });
    }

    // INPUT
    deleteDaySchema.parse({
      id: dayId,
    });

    await this.db.$transaction(async (tx) => {
      const repository: DayRepositoryContract = new DayRepository(tx);

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

      await repository.delete({
        id: dayId,
        clerkId,
      });
    });
  }
}

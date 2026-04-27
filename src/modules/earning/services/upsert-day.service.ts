import { App, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { mapEarningToClient } from "@/modules/earning/mappers/earning.mapper";
import { UpsertDayServiceInput } from "@/modules/interfaces/services/upsert-day-service-input.interface";
import { AppError } from "@/lib/errors/app-error";
import { ErrorCodes } from "@/lib/errors/error-codes";

export async function upsertDayService({
  clerkId,
  dayId,
  data,
}: UpsertDayServiceInput) {
  const { date, hours, kilometers, apps } = data;

  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return await prisma.$transaction(async (tx) => {
    const isUpdate = !!dayId;

    // =====================================================
    // 🔵 UPDATE FLOW (SOLO SI EXISTE dayId)
    // =====================================================
    if (isUpdate) {
      const existingDay = await tx.day.findUnique({
        where: { id: dayId },
      });

      if (!existingDay) {
        throw new AppError({
          message: "Dia não encontrado para atualização",
          code: ErrorCodes.DAY_NOT_FOUND,
          statusCode: 404,
        });
      }

      await tx.day.update({
        where: { id: dayId },
        data: {
          date: normalizedDate,
          hours,
          kilometers,
        },
      });
    }

    // =====================================================
    // 🟢 CREATE FLOW (SIN dayId)
    // =====================================================

    // ❗ validación: no duplicar fecha por usuario
    const existing = await tx.day.findFirst({
      where: {
        clerkId,
        date: normalizedDate,
      },
    });

    if (existing) {
      throw new AppError({
        message: "Já existe um dia registrado para esta data",
        code: ErrorCodes.DAY_ALREADY_EXISTS,
        statusCode: 409,
      });
    }

    const createdDay = await tx.day.create({
      data: {
        clerkId,
        date: normalizedDate,
        hours,
        kilometers,
      },
    });

    if (apps.length > 0) {
      await tx.earning.createMany({
        data: apps.map((app) => ({
          dayId: createdDay.id,
          app: app.name as App,
          amount: new Prisma.Decimal(app.amount),
        })),
      });
    }

    const result = await tx.day.findUnique({
      where: { id: createdDay.id },
      include: { earnings: true },
    });

    return {
      ...result,
      earnings: result?.earnings.map(mapEarningToClient) ?? [],
    };
  });
}

import { prisma } from "@/app/lib/db/prisma";
import { App, Prisma } from "@/generated/prisma/client";
import {
  CreateEarningInput,
  CreateEarningResponse,
  DeleteEarningInput,
  DeleteEarningResponse,
  GetDayByIdResponse,
  GetEarningsResponse,
} from "../types/earning-type";
import { toDayDTO } from "../mappers/earning.mapper";

/**
 * 🔧 Normalize date to UTC day
 */
function normalizeDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

/**
 * 🔧 Get month range
 */
function getMonthRange(month: string) {
  const year = new Date().getFullYear();

  const start = new Date(Date.UTC(year, Number(month) - 1, 1));
  const end = new Date(Date.UTC(year, Number(month), 0, 23, 59, 59));

  return { start, end };
}

/**
 * 🔧 Normalize earnings (merge same app)
 */
function normalizeEarnings(
  input: CreateEarningInput["earnings"],
): { app: App; amount: number }[] {
  const map = new Map<App, number>();

  for (const e of input) {
    map.set(e.app, (map.get(e.app) ?? 0) + e.amount);
  }

  return Array.from(map.entries()).map(([app, amount]) => ({
    app,
    amount,
  }));
}

export const earningService = {
  /**
   * 🚀 CREATE / UPSERT
   */
  async createEarning(
    clerkId: string,
    input: CreateEarningInput,
  ): Promise<CreateEarningResponse> {
    const date = normalizeDate(input.date);
    const earnings = normalizeEarnings(input.earnings);

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const day = await tx.day.upsert({
        where: {
          clerkId_date: {
            clerkId,
            date,
          },
        },
        update: {},
        create: {
          clerkId,
          date,
          hours: new Prisma.Decimal(input.hours),
          kilometers: new Prisma.Decimal(input.kilometers),
        },
      });

      const existing = await tx.earning.findMany({
        where: { dayId: day.id },
      });

      const existingMap = new Map(existing.map((e) => [e.app, e]));

      const operations: Prisma.PrismaPromise<unknown>[] = [];

      for (const e of earnings) {
        const found = existingMap.get(e.app);

        if (found) {
          operations.push(
            tx.earning.update({
              where: { id: found.id },
              data: {
                amount: new Prisma.Decimal(e.amount),
              },
            }),
          );
        } else {
          operations.push(
            tx.earning.create({
              data: {
                dayId: day.id,
                app: e.app,
                amount: new Prisma.Decimal(e.amount),
              },
            }),
          );
        }
      }

      await Promise.all(operations);

      return { success: true };
    });
  },

  /**
   * ❌ DELETE
   */
  async deleteEarning(
    clerkId: string,
    input: DeleteEarningInput,
  ): Promise<DeleteEarningResponse> {
    const existing = await prisma.earning.findFirst({
      where: {
        id: input.id,
        day: {
          clerkId,
        },
      },
    });

    if (!existing) {
      throw new Error("Registro não encontrado");
    }

    await prisma.earning.delete({
      where: { id: input.id },
    });

    return { success: true };
  },

  /**
   * 📊 GET EARNINGS
   */
  async getEarnings(
    clerkId: string,
    month: string,
  ): Promise<GetEarningsResponse> {
    const { start, end } = getMonthRange(month);

    const days = await prisma.day.findMany({
      where: {
        clerkId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        earnings: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return days.map(toDayDTO);
  },

  /**
   * 🔎 GET DAY BY ID
   */
  async getDayById(
    clerkId: string,
    dayId: string,
  ): Promise<GetDayByIdResponse> {
    const day = await prisma.day.findFirst({
      where: {
        id: dayId,
        clerkId,
      },
      include: {
        earnings: true,
      },
    });

    if (!day) {
      throw new Error("Dia não encontrado");
    }

    return toDayDTO(day);
  },
};

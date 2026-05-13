import { AppError } from "@/lib/errors/app-error";
import { ErrorCode } from "@/lib/errors/error-codes";
import { DayFormData } from "../schemas";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ok, fail, mapError } from "@/lib/errors/result";
import { Result } from "@/types/result";

type SuccessResult = Result<{ success: true }>;

type UpdateDayInput = Partial<DayFormData> & {
  id: string;
  clerkId: string;
};

async function recalculateTotals(dayId: string, tx: Prisma.TransactionClient) {
  const [earningAgg, expenseAgg] = await Promise.all([
    tx.earning.aggregate({ where: { dayId }, _sum: { amount: true } }),
    tx.expense.aggregate({ where: { dayId }, _sum: { amount: true } }),
  ]);

  const totalEarnings = earningAgg._sum.amount ?? new Prisma.Decimal(0);
  const totalExpenses = expenseAgg._sum.amount ?? new Prisma.Decimal(0);
  const netProfit = totalEarnings.sub(totalExpenses);

  return { totalEarnings, totalExpenses, netProfit };
}

export const dayService = {
  async createDay(clerkId: string, data: DayFormData): Promise<SuccessResult> {
    try {
      await prisma.$transaction(async (tx) => {
        const day = await tx.day.create({
          data: {
            clerkId,
            date: data.date,
            hours: data.hours,
            kilometers: new Prisma.Decimal(data.kilometers),
          },
          select: { id: true },
        });

        await tx.earning.createMany({
          data: data.earnings.map((e) => ({
            dayId: day.id,
            app: e.app!,
            amount: new Prisma.Decimal(e.amount),
          })),
        });

        const totals = await recalculateTotals(day.id, tx);
        await tx.day.update({ where: { id: day.id }, data: totals });
      });

      return ok({ success: true });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return fail({
          code: ErrorCode.DAY_ALREADY_EXISTS,
          status: 409,
          message: "Já existe um registro para esta data.",
        });
      }

      return fail(mapError(error));
    }
  },

  async updateDay(input: UpdateDayInput): Promise<SuccessResult> {
    const { id, clerkId, ...data } = input;

    try {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.day.findUnique({
          where: { id },
          select: { clerkId: true },
        });

        if (!existing || existing.clerkId !== clerkId) {
          throw new AppError(
            ErrorCode.DAY_NOT_FOUND,
            404,
            "Registro não encontrado.",
          );
        }

        await tx.day.update({
          where: { id },
          data: {
            ...(data.date !== undefined && { date: data.date }),
            ...(data.hours !== undefined && { hours: data.hours }),
            ...(data.kilometers !== undefined && {
              kilometers: new Prisma.Decimal(data.kilometers),
            }),
          },
        });

        if (data.earnings !== undefined) {
          await tx.earning.deleteMany({ where: { dayId: id } });
          await tx.earning.createMany({
            data: data.earnings.map((e) => ({
              dayId: id,
              app: e.app!,
              amount: new Prisma.Decimal(e.amount),
            })),
          });
        }

        const totals = await recalculateTotals(id, tx);
        await tx.day.update({ where: { id }, data: totals });
      });

      return ok({ success: true });
    } catch (error) {
      return fail(mapError(error));
    }
  },

  async deleteDay(id: string, clerkId: string): Promise<SuccessResult> {
    try {
      const { count } = await prisma.day.deleteMany({
        where: { id, clerkId },
      });

      if (count === 0) {
        return fail({
          code: ErrorCode.DAY_NOT_FOUND,
          status: 404,
          message: "Registro não encontrado.",
        });
      }

      return ok({ success: true });
    } catch (error) {
      return fail(mapError(error));
    }
  },
};

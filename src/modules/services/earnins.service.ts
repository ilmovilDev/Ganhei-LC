import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { normalizeToMidnight } from "@/lib/date/normalize-date";
import type { DayDTO } from "../dto/outputs/day.dto";
import {
  DeleteDayServiceInput,
  DeleteDayServiceResult,
  UpsertDayServiceInput,
  UpsertDayServiceResult,
} from "../dto/services";

type PrismaTransaction = Omit<
  Prisma.TransactionClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export class EarningService {
  /* -------------------------------------------------------------------------- */
  /* UPSERT                                                                      */
  /* -------------------------------------------------------------------------- */
  static async upsert(
    input: UpsertDayServiceInput,
  ): Promise<UpsertDayServiceResult> {
    try {
      const { clerkId, dayId, data } = input;

      const normalizedDate = normalizeToMidnight(data.date);

      /* ---------------------------------------------------------------------- */
      /* DUPLICATE DATE VALIDATION                                              */
      /* ---------------------------------------------------------------------- */
      const existingDayWithSameDate = await prisma.day.findFirst({
        where: {
          clerkId,
          date: normalizedDate,

          ...(dayId
            ? {
                NOT: {
                  id: dayId,
                },
              }
            : {}),
        },

        select: {
          id: true,
        },
      });

      if (existingDayWithSameDate) {
        return {
          success: false,
          error: "Já existe um registro para esta data.",

          fieldErrors: {
            date: ["Já existe um registro para esta data."],
          },
        };
      }

      /* ---------------------------------------------------------------------- */
      /* UPDATE                                                                  */
      /* ---------------------------------------------------------------------- */
      if (dayId) {
        const existingDay = await prisma.day.findFirst({
          where: {
            id: dayId,
            clerkId,
          },

          select: {
            id: true,
          },
        });

        if (!existingDay) {
          return {
            success: false,
            error: "Registro não encontrado.",
          };
        }

        const updatedDay = await prisma.$transaction(async (tx) => {
          await this.replaceDayEarnings(tx, {
            dayId,
            earnings: data.earnings,
          });

          const totalEarnings = this.calculateTotalEarnings(data.earnings);

          const totalExpenses = 0;

          const netProfit = Number((totalEarnings - totalExpenses).toFixed(2));

          return tx.day.update({
            where: {
              id: dayId,
            },

            data: {
              date: normalizedDate,
              hours: data.hours,
              kilometers: new Prisma.Decimal(data.kilometers),
              totalEarnings: new Prisma.Decimal(totalEarnings),
              totalExpenses: new Prisma.Decimal(totalExpenses),
              netProfit: new Prisma.Decimal(netProfit),
            },

            include: {
              earnings: true,
            },
          });
        });

        return {
          success: true,
          data: this.mapDayToDTO(updatedDay),
        };
      }

      /* ---------------------------------------------------------------------- */
      /* CREATE                                                                  */
      /* ---------------------------------------------------------------------- */
      const createdDay = await prisma.$transaction(async (tx) => {
        const totalEarnings = this.calculateTotalEarnings(data.earnings);

        const totalExpenses = 0;

        const netProfit = Number((totalEarnings - totalExpenses).toFixed(2));

        return tx.day.create({
          data: {
            clerkId,
            date: normalizedDate,
            hours: data.hours,
            kilometers: new Prisma.Decimal(data.kilometers),
            totalEarnings: new Prisma.Decimal(totalEarnings),
            totalExpenses: new Prisma.Decimal(totalExpenses),
            netProfit: new Prisma.Decimal(netProfit),
            earnings: {
              create: data.earnings.map((earning) => ({
                app: earning.app!,

                amount: new Prisma.Decimal(earning.amount),
              })),
            },
          },

          include: {
            earnings: true,
          },
        });
      });

      return {
        success: true,
        data: this.mapDayToDTO(createdDay),
      };
    } catch (error) {
      console.error("[UPSERT_EARNING_SERVICE_ERROR]", error);

      /* ---------------------------------------------------------------------- */
      /* PRISMA UNIQUE ERROR                                                    */
      /* ---------------------------------------------------------------------- */

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          success: false,

          error: "Já existe um registro para esta data.",

          fieldErrors: {
            date: ["Já existe um registro para esta data."],
          },
        };
      }

      return {
        success: false,
        error: "Erro interno ao salvar registro.",
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /* DELETE                                                                      */
  /* -------------------------------------------------------------------------- */
  static async delete(
    input: DeleteDayServiceInput,
  ): Promise<DeleteDayServiceResult> {
    try {
      const { clerkId, dayId } = input;

      const existingDay = await prisma.day.findFirst({
        where: {
          id: dayId,
          clerkId,
        },

        select: {
          id: true,
        },
      });

      if (!existingDay) {
        return {
          success: false,
          error: "Registro não encontrado.",
        };
      }

      await prisma.day.delete({
        where: {
          id: dayId,
        },
      });

      return {
        success: true,
        deletedDayId: dayId,
      };
    } catch (error) {
      console.error("[DELETE_EARNING_SERVICE_ERROR]", error);

      return {
        success: false,
        error: "Erro interno ao remover registro.",
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /* HELPERS                                                                     */
  /* -------------------------------------------------------------------------- */
  private static calculateTotalEarnings(
    earnings: UpsertDayServiceInput["data"]["earnings"],
  ): number {
    return Number(
      earnings
        .reduce((acc, item) => {
          return acc + item.amount;
        }, 0)
        .toFixed(2),
    );
  }

  private static async replaceDayEarnings(
    tx: PrismaTransaction,

    input: {
      dayId: string;

      earnings: UpsertDayServiceInput["data"]["earnings"];
    },
  ): Promise<void> {
    const { dayId, earnings } = input;

    await tx.earning.deleteMany({
      where: {
        dayId,
      },
    });

    await tx.earning.createMany({
      data: earnings.map((earning) => ({
        dayId,

        app: earning.app!,

        amount: new Prisma.Decimal(earning.amount),
      })),
    });
  }

  private static mapDayToDTO(
    day: Prisma.DayGetPayload<{
      include: {
        earnings: true;
      };
    }>,
  ): DayDTO {
    return {
      id: day.id,
      clerkId: day.clerkId,
      date: day.date,
      hours: day.hours,
      kilometers: Number(day.kilometers),
      totalEarnings: Number(day.totalEarnings),
      totalExpenses: Number(day.totalExpenses),
      netProfit: Number(day.netProfit),
      earnings: day.earnings.map((earning) => ({
        id: earning.id,
        app: earning.app,
        amount: Number(earning.amount),
        createdAt: earning.createdAt,
        updatedAt: earning.updatedAt,
      })),
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
  }
}

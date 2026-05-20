import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  CreateDayInput,
  CreateDayServiceOutput,
  DeleteDayInput,
  DeleteDayServiceOutput,
  GetDaysByMonthInput,
  GetDaysByMonthServiceOutput,
  UpdateDayInput,
  UpdateDayServiceOutput,
} from "../types";
import { ErrorCodes, fail, mapError, ok } from "@/lib/errors";
import { dayDateToDatabase, monthRangeUTC } from "@/lib/date";
import {
  calculateDayTotals,
  ensureDayOwnership,
  mapDay,
  replaceDayEarnings,
} from "../helpers/services";

const DAY_SELECT = {
  id: true,
  date: true,
  hours: true,
  kilometers: true,
  clerkId: true,
  totalEarnings: true,
  totalExpenses: true,
  netProfit: true,
  earnings: {
    select: { id: true, app: true, amount: true },
    orderBy: { createdAt: "asc" as const },
  },
} satisfies Prisma.DaySelect;

export const DayService = {
  async createDay({
    clerkId,
    data,
  }: CreateDayInput): Promise<CreateDayServiceOutput> {
    try {
      await prisma.$transaction(async (tx) => {
        const day = await tx.day.create({
          data: {
            clerkId,
            date: dayDateToDatabase(data.date),
            hours: data.hours,
            kilometers: new Prisma.Decimal(data.kilometers),
          },
          select: { id: true },
        });

        await replaceDayEarnings(tx, day.id, data.earnings);

        const totals = await calculateDayTotals(tx, day.id);

        await tx.day.update({ where: { id: day.id }, data: totals });
      });

      return ok({ success: true });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return fail({
          code: ErrorCodes.DAY_ALREADY_EXISTS,
          status: 409,
          message: "Já existe um registro para esta data.",
        });
      }

      return fail(mapError(error));
    }
  },

  async updateDay({
    clerkId,
    data,
    id,
  }: UpdateDayInput): Promise<UpdateDayServiceOutput> {
    try {
      await prisma.$transaction(async (tx) => {
        await ensureDayOwnership(tx, id, clerkId);

        await tx.day.update({
          where: { id },
          data: {
            hours: data.hours,
            kilometers: new Prisma.Decimal(data.kilometers),
          },
        });

        await replaceDayEarnings(tx, id, data.earnings);

        const totals = await calculateDayTotals(tx, id);

        await tx.day.update({ where: { id }, data: totals });
      });

      return ok({ success: true });
    } catch (error) {
      return fail(mapError(error));
    }
  },

  async deleteDay({
    id,
    clerkId,
  }: DeleteDayInput): Promise<DeleteDayServiceOutput> {
    try {
      await prisma.$transaction(async (tx) => {
        await ensureDayOwnership(tx, id, clerkId);
        await tx.day.delete({ where: { id } });
      });

      return ok({ success: true });
    } catch (error) {
      return fail(mapError(error));
    }
  },

  // ─────────────────────────────────────────────────────────────
  // getDaysByMonth
  //
  // Executa 3 queries em paralelo (Promise.all) para eficiência:
  //
  //  1. findMany  → registros do mês, respeitando `limit` quando
  //                 fornecido (primeiros 5 dias para carga inicial).
  //                 Quando `limit` é undefined, traz tudo.
  //
  //  2. count     → total real de dias no mês, usado pelo frontend
  //                 para saber se existe o botão "carregar mais".
  //
  //  3. aggregate → soma os campos financeiros/produtividade de
  //                 TODOS os dias do mês, sem limite.
  //                 Isso garante que os cards de resumo sempre
  //                 mostram o mês completo, mesmo quando a tabela
  //                 exibe só os primeiros 5 registros.
  // ─────────────────────────────────────────────────────────────
  async getDaysByMonth({
    month,
    year,
    clerkId,
    limit,
  }: GetDaysByMonthInput): Promise<GetDaysByMonthServiceOutput> {
    try {
      const { from, to } = monthRangeUTC(year, month);
      const where = { clerkId, date: { gte: from, lt: to } };

      const [days, total, agg] = await Promise.all([
        // 1. Registros paginados para a tabela
        prisma.day.findMany({
          where,
          orderBy: { date: "desc" },
          select: DAY_SELECT,
          ...(limit ? { take: limit } : {}),
        }),

        // 2. Total real de dias no mês (para controle do botão)
        prisma.day.count({ where }),

        // 3. Agregados do mês completo (para os cards de resumo)
        prisma.day.aggregate({
          where,
          _sum: {
            totalEarnings: true,
            totalExpenses: true,
            netProfit: true,
            hours: true,
            kilometers: true,
          },
        }),
      ]);

      // Converte Decimal → number com fallback 0 para meses sem registros
      const summary = {
        grossProfit: Number(agg._sum.totalEarnings ?? 0),
        totalExpenses: Number(agg._sum.totalExpenses ?? 0),
        netProfit: Number(agg._sum.netProfit ?? 0),
        totalHours: Number(agg._sum.hours ?? 0),
        totalKm: Number(agg._sum.kilometers ?? 0),
        totalDays: total,
      };

      return ok({ days: days.map(mapDay), total, summary });
    } catch (error) {
      return fail(mapError(error));
    }
  },
};

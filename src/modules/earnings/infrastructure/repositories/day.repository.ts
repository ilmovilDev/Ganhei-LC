import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { daySelect } from "../select/day.select";
import {
  CreateDayRepositoryParams,
  DeleteDayRepositoryParams,
  FindDayByIdParams,
  FindManyDaysByMonthParams,
  UpdateDayRepositoryParams,
  UpdateFinancialTotalsRepositoryParams,
} from "../../application/types/day-repository.types";
import { DayRepositoryContract } from "../../domain/contracts/day-repository.contract";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class DayRepository implements DayRepositoryContract {
  constructor(private readonly prisma: PrismaExecutor) {}

  // ─────────────────────────────────────────
  // FIND MANY BY MONTH
  // ─────────────────────────────────────────
  async findManyByMonth({ clerkId, from, to }: FindManyDaysByMonthParams) {
    return this.prisma.day.findMany({
      where: {
        clerkId,
        date: {
          gte: from,
          lt: to,
        },
      },
      select: daySelect,
      orderBy: {
        date: "desc",
      },
    });
  }

  // ─────────────────────────────────────────
  // FIND BY ID
  // ─────────────────────────────────────────
  async findById({ id, clerkId }: FindDayByIdParams) {
    return this.prisma.day.findFirst({
      where: {
        id,
        clerkId,
      },
      select: daySelect,
    });
  }

  // ─────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────
  async create({
    clerkId,
    date,
    hours,
    kilometers,
  }: CreateDayRepositoryParams) {
    return this.prisma.day.create({
      data: {
        clerkId,
        date,
        hours,
        kilometers,
        totalEarnings: 0,
        totalExpenses: 0,
        netProfit: 0,
      },
      select: daySelect,
    });
  }

  // ─────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────
  async update({
    id,
    clerkId,
    data,
  }: UpdateDayRepositoryParams): Promise<void> {
    await this.prisma.day.updateMany({
      where: {
        id,
        clerkId,
      },
      data,
    });
  }

  // ─────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────
  async delete({ id, clerkId }: DeleteDayRepositoryParams): Promise<void> {
    await this.prisma.day.deleteMany({
      where: {
        id,
        clerkId,
      },
    });
  }

  // ─────────────────────────────────────────
  // EXISTS BY DATE
  // ─────────────────────────────────────────
  async existsByDate({ clerkId, date }: { clerkId: string; date: Date }) {
    const count = await this.prisma.day.count({
      where: {
        clerkId,
        date,
      },
    });
    return count > 0;
  }

  // ─────────────────────────────────────────
  // UPDATE FINANCIAL TOTALS
  // ─────────────────────────────────────────
  async updateFinancialTotals({
    id,
    clerkId,
    totalEarnings,
    totalExpenses,
    netProfit,
  }: UpdateFinancialTotalsRepositoryParams): Promise<void> {
    await this.prisma.day.updateMany({
      where: {
        id,
        clerkId,
      },
      data: {
        totalEarnings,
        totalExpenses,
        netProfit,
      },
    });
  }
}

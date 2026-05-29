import { Prisma, PrismaClient } from "@/generated/prisma/client";
import {
  CreateEarningRepositoryParams,
  DeleteEarningRepositoryParams,
  FindEarningRepositoryParams,
} from "../../application/types";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class EarningRepository {
  constructor(private readonly prisma: PrismaExecutor) {}

  async createMany(data: CreateEarningRepositoryParams[]): Promise<void> {
    await this.prisma.earning.createMany({
      data,
    });
  }

  async deleteByDay({ dayId }: DeleteEarningRepositoryParams): Promise<void> {
    await this.prisma.earning.deleteMany({
      where: {
        dayId,
      },
    });
  }

  async findByDay({ dayId }: FindEarningRepositoryParams) {
    return this.prisma.earning.findMany({
      where: {
        dayId,
      },
    });
  }
}

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { DayId } from "../../types/domain.types";

type DBClient = Prisma.TransactionClient | typeof prisma;

export class EarningRepository {
  constructor(private readonly db: DBClient = prisma) {}

  async createMany(data: Prisma.EarningCreateManyInput[]): Promise<void> {
    await this.db.earning.createMany({
      data,
    });
  }

  async deleteByDay(dayId: DayId): Promise<void> {
    await this.db.earning.deleteMany({
      where: {
        dayId,
      },
    });
  }

  async findByDay(dayId: DayId) {
    return this.db.earning.findMany({
      where: {
        dayId,
      },
    });
  }
}

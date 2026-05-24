import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { daySelect } from "../prisma/day.select";
import { PrismaExecutor } from "@/lib/db/prisma.types";

export class DayRepository {
  constructor(private readonly db: PrismaExecutor = prisma) {}

  async create(data: Prisma.DayCreateInput) {
    return this.db.day.create({
      data,
      select: daySelect,
    });
  }

  async update(id: string, data: Prisma.DayUpdateInput) {
    return this.db.day.update({
      where: { id },
      data,
      select: daySelect,
    });
  }

  async delete(id: string) {
    return this.db.day.delete({
      where: { id },
    });
  }
  async findById(id: string) {
    return this.db.day.findUnique({
      where: { id },
      select: daySelect,
    });
  }

  async findManyByMonth({
    clerkId,
    startDate,
    endDate,
    limit,
  }: {
    clerkId: string;
    startDate: Date;
    endDate: Date;
    limit?: number;
  }) {
    return this.db.day.findMany({
      where: {
        clerkId,

        date: {
          gte: startDate,
          lte: endDate,
        },
      },

      orderBy: {
        date: "desc",
      },

      take: limit,

      select: daySelect,
    });
  }
}

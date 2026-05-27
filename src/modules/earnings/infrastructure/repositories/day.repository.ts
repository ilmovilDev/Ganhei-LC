import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { PrismaExecutor } from "@/lib/db/prisma.types";
import { DAY_SELECT } from "../prisma/day.select";

export class DayRepository {
  constructor(private readonly db: PrismaExecutor = prisma) {}

  async create(data: Prisma.DayCreateInput) {
    return this.db.day.create({
      data,
      select: DAY_SELECT,
    });
  }

  async update(id: string, data: Prisma.DayUpdateInput) {
    return this.db.day.update({
      where: { id },
      data,
      select: DAY_SELECT,
    });
  }

  async delete(id: string) {
    return this.db.day.delete({
      where: { id },
      select: DAY_SELECT,
    });
  }

  async findById(id: string) {
    return this.db.day.findFirst({
      where: { id },
      select: DAY_SELECT,
    });
  }

  async findManyByMonth({
    clerkId,
    startDate,
    endDate,
  }: {
    clerkId: string;
    startDate: Date;
    endDate: Date;
  }) {
    return this.db.day.findMany({
      where: {
        clerkId,
        date: { gte: startDate, lt: endDate },
      },

      orderBy: {
        date: "desc",
      },

      select: DAY_SELECT,
    });
  }
}

import { Prisma, PrismaClient } from "@/generated/prisma/client";

export type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

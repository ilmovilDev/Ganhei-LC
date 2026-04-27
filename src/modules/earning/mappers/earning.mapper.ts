import { Earning } from "@/generated/prisma/client";

export function mapEarningToClient(e: Earning) {
  return {
    id: e.id,
    dayId: e.dayId,
    app: e.app,
    amount: Number(e.amount),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  };
}

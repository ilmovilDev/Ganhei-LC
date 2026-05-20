import { Prisma } from "@/generated/prisma/client";
import { AppError, ErrorCodes } from "@/lib/errors";

export async function ensureDayOwnership(
  tx: Prisma.TransactionClient,
  dayId: string,
  clerkId: string,
) {
  const day = await tx.day.findUnique({
    where: { id: dayId },
    select: {
      id: true,
      clerkId: true,
    },
  });

  if (!day || day.clerkId !== clerkId) {
    throw new AppError(
      ErrorCodes.DAY_NOT_FOUND,
      404,
      "Registro não encontrado.",
    );
  }

  return day;
}

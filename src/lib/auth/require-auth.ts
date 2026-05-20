import { auth } from "@clerk/nextjs/server";
import { AppError, ErrorCodes } from "@/lib/errors";

export async function requireAuth(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new AppError(ErrorCodes.UNAUTHORIZED, 401, "Não autorizado.");
  }

  return userId;
}

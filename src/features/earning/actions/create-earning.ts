import { auth } from "@clerk/nextjs/server";
import { AppError } from "@/components/shared/errors/app-errors";
import { createEarningSchema } from "../schemas/earning-schema";
import { earningService } from "../services/earning-service";
import { handleError } from "@/app/lib/errors/handle-error";

export async function createEarningAction(input: unknown) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new AppError("UNAUTHORIZED", "Não autorizado");
    }

    const parsed = createEarningSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return await earningService.createEarning(userId, parsed.data);
  } catch (error) {
    handleError(error);
  }
}

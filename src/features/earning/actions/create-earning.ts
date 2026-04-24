"use server";

import { auth } from "@clerk/nextjs/server";
import { earningService } from "../services/earning-service";
import { createEarningSchema } from "../schemas/earning-schema";
import { getZodErrorMessage } from "@/app/lib/zod/error";

export async function createEarningAction(input: unknown) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Não autorizado");
  }

  const parsed = createEarningSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(getZodErrorMessage(parsed.error));
  }

  try {
    return await earningService.createEarning(userId, parsed.data);
  } catch (error) {
    console.error("createEarningAction", error);
    throw new Error("Erro ao criar ganhos");
  }
}

"use server";

import { auth } from "@clerk/nextjs/server";
import { earningService } from "../services/earning-service";
import { getDayByIdSchema } from "../schemas/earning-schema";
import { getZodErrorMessage } from "@/app/lib/zod/error";

export async function getDayByIdAction(input: unknown) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Não autorizado");
  }

  const parsed = getDayByIdSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(getZodErrorMessage(parsed.error));
  }

  try {
    return await earningService.getDayById(userId, parsed.data.dayId);
  } catch (error) {
    console.error("getDayByIdAction", error);
    throw new Error("Erro ao buscar dia");
  }
}

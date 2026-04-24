"use server";

import { auth } from "@clerk/nextjs/server";
import { earningService } from "../services/earning-service";
import { deleteEarningSchema } from "../schemas/earning-schema";
import { getZodErrorMessage } from "@/app/lib/zod/error";

export async function deleteEarningAction(input: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Não autorizado");
  }

  const parsed = deleteEarningSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(getZodErrorMessage(parsed.error));
  }

  try {
    return await earningService.deleteEarning(userId, parsed.data);
  } catch (error) {
    console.error("deleteEarningAction", error);
    throw new Error("Erro ao deletar ganho");
  }
}

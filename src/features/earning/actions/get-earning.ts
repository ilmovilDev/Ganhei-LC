"use server";

import { auth } from "@clerk/nextjs/server";
import { earningService } from "../services/earning-service";
import { getEarningsSchema } from "../schemas/earning-schema";
import { GetEarningsResponse } from "../types/earning-type";

/**
 * 🎯 GET EARNINGS ACTION
 */
export async function getEarningsAction(
  input: unknown,
): Promise<GetEarningsResponse> {
  /**
   * 🔐 AUTH
   */
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Não autorizado");
  }

  /**
   * 🧪 VALIDACIÓN ZOD
   */
  const parsed = getEarningsSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid input");
  }

  const { month } = parsed.data;

  /**
   * 🚀 SERVICE
   */
  try {
    const data = await earningService.getEarnings(userId, month);

    return data;
  } catch (error) {
    console.error("getEarningsAction error:", error);
    throw new Error("Erro ao buscar ganhos");
  }
}

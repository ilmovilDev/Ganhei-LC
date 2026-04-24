import { AppError } from "@/components/shared/errors/app-errors";
import { getZodErrorMessage } from "../zod/error";

export function handleError(error: unknown): never {
  /**
   * 🔥 ZOD ERROR
   */
  if (error && typeof error === "object" && "issues" in error) {
    throw new AppError("VALIDATION_ERROR", getZodErrorMessage(error));
  }

  /**
   * 🔥 APP ERROR (ya controlado)
   */
  if (error instanceof AppError) {
    throw error;
  }

  /**
   * 🔥 FALLBACK
   */
  throw new AppError("INTERNAL_ERROR", "Erro inesperado");
}

import { ZodError } from "zod";

export function getZodErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues?.[0]?.message ?? "Erro de validação";
  }

  return "Erro inválido";
}

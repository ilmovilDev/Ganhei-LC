import { Prisma } from "@/generated/prisma/client";
import { ZodError } from "zod";

import { AppError } from "./app-error";
import { Result } from "@/types/result";

export function mapError(error: unknown): Result<never> {
  // App errors
  if (error instanceof AppError) {
    return {
      success: false,

      code: error.code,

      error: {
        message: error.message,
      },
    };
  }

  // Zod validation
  if (error instanceof ZodError) {
    return {
      success: false,

      code: "VALIDATION_ERROR",

      error: {
        message: error.issues[0]?.message ?? "Dados inválidos.",
      },

      details: error.flatten(),
    };
  }

  // Prisma known errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          success: false,

          code: "CONFLICT",

          error: {
            message: "Esse registro já existe.",
          },
        };

      case "P2025":
        return {
          success: false,

          code: "NOT_FOUND",

          error: {
            message: "Registro não encontrado.",
          },
        };

      default:
        return {
          success: false,

          code: "INTERNAL_ERROR",

          error: {
            message: "Erro no banco de dados.",
          },
        };
    }
  }

  // Prisma connection/init
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      success: false,

      code: "INTERNAL_ERROR",

      error: {
        message: "Não foi possível conectar ao banco de dados.",
      },
    };
  }

  // Unknown error
  console.error("[UNHANDLED_ERROR]", error);

  return {
    success: false,

    code: "INTERNAL_ERROR",

    error: {
      message: "Ocorreu um erro inesperado.",
    },
  };
}

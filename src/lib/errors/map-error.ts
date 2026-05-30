import { ZodError } from "zod";
import { AppError } from "./app-error";
import { handleZodError } from "./handle-zod-error";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export function mapError(error: unknown) {
  // AppError

  if (error instanceof AppError) {
    return {
      success: false,

      error: {
        code: error.code,
        message: error.message,
      },

      statusCode: error.statusCode,
    };
  }

  // Zod

  if (error instanceof ZodError) {
    return {
      success: false,

      error: {
        code: "VALIDATION_ERROR",

        message: ERROR_MESSAGES.VALIDATION_ERROR,

        fields: handleZodError(error),
      },

      statusCode: 400,
    };
  }

  // Prisma Unique

  if (error instanceof PrismaClientKnownRequestError) {
    return {
      success: false,

      error: {
        code: "DATABASE_ERROR",

        message: "Erro de banco de dados.",
      },

      statusCode: 500,
    };
  }

  // Prisma Validation

  if (error instanceof PrismaClientValidationError) {
    return {
      success: false,

      error: {
        code: "DATABASE_VALIDATION_ERROR",

        message: "Consulta inválida.",
      },

      statusCode: 500,
    };
  }

  // Prisma Initialization

  if (error instanceof PrismaClientInitializationError) {
    return {
      success: false,

      error: {
        code: "DATABASE_CONNECTION_ERROR",

        message: "Não foi possível conectar ao banco de dados.",
      },

      statusCode: 500,
    };
  }

  // Prisma Panic

  if (error instanceof PrismaClientRustPanicError) {
    return {
      success: false,

      error: {
        code: "DATABASE_PANIC",

        message: "Erro crítico de banco de dados.",
      },

      statusCode: 500,
    };
  }

  // Generic Error

  if (error instanceof Error) {
    return {
      success: false,

      error: {
        code: "INTERNAL_ERROR",

        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : ERROR_MESSAGES.INTERNAL_ERROR,
      },

      statusCode: 500,
    };
  }

  // Unknown

  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: ERROR_MESSAGES.INTERNAL_ERROR,
    },
    statusCode: 500,
  };
}

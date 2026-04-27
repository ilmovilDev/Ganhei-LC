import { AppError } from "./app-error";

export function toAppError(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      context: error.context,
    };
  }

  return {
    success: false,
    message: "Erro interno do servidor",
    code: "INTERNAL_ERROR",
    statusCode: 500,
  };
}

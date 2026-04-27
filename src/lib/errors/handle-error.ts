import { Result } from "../result/result";
import { AppError } from "./app-error";

export async function handleError<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: false,
      error: {
        message: "Erro interno",
        code: "INTERNAL_ERROR",
      },
    };
  }
}

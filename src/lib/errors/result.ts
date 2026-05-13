import { ErrorCode } from "@/lib/errors/error-codes";
import { AppError } from "@/lib/errors/app-error";
import { Result, ResultError } from "@/types/result";

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

export function fail<T>(error: ResultError): Result<T> {
  return { success: false, error };
}

export function mapError(error: unknown): ResultError {
  if (error instanceof AppError) {
    return error.toResultError();
  }
  console.error("[mapError] Unexpected error:", error);
  return {
    code: ErrorCode.INTERNAL_ERROR,
    status: 500,
    message: "Ocorreu um erro inesperado. Tente novamente.",
  };
}

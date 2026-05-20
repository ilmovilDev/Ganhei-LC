import { Result, ResultError } from "@/types/result";
import { AppError, ErrorCodes } from ".";

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
    code: ErrorCodes.INTERNAL_ERROR,
    status: 500,
    message: "Ocorreu um erro inesperado. Tente novamente.",
  };
}

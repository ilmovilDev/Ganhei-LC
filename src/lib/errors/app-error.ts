import { ResultError } from "@/types/result";
import { ErrorCodes } from "./error-codes";

export class AppError extends Error {
  readonly code: ErrorCodes;
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    code: ErrorCodes,
    status: number,
    message?: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message ?? code);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  toResultError(): ResultError {
    return {
      code: this.code,
      status: this.status,
      message: this.message,
      fieldErrors: this.fieldErrors,
    };
  }
}

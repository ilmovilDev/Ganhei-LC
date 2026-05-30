import { AppErrorCode } from "./app-error-code";

export interface AppErrorOptions {
  code: AppErrorCode;
  message: string;
  statusCode?: number;
  cause?: unknown;
}

export class AppError extends Error {
  readonly code: AppErrorCode;

  readonly statusCode: number;

  readonly cause?: unknown;

  constructor({ code, message, statusCode = 400, cause }: AppErrorOptions) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;

    Error.captureStackTrace?.(this, AppError);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

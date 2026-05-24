import { AppErrorCode } from "./app-error-code";

export class AppError extends Error {
  constructor(
    message: string,

    public readonly code: AppErrorCode,

    public readonly statusCode = 400,
  ) {
    super(message);

    this.name = "AppError";
  }
}

import { AppErrorCode } from "@/lib/errors/app-error-code";

export interface ResultError {
  message: string;
}

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ResultError;
      code: AppErrorCode;
      details?: unknown;
    };

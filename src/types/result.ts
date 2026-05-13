import { ErrorCode } from "@/lib/errors/error-codes";

export type ResultError = {
  code: ErrorCode;
  status: number;

  // UI
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ResultError };

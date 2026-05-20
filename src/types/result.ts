import { ErrorCodes } from "@/lib/errors";

export type ResultError = {
  code: ErrorCodes;
  status: number;

  // UI
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ResultError };

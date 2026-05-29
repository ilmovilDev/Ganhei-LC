import { ZodError } from "zod";

import { AppError } from "./app-error";

export function mapError(error: unknown) {
  if (error instanceof AppError) {
    return {
      message: error.message,

      statusCode: error.statusCode,
    };
  }

  if (error instanceof ZodError) {
    return {
      message: error.issues[0]?.message ?? "Validation error",

      statusCode: 400,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,

      statusCode: 500,
    };
  }

  return {
    message: "Internal server error",

    statusCode: 500,
  };
}

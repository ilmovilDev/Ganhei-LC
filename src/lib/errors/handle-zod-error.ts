import { ZodError } from "zod";

export interface ValidationFieldError {
  field: string;
  message: string;
}

export function handleZodError(error: ZodError): ValidationFieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

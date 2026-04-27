export const ErrorCodes = {
  DAY_ALREADY_EXISTS: "DAY_ALREADY_EXISTS",
  DAY_NOT_FOUND: "DAY_NOT_FOUND",
  INVALID_DATE: "INVALID_DATE",
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

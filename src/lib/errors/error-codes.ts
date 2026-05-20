/**
 * Canonical error codes for the entire application.
 *
 * Convention:
 *   DOMAIN_REASON  →  e.g. DAY_NOT_FOUND, EARNING_DUPLICATE_APP
 *
 * Never use raw strings outside this enum — grep-ability and
 * refactor safety are the whole point.
 */
export enum ErrorCodes {
  // ── Generic ────────────────────────────────────────────────────
  INTERNAL_ERROR = "INTERNAL_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",

  // ── Day ────────────────────────────────────────────────────────
  DAY_NOT_FOUND = "DAY_NOT_FOUND",
  DAY_ALREADY_EXISTS = "DAY_ALREADY_EXISTS",
  DAY_FUTURE_DATE = "DAY_FUTURE_DATE",

  // ── Earning ────────────────────────────────────────────────────
  EARNING_NOT_FOUND = "EARNING_NOT_FOUND",
  EARNING_DUPLICATE_APP = "EARNING_DUPLICATE_APP",

  // ── Expense ────────────────────────────────────────────────────
  EXPENSE_NOT_FOUND = "EXPENSE_NOT_FOUND",
}

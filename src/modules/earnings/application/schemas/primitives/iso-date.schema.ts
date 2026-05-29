import { z } from "zod";
import { DayDate } from "@/shared/lib/date/day-date";

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return !Number.isNaN(date.getTime());
  })
  .transform((value) => value as DayDate);

import { z } from "zod";
import { hoursSchema, kilometersSchema } from "./primitives";
import { earningsArraySchema } from "./shared/earnings-array.schema";
import { isoDateSchema } from "@/shared/schemas/date/iso-date.schema";

export const createDaySchema = z.object({
  date: isoDateSchema,
  hours: hoursSchema,
  kilometers: kilometersSchema,
  earnings: earningsArraySchema,
});

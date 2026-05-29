import { z } from "zod";
import { hoursSchema, isoDateSchema, kilometersSchema } from "./primitives";
import { earningsArraySchema } from "./shared/earnings-array.schema";

export const createDaySchema = z.object({
  date: isoDateSchema,
  hours: hoursSchema,
  kilometers: kilometersSchema,
  earnings: earningsArraySchema,
});

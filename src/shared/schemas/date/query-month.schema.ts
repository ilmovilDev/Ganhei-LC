import { z } from "zod";
import { monthSchema } from "./month.schema";
import { yearSchema } from "./year.schema";

export const queryMonthSchema = z.object({
  month: monthSchema,
  year: yearSchema,
});

export type QueryMonthInput = z.input<typeof queryMonthSchema>;
export type QueryMonthOutput = z.output<typeof queryMonthSchema>;

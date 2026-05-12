import type { z } from "zod";
import { dayFormSchema } from "../schemas/day.schema";
import { EarningInputSchema } from "../schemas/earning.schema";

export type DayFormValues = z.infer<typeof dayFormSchema>;

export type EarningFormValues = z.infer<typeof EarningInputSchema>;

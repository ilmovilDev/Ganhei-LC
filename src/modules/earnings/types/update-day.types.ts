import { z } from "zod";
import { updateDaySchema } from "../application/schemas/update-day.schema";

export type UpdateDayInput = z.input<typeof updateDaySchema>;

export type UpdateDayOutput = z.output<typeof updateDaySchema>;

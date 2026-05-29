import { z } from "zod";
import { deleteDaySchema } from "../application/schemas/delete-day.schema";

export type DeleteDayInput = z.input<typeof deleteDaySchema>;

export type DeleteDayOutput = z.output<typeof deleteDaySchema>;

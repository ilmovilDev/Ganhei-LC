import { z } from "zod";
import { createDaySchema } from "../application/schemas/create-day.schema";

export type CreateDayInput = z.input<typeof createDaySchema>;

export type CreateDayOutput = z.output<typeof createDaySchema>;

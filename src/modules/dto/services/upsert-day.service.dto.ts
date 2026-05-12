import type { DayFormValues } from "../../types/form.types";

export type UpsertDayServiceInput = {
  clerkId: string;
  dayId?: string;
  data: DayFormValues;
};

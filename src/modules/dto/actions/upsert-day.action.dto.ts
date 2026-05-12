import type { DayFormValues } from "../../types/form.types";

export type UpsertDayActionInput = {
  dayId?: string;
  data: DayFormValues;
};

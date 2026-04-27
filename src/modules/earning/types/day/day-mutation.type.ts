import { DayFormData } from "../../schemas/day.schema";

export interface UpsertDayMutationInput {
  dayId: string | null;
  data: DayFormData;
}

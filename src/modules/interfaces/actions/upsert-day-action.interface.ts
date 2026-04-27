import { DayFormData } from "@/modules/earning/schemas/day.schema";

export interface UpsertDayActionInputProps {
  dayId: string | null;
  data: DayFormData;
}

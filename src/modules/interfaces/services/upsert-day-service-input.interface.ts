import { DayFormData } from "@/modules/earning/schemas/day.schema";

export interface UpsertDayServiceInput {
  clerkId: string;
  dayId: string | null;
  data: DayFormData;
}

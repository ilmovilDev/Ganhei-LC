import { DayFormInput } from "../schemas/day.schema";
import { ClerkId, DayId } from "./domain.types";

export interface CreateDayInput {
  clerkId: ClerkId;
  data: DayFormInput;
}

export interface UpdateDayInput {
  id: DayId;
  clerkId: ClerkId;
  data: DayFormInput;
}

export interface DeleteDayInput {
  id: DayId;
  clerkId: ClerkId;
}

export interface GetDaysByMonthInput {
  clerkId: ClerkId;
  month: number;
  year: number;
  limit?: number;
}

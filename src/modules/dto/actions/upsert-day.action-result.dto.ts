import type { DayDTO } from "../outputs/day.dto";

export type UpsertDayActionResult = {
  success: boolean;
  data?: DayDTO;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

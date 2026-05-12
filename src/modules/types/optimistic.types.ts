import type { DayDTO } from "../dto/outputs/day.dto";

export type OptimisticDayDTO = DayDTO & {
  optimistic?: boolean;
  temporaryId?: boolean;
};

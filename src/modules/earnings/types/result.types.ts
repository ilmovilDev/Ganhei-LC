import { Result } from "@/types/result";
import { DayListItemDto } from "../application/dtos/day-list-item.dto";

export type GetDaysByMonthData = DayListItemDto[];
export type CreateDayResult = Result<{ success: true }>;
export type UpdateDayResult = Result<{ success: true }>;
export type DeleteDayResult = Result<{ success: true }>;
export type GetDaysByMonthResult = Result<GetDaysByMonthData>;

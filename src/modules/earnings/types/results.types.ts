import { Result } from "@/types/result";
import { DayListItemDto } from "../application/dtos/day-list-item.dto";

export type GetDaysByMonthData = DayListItemDto[];
export type CreateDayActionResult = Result<{ success: true }>;
export type UpdateDayActionResult = Result<{ success: true }>;
export type DeleteDayActionResult = Result<{ success: true }>;
export type GetDaysByMonthActionResult = Result<GetDaysByMonthData>;

import { EarningItemDto } from "./earning-item.dto";

export interface DayDetailsDto {
  id: string;
  date: string;
  hours: number;
  kilometers: number;
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  createdAt: string;
  updatedAt: string;
  earnings: EarningItemDto[];
}

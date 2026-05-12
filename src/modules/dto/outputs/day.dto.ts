import type { EarningDTO } from "./earning.dto";

export type DayDTO = {
  id: string;
  clerkId: string;
  date: Date;
  hours: number;
  kilometers: number;
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  earnings: EarningDTO[];
  createdAt: Date;
  updatedAt: Date;
};

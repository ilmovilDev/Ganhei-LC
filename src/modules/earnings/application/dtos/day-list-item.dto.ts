import { App } from "@/generated/prisma/enums";

export interface DayListItemDto {
  id: string;
  date: string;
  hours: number;
  kilometers: number;
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  createdAt: string;
  earnings: {
    id: string;
    app: App;
    amount: number;
  }[];
}

import { App } from "@/generated/prisma/enums";

export type ClerkId = string;
export type DayId = string;

export interface Earning {
  id: string;
  app: App;
  amount: number;
}

export interface Day {
  id: DayId;
  clerkId: ClerkId;
  date: Date;
  hours: number;
  kilometers: number;
  earnings: Earning[];
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthSummary {
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  totalHours: number;
  totalKilometers: number;
  totalDays: number;
}

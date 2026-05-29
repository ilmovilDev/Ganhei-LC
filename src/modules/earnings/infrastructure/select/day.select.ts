import { App } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

type Decimal = Prisma.Decimal;

export const daySelect = {
  id: true,
  clerkId: true,
  date: true,
  hours: true,
  kilometers: true,
  totalEarnings: true,
  totalExpenses: true,
  netProfit: true,
  createdAt: true,
  updatedAt: true,
  earnings: {
    select: {
      id: true,
      app: true,
      amount: true,
    },
  },
};

export interface PrismaDayEarningPayload {
  id: string;
  app: App;
  amount: Decimal;
}

export interface PrismaDayPayload {
  id: string;
  clerkId: string;
  date: Date;
  hours: number;
  kilometers: Decimal;
  totalEarnings: Decimal;
  totalExpenses: Decimal;
  netProfit: Decimal;
  createdAt: Date;
  updatedAt: Date;
  earnings: PrismaDayEarningPayload[];
}

export interface FindManyDaysByMonthParams {
  clerkId: string;
  from: Date;
  to: Date;
}

export interface FindDayByIdParams {
  id: string;
  clerkId: string;
}

export interface CreateDayRepositoryParams {
  clerkId: string;
  date: Date;
  hours: number;
  kilometers: number;
}

export interface UpdateDayRepositoryParams {
  id: string;
  clerkId: string;

  data: {
    hours?: number;
    kilometers?: number;

    totalEarnings?: number;
    totalExpenses?: number;
    netProfit?: number;
  };
}

export interface DeleteDayRepositoryParams {
  id: string;
  clerkId: string;
}

export interface UpdateFinancialTotalsRepositoryParams {
  id: string;
  clerkId: string;
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
}

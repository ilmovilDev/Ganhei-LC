export interface DashboardFilters {
  userId: string;
  month: string; // "MM"
}

export interface DashboardRaw {
  totalEarnings: number; // bruto
  totalExpenses: number;
  totalNet: number; // neto
  totalHours: number;
  totalKm: number;
  daysCount: number;
}

export interface DashboardMetrics {
  gross: number;
  net: number;
  expenses: number;
  perHour: number;
  km: number;
  hasData: boolean;
}

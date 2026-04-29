import { DashboardMetrics, DashboardRaw } from "../types/dashboard.types";

export function mapDashboardToMetrics(raw: DashboardRaw): DashboardMetrics {
  const perHour = raw.totalHours > 0 ? raw.totalNet / raw.totalHours : 0;

  return {
    gross: raw.totalEarnings,
    net: raw.totalNet,
    expenses: raw.totalExpenses,
    perHour,
    km: raw.totalKm,
    hasData: raw.daysCount > 0,
  };
}

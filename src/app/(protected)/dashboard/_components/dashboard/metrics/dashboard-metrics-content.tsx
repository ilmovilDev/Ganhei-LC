"use client";

import { useDashboard } from "@/modules/dashboard/hooks/use-dashboard";

import DashboardEmptyState from "./dashboard-empty-state";
import MetricsGridSkeleton from "./metrics-grid-skeleton";
import MetricsGrid from "./metric-grid";

interface DashboardContentProps {
  month: string;
}

export default function DashboardMetricsContent({
  month,
}: DashboardContentProps) {
  const { data, isLoading } = useDashboard(month);

  // 🔥 1. Loading
  if (isLoading) {
    return <MetricsGridSkeleton />;
  }

  // 🔥 2. Empty state (FIX)
  if (!data?.hasData) {
    return <DashboardEmptyState />;
  }

  // 🔥 3. Data
  return <MetricsGrid data={data} />;
}

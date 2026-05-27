"use client";

import { EmptyState, ErrorState, LoadingState } from "@/components/shared";
import { useDaysByMonth } from "../../hooks";
import { useSelectedPeriod } from "@/providers/context-provider";
import EarningsTable from "../table/earnings-table";

export default function DaysView() {
  const { month, year } = useSelectedPeriod();

  const { days, isLoading, isError } = useDaysByMonth({
    enabled: !!month && !!year,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!days.length) return <EmptyState />;

  return <EarningsTable data={days} />;
}

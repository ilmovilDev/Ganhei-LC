"use client";

import { AlertCircle } from "lucide-react";

import DaysTable from "./days-table";
import DaysEmptyState from "./days-empty-state";

import { useDays } from "../../hooks/use-day";
import { useEarningsContext } from "../../providers/earning-provider";

export default function DaysView() {
  const { month, year } = useEarningsContext();
  const { days, error, isPending } = useDays();

  /* ---------------------------------------------------------------------- */
  /* ERROR                                                                  */
  /* ---------------------------------------------------------------------- */
  if (error) {
    return (
      <div className="border-destructive/20 bg-destructive/5 text-destructive flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
        <AlertCircle className="h-4 w-4 shrink-0" />

        <span>{error}</span>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* LOADING INITIAL                                                        */
  /* ---------------------------------------------------------------------- */
  if (isPending && days.length === 0) {
    return <DaysTable data={[]} isLoading />;
  }

  /* ---------------------------------------------------------------------- */
  /* EMPTY                                                                   */
  /* ---------------------------------------------------------------------- */
  if (!isPending && days.length === 0) {
    return <DaysEmptyState month={month} year={year} />;
  }

  /* ---------------------------------------------------------------------- */
  /* DATA                                                                     */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="flex h-full min-h-0 flex-col">
      <DaysTable data={days} isLoading={isPending} />
    </div>
  );
}

"use client";

import { AlertCircle } from "lucide-react";
import DaysTable from "./days-table";
import DaysEmptyState from "./days-empty-state";
import { useDays } from "../../hooks/use-day";
import { DaysTableSkeleton } from "./days-table-skeleton";

export default function DaysView() {
  const { data, error, isPending } = useDays();

  if (isPending) {
    return <DaysTableSkeleton />;
  }

  if (error) {
    return (
      <div className="border-destructive/20 bg-destructive/5 text-destructive flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
        <AlertCircle className="h-4 w-4" />
        {(error as Error).message}
      </div>
    );
  }

  if (!data?.length) {
    return <DaysEmptyState />;
  }

  return <DaysTable data={data} />;
}

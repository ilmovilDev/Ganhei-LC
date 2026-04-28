"use client";

import MetricsGrid from "./metric-grid";

interface DashboardContentProps {
  month: string;
}

export default function DashboardContent({ month }: DashboardContentProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="no-scrollbar min-h-full px-4 py-2">
        <MetricsGrid month={month} />
      </div>
    </div>
  );
}

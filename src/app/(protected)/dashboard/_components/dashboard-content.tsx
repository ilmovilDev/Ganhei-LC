"use client";

import MetricsGrid from "./metric-grid";

export default function DashboardContent() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="no-scrollbar min-h-full p-4">
        <MetricsGrid />
      </div>
    </div>
  );
}

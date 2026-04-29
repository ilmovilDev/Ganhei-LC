"use client";

import MetricCardSkeleton from "./metric-card-skeleton";

export default function MetricsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-6 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={
            index === 0
              ? "col-span-2 lg:col-span-3 xl:col-span-1"
              : "lg:col-span-2 xl:col-span-1"
          }
        >
          <MetricCardSkeleton />
        </div>
      ))}
    </div>
  );
}

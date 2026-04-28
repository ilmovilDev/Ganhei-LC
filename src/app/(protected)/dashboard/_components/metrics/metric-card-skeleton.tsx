"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ---------------------------------------------

export default function MetricCardSkeleton() {
  return (
    <Card className="h-full">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          {/* ICON */}
          <Skeleton className="size-10 rounded-lg" />

          {/* TEXT */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardHeader>

      {/* DESCRIPTION */}
      <CardContent>
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}

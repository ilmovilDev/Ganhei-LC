"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ---------------------------------------------

type MetricCardSkeletonProps = {
  size?: "default" | "highlight";
  className?: string;
};

// ---------------------------------------------

const sizeVariants = {
  default: {
    icon: "size-8 md:size-10",
    title: "h-3 w-20",
    value: "h-5 w-24",
    description: "h-3 w-28",
    gap: "gap-2",
  },
  highlight: {
    icon: "size-10 md:size-10",
    title: "h-3 w-24",
    value: "h-6 w-32",
    description: "h-3 w-32",
    gap: "gap-3 md:gap-2",
  },
};

// ---------------------------------------------

export default function MetricCardSkeleton({
  size = "default",
  className,
}: MetricCardSkeletonProps) {
  const variant = sizeVariants[size];

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col justify-between p-4">
        {/* TOP */}
        <div className={cn("flex items-start", variant.gap)}>
          {/* ICON */}
          <Skeleton
            className={cn("shrink-0 rounded-lg", "bg-muted/60", variant.icon)}
          />

          {/* TEXT */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton className={variant.title} />
            <Skeleton className={variant.value} />
          </div>
        </div>

        {/* BOTTOM */}
        <Skeleton className={cn("mt-3", variant.description)} />
      </CardContent>
    </Card>
  );
}

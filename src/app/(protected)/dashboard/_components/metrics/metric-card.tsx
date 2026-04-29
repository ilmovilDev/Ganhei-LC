"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// ---------------------------------------------
type MetricCardSize = "default" | "highlight";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;

  color?: "green" | "blue" | "purple" | "red" | "gray";
  size?: MetricCardSize; // 🔥 nuevo
  className?: string;
}

// ---------------------------------------------

const sizeVariants = {
  default: {
    title: "text-[11px] sm:text-xs",
    value: "text-[clamp(0.9rem,2.5vw,1.25rem)]",
    description: "text-[11px] sm:text-xs",
    icon: "size-8 md:size-10",
    gap: "gap-2",
  },

  highlight: {
    // 🔥 Mobile grande → Desktop normal
    title: "text-xs sm:text-sm md:text-xs",
    value:
      "text-[clamp(1.2rem,3vw,1.75rem)] md:text-[clamp(0.9rem,2vw,1.25rem)]",
    description: "text-xs sm:text-sm md:text-xs",
    icon: "size-10 sm:size-11 md:size-10",
    gap: "gap-4 md:gap-2",
  },
};

// ---------------------------------------------

const colorVariants = {
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
  gray: {
    bg: "bg-muted",
    text: "text-foreground",
  },
};

// ---------------------------------------------

export default function MetricCard({
  title,
  value,
  description,
  icon,
  color = "gray",
  size = "default",
  className,
}: MetricCardProps) {
  const variant = colorVariants[color];
  const sizeVariant = sizeVariants[size];

  return (
    <Card className={cn("h-full transition hover:shadow-md", className)}>
      <CardContent className="flex flex-col justify-between">
        {/* TOP */}
        <div className={cn("flex items-start", sizeVariant.gap)}>
          {/* ICON */}
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg",
              sizeVariant.icon,
              variant.bg,
            )}
          >
            <div className={variant.text}>{icon}</div>
          </div>

          {/* TEXT */}
          <div className="flex min-w-0 flex-col">
            <span
              className={cn(
                "text-muted-foreground truncate leading-tight wrap-break-word",
                sizeVariant.title,
              )}
            >
              {title}
            </span>

            <span
              className={cn(
                "leading-tight font-semibold tracking-tight",
                "overflow-hidden whitespace-nowrap",
                sizeVariant.value,
                variant.text,
              )}
            >
              {value}
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p
          className={cn(
            "text-muted-foreground mt-2 line-clamp-2 truncate leading-relaxed",
            sizeVariant.description,
          )}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

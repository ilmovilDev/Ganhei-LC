"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// ---------------------------------------------

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;

  color?: "green" | "blue" | "purple" | "red" | "gray";
  className?: string;
}

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
  className,
}: MetricCardProps) {
  const variant = colorVariants[color];

  return (
    <Card className={cn("h-full transition", "hover:shadow-md", className)}>
      <CardContent className="flex flex-col justify-between">
        {/* TOP */}
        <div className="flex items-start justify-between gap-2">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-2">
            {/* ICON */}
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                variant.bg,
              )}
            >
              <div className={variant.text}>{icon}</div>
            </div>

            {/* TEXT */}
            <div className="flex min-w-0 flex-col">
              {/* TITLE */}
              <span className="text-muted-foreground overflow-hidden text-xs leading-tight text-ellipsis whitespace-nowrap">
                {title}
              </span>

              {/* VALUE */}
              <span
                className={cn(
                  "text-lg leading-tight font-semibold tracking-tight",
                  "whitespace-nowrap", // 🔥 nunca se rompe
                  "overflow-hidden text-ellipsis", // evita overflow visual
                  variant.text,
                )}
              >
                {value}
              </span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mt-3 line-clamp-2 text-xs leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

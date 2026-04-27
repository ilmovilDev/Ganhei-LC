"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { truncate } from "@/lib/helpers/truncate";

// ---------------------------------------------

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;

  icon: ReactNode;

  /**
   * Colores dinámicos
   */
  color?: "green" | "blue" | "purple" | "red" | "gray";

  /**
   * Click opcional
   */
  onClick?: () => void;

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
  onClick,
  className,
}: MetricCardProps) {
  const variant = colorVariants[color];

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-background flex flex-col items-start gap-y-2 rounded-xl border p-4 shadow-sm transition",
        onClick && "cursor-pointer hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {/* ICON */}
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              variant.bg,
            )}
          >
            <div className={variant.text}>{icon}</div>
          </div>

          {/* TEXT */}
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">
              {truncate(title, 15)}
            </span>

            <span
              className={cn(
                "text-md font-semibold tracking-tight",
                variant.text,
              )}
            >
              {value}
            </span>
          </div>
        </div>

        {/* RIGHT ICON */}
        {onClick && <ChevronRight className="text-muted-foreground h-4 w-4" />}
      </div>
      {description && (
        <span className="text-muted-foreground text-xs">
          {truncate(description, 24)}
        </span>
      )}
    </div>
  );
}

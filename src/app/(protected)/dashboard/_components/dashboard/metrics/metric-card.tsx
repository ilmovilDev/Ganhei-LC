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
    // 🔹 Secondary information
    description: "text-[0.7rem] sm:text-[0.75rem] text-muted-foreground",

    // 🔹 Label
    title: "text-[0.8rem] sm:text-[0.85rem] font-medium text-muted-foreground",

    // 🔹 Primary value (protagonista)
    value: "text-[clamp(1rem,2.2vw,1.2rem)] font-semibold tracking-tight",

    // 🔹 Visual balance
    icon: "size-8 md:size-9",

    // 🔹 Internal rhythm
    gap: "gap-2",
  },

  highlight: {
    // 🔸 Secondary info (ligeramente mayor pero no compite)
    description:
      "text-[0.75rem] sm:text-[0.8rem] md:text-[0.75rem] text-muted-foreground",

    // 🔸 Label más visible en mobile
    title:
      "text-[0.9rem] sm:text-[1rem] md:text-[0.85rem] font-medium text-muted-foreground",

    // 🔥 Valor protagonista real
    value:
      "text-[clamp(1.4rem,4vw,2rem)] md:text-[clamp(1rem,2.2vw,1.2rem)] font-semibold tracking-tight",

    // 🔥 Icono acompaña jerarquía
    icon: "size-10 sm:size-11 md:size-9",

    // 🔥 Más aire en mobile
    gap: "gap-4 md:gap-2",
  },
};

// ---------------------------------------------

const colorVariants = {
  green: {
    // 💰 ganancias (positivo)
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    accent: "ring-emerald-500/20",
  },

  red: {
    // 💸 gastos (negativo)
    bg: "bg-red-500/10",
    text: "text-red-600",
    accent: "ring-red-500/20",
  },

  blue: {
    // 🚗 actividad / distancia / info
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    accent: "ring-blue-500/20",
  },

  purple: {
    // 📊 métricas derivadas (ej: por hora)
    bg: "bg-violet-500/10",
    text: "text-violet-600",
    accent: "ring-violet-500/20",
  },

  gray: {
    // 📌 neutral / base
    bg: "bg-muted",
    text: "text-foreground",
    accent: "ring-border",
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
      <CardContent className="px-4 md:px-6">
        {/* TOP */}
        <div className={cn("flex items-center", sizeVariant.gap)}>
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
          <div className="flex min-w-0 flex-col leading-5">
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

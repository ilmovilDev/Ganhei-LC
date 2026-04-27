"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------

interface HeaderSectionProps {
  title: string;
  description?: string;
  rightSlot?: ReactNode;
  leftSlot?: ReactNode;
  className?: string;
}

// ---------------------------------------------

export default function HeaderSection({
  title,
  description,
  rightSlot,
  leftSlot,
  className,
}: HeaderSectionProps) {
  return (
    <header
      className={cn(
        // Mobile: columna
        // Desktop: fila con separación
        "flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      {/* LEFT BLOCK */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        {leftSlot && <div className="flex items-center">{leftSlot}</div>}

        <div className="flex flex-col">
          <h2 className="text-base font-semibold tracking-tight md:text-lg">
            {title}
          </h2>

          {description && (
            <p className="text-muted-foreground text-xs md:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT BLOCK */}
      {rightSlot && (
        <div
          className={cn(
            // Mobile: ocupa ancho completo
            "flex w-full items-center justify-start",
            // Desktop: tamaño natural alineado a la derecha
            "md:w-auto md:justify-end",
          )}
        >
          {rightSlot}
        </div>
      )}
    </header>
  );
}

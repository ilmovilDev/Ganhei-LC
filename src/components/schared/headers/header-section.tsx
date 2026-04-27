"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------

interface HeaderSectionProps {
  title: string;
  description?: string;

  /**
   * Slot derecho (actions, filtros, selects, etc)
   */
  rightSlot?: ReactNode;

  /**
   * Slot izquierdo extra (iconos, badges, etc)
   */
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
      className={cn("flex items-center justify-between px-4 py-2", className)}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {leftSlot && <div className="flex items-center">{leftSlot}</div>}

        <div className="flex flex-col">
          <h2 className="text-md font-semibold tracking-tight">{title}</h2>

          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </header>
  );
}

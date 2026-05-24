"use client";

import { CalendarDays } from "lucide-react";

interface DaysEmptyStateProps {
  month: number;
  year: number;
}

export default function DaysEmptyState({ month, year }: DaysEmptyStateProps) {
  return (
    <div className="bg-card flex h-full min-h-105 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center shadow-sm">
      {/* ICON */}
      <div className="bg-muted mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
        <CalendarDays className="text-muted-foreground h-8 w-8" />
      </div>

      {/* CONTENT */}
      <div className="max-w-sm space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Nenhum registro encontrado
        </h2>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Não existem ganhos registrados para{" "}
          <span className="font-medium">
            {month.toString().padStart(2, "0")}/{year}
          </span>
          .
        </p>

        <p className="text-muted-foreground text-sm">
          Comece registrando seu primeiro dia de trabalho.
        </p>
      </div>
    </div>
  );
}

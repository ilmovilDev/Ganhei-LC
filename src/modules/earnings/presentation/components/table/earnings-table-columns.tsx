"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-currency";
import { parseDayDate } from "@/lib/date";
import { DayListItemDto } from "@/modules/earnings/application/dtos/day-list-item.dto";
import { APP_LABELS } from "@/modules/earnings/constants/apps-label";
import { EarningsTableRowActions } from ".";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                       */
/* -------------------------------------------------------------------------- */

export interface EarningsColumnActions {
  onEdit: (day: DayListItemDto) => void;
}

/* -------------------------------------------------------------------------- */
/* INTERNAL HELPERS                                                            */
/* -------------------------------------------------------------------------- */

function SortableHeader({
  label,
  onSort,
  align = "left",
}: {
  label: string;
  onSort: () => void;
  align?: "left" | "right";
}) {
  return (
    <button
      className={cn(
        "group flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase transition-colors",
        "text-muted-foreground hover:text-foreground",
        align === "right" && "ml-auto",
      )}
      onClick={onSort}
    >
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50" />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* COLUMNS                                                                     */
/* -------------------------------------------------------------------------- */

export function buildColumnsDay(
  actions: EarningsColumnActions,
): ColumnDef<DayListItemDto>[] {
  return [
    /* ── DATE ─────────────────────────────────────────────────────────── */
    {
      accessorKey: "date",
      header: ({ column }) => (
        <SortableHeader
          label="Data"
          onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      size: 140,
      cell: ({ row }) => {
        const date = parseDayDate(row.original.date);
        return (
          <div className="flex flex-col gap-0.5 py-0.5">
            <span className="text-sm font-semibold tabular-nums">
              {format(date, "dd/MM/yyyy")}
            </span>
            <span className="text-muted-foreground text-[11px] capitalize">
              {format(date, "EEEE", { locale: ptBR })}
            </span>
          </div>
        );
      },
    },

    /* ── APPS ──────────────────────────────────────────────────────────── */
    {
      accessorKey: "earnings",
      header: () => (
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Aplicativos
        </span>
      ),
      size: 160,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.earnings.map((e) => (
            <Badge
              key={e.app}
              variant="secondary"
              className="h-5 rounded-md px-1.5 text-[10px] font-medium"
            >
              {APP_LABELS[e.app]}
            </Badge>
          ))}
        </div>
      ),
    },

    /* ── HOURS ─────────────────────────────────────────────────────────── */
    {
      accessorKey: "hours",
      header: ({ column }) => (
        <SortableHeader
          label="Horas"
          onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      size: 80,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {row.original.hours}
          <span className="text-xs">h</span>
        </span>
      ),
    },

    /* ── KM ────────────────────────────────────────────────────────────── */
    {
      accessorKey: "kilometers",
      header: ({ column }) => (
        <SortableHeader
          label="Km"
          onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      size: 80,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {row.original.kilometers}
          <span className="ml-0.5 text-xs">km</span>
        </span>
      ),
    },

    /* ── GROSS ─────────────────────────────────────────────────────────── */
    {
      accessorKey: "totalEarnings",
      header: ({ column }) => (
        <SortableHeader
          label="Bruto"
          align="right"
          onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      size: 115,
      cell: ({ row }) => (
        <div className="text-right">
          <span className="text-sm font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
            {formatCurrency(row.original.totalEarnings)}
          </span>
        </div>
      ),
    },

    /* ── EXPENSES ──────────────────────────────────────────────────────── */
    {
      accessorKey: "totalExpenses",
      header: ({ column }) => (
        <SortableHeader
          label="Despesas"
          align="right"
          onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      size: 115,
      cell: ({ row }) => {
        const hasExpenses = row.original.totalExpenses > 0;
        return (
          <div className="text-right">
            <span
              className={cn(
                "text-sm font-medium tabular-nums",
                hasExpenses
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground/50",
              )}
            >
              {formatCurrency(row.original.totalExpenses)}
            </span>
          </div>
        );
      },
    },

    /* ── NET ───────────────────────────────────────────────────────────── */
    {
      accessorKey: "netProfit",
      header: ({ column }) => (
        <SortableHeader
          label="Líquido"
          align="right"
          onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      size: 115,
      cell: ({ row }) => {
        const net = row.original.netProfit;
        return (
          <div className="text-right">
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                net >= 0
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {formatCurrency(net)}
            </span>
          </div>
        );
      },
    },

    /* ── ACTIONS ───────────────────────────────────────────────────────── */
    {
      id: "actions",
      size: 80,
      header: () => null,
      cell: ({ row }) => (
        <EarningsTableRowActions day={row.original} onEdit={actions.onEdit} />
      ),
    },
  ];
}

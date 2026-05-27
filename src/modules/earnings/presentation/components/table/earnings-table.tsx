"use client";

/**
 * EarningsTable (DaysTable refactorizado)
 *
 * Cambios respecto a la versión anterior:
 * - Eliminado: isDeleting (useState manual) → isPending viene del hook via RowActions
 * - Eliminado: deleteTarget, handleDeleteConfirm, handleDeleteRequest → movidos a RowActions
 * - Eliminado: AlertDialog de la tabla → vive en EarningsTableRowActions
 * - Eliminado: import de useDeleteDay → ya no es responsabilidad de la tabla
 * - columns es estable: buildColumnsDay solo depende de handleEdit (useCallback)
 * - UpsertDayDialog se mantiene acá porque es edit — state del dialog pertenece a la tabla
 */

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DayListItemDto } from "@/modules/earnings/application/dtos/day-list-item.dto";
import { buildColumnsDay } from "./earnings-table-columns";
import UpsertDayDialog from "../dialogs/upsert-day-dialog";

interface EarningsTableProps {
  data: DayListItemDto[];
}

export default function EarningsTable({ data }: EarningsTableProps) {
  const [editDay, setEditDay] = useState<DayListItemDto | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);

  // useCallback → referencia estable → columns no se recalcula en cada render
  const handleEdit = useCallback((day: DayListItemDto) => {
    setEditDay(day);
    setEditOpen(true);
  }, []);

  // columns solo cambia si handleEdit cambia (nunca, por useCallback sin deps)
  const columns = useMemo(
    () => buildColumnsDay({ onEdit: handleEdit }),
    [handleEdit],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-card flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border shadow-sm">
      {/* ── Content ── */}
      <div className="min-h-0 flex-1 overflow-auto">
        <Table className="min-w-245">
          <TableHeader className="bg-background sticky top-0 z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-background h-11 px-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center text-sm"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 border-b transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Edit Dialog ── */}
      <UpsertDayDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        day={editDay}
      />
    </div>
  );
}

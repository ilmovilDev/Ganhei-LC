"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseDayDate } from "@/lib/date";
import { deleteDayAction } from "../actions";
import { buildColumnsDay } from "./columns-day";
import UpsertDayDialog from "./upsert-day-dialog";
import { Day } from "../types";
import { useEarningsContext } from "../context/earning.provider";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                       */
/* -------------------------------------------------------------------------- */

interface DaysTableProps {
  pages?: Day[][];
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
}

/* -------------------------------------------------------------------------- */
/* SKELETON                                                                    */
/* -------------------------------------------------------------------------- */

function TableSkeleton() {
  return (
    <div className="flex flex-col divide-y">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-4 px-4 py-3.5"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="w-28 shrink-0 space-y-1.5">
            <div className="bg-muted h-3.5 w-20 rounded" />
            <div className="bg-muted h-2.5 w-14 rounded" />
          </div>
          <div className="flex flex-1 gap-1.5">
            <div className="bg-muted h-5 w-12 rounded-md" />
            <div className="bg-muted h-5 w-12 rounded-md" />
          </div>
          <div className="bg-muted ml-auto h-3.5 w-8 rounded" />
          <div className="bg-muted h-3.5 w-10 rounded" />
          <div className="bg-muted h-3.5 w-16 rounded" />
          <div className="bg-muted h-3.5 w-16 rounded" />
          <div className="bg-muted h-3.5 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* EMPTY STATE                                                                 */
/* -------------------------------------------------------------------------- */

function TableEmpty({ onAdd }: { onAdd?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="bg-muted rounded-full p-3">
        <PlusCircle className="text-muted-foreground h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Nenhum ganho registrado</p>
        <p className="text-muted-foreground max-w-48 text-xs">
          Adicione seus ganhos para acompanhar seu desempenho no mês
        </p>
      </div>
      {onAdd && (
        <Button
          variant="outline"
          size="sm"
          className="mt-1 h-8 gap-1.5 text-xs"
          onClick={onAdd}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Registrar primeiro dia
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                              */
/* -------------------------------------------------------------------------- */

export default function DaysTable({
  pages,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage = false,
  isLoading,
}: DaysTableProps) {
  const [editDay, setEditDay] = useState<Day | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Day | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { refetch } = useEarningsContext();

  const data = useMemo(() => pages?.flat() ?? [], [pages]);

  const handleEdit = useCallback((day: Day) => {
    setEditDay(day);
    setEditOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((day: Day) => {
    setDeleteTarget(day);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await deleteDayAction(deleteTarget.id);
      if (!result.success) {
        toast.error(
          result.error.message ?? "Falha ao excluir. Tente novamente.",
        );
        return;
      }
      toast.success("Registro excluído com sucesso.");
      setDeleteTarget(null);
      refetch();
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo(
    () =>
      buildColumnsDay({ onEdit: handleEdit, onDelete: handleDeleteRequest }),
    [handleEdit, handleDeleteRequest],
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
    <>
      <div className="bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
        {/* ── Header da tabela ── */}
        <div className="bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium">Registros</p>
          {!isLoading && data.length > 0 && (
            <p className="text-muted-foreground text-xs tabular-nums">
              {data.length} {data.length !== 1 ? "dias" : "dia"}
            </p>
          )}
        </div>

        {/* ── Conteúdo ── */}
        {isLoading ? (
          <TableSkeleton />
        ) : data.length === 0 ? (
          <TableEmpty />
        ) : (
          <>
            {/* Área scrollável */}
            <div className="min-h-0 flex-1 overflow-auto">
              <Table className="min-w-180">
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow
                      key={hg.id}
                      className="border-b hover:bg-transparent"
                    >
                      {hg.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "bg-card sticky top-0 z-10 h-9 px-4",
                            "border-b",
                          )}
                          style={{ width: header.getSize() }}
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
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="group hover:bg-muted/30 border-b transition-colors last:border-0"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-2.5 align-middle"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            {hasNextPage && (
              <div className="flex shrink-0 items-center justify-center border-t px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchNextPage}
                  disabled={isFetchingNextPage}
                  className="text-muted-foreground h-8 gap-1.5 text-xs"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    "Carregar mais"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Dialogs ── */}
      <UpsertDayDialog
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        day={editDay}
        onSuccess={refetch}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (isDeleting) return;
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro do dia{" "}
              <strong>
                {deleteTarget
                  ? format(parseDayDate(deleteTarget.date), "dd/MM/yyyy")
                  : ""}
              </strong>{" "}
              será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-600/90"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Excluindo...
                </span>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

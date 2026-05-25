"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DayListItemDto } from "@/modules/earnings/application/dtos/day-list-item.dto";
import { buildColumnsDay } from "./columns-day";
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
import { toast } from "sonner";
import { parseDayDate } from "@/lib/date";
import { format } from "date-fns";
import UpsertDayDialog from "../form/upsert-day-dialog";
import { DaysTableSkeleton } from "./days-table-skeleton";
import { useDeleteDay } from "../../hooks/use-delete-day";

interface DaysTableProps {
  data: DayListItemDto[];
  isLoading?: boolean;
}

export default function DaysTable({ data, isLoading }: DaysTableProps) {
  const [editDay, setEditDay] = useState<DayListItemDto | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DayListItemDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "date",
      desc: true,
    },
  ]);

  const deleteMutation = useDeleteDay();

  const handleEdit = useCallback((day: DayListItemDto) => {
    setEditDay(day);
    setEditOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((day: DayListItemDto) => {
    setDeleteTarget(day);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const result = await deleteMutation.mutateAsync(deleteTarget.id);

      if (!result.success) {
        toast.error(result.error.message ?? "Falha ao excluir.");

        return;
      }

      toast.success("Registro excluído com sucesso.");

      setDeleteTarget(null);
    } catch {
      toast.error("Erro inesperado.");
    }
  };

  const columns = useMemo(
    () =>
      buildColumnsDay({
        onEdit: handleEdit,
        onDelete: handleDeleteRequest,
      }),
    [handleDeleteRequest, handleEdit],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={cn(
        "bg-card flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border shadow-sm",
      )}
    >
      {/* CONTENT */}
      {isLoading ? (
        <DaysTableSkeleton />
      ) : (
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
              {table.getRowModel().rows.map((row) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="bg-background/70 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        </div>
      )}

      {/* ── Dialogs ── */}
      <UpsertDayDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        day={editDay}
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
    </div>
  );
}

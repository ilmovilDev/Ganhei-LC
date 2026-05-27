"use client";

/**
 * EarningsTableRowActions
 *
 * Encapsula edit + delete para uma linha da tabela.
 * - Delete tem AlertDialog próprio → a tabela não precisa gerenciar estado de delete
 * - useDeleteDay com onSuccess/onError → padrão do módulo
 * - isPending vem do hook, sem useState manual
 */

import { useState, useCallback } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { parseDayDate } from "@/lib/date";
import { DayListItemDto } from "@/modules/earnings/application/dtos/day-list-item.dto";
import { useDeleteDay } from "../../hooks";

interface EarningsTableRowActionsProps {
  day: DayListItemDto;
  onEdit: (day: DayListItemDto) => void;
}

export function EarningsTableRowActions({
  day,
  onEdit,
}: EarningsTableRowActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteMutation = useDeleteDay({
    onSuccess: () => {
      toast.success("Registro excluído com sucesso.");
      setConfirmOpen(false);
    },
    onError: (message) => {
      toast.error(message);
      // Não fecha o dialog em erro — usuário pode tentar de novo
    },
  });

  const handleDeleteClick = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    deleteMutation.mutate(day.id);
  }, [deleteMutation, day.id]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      // Bloqueia fechar enquanto deleta
      if (deleteMutation.isPending) return;
      setConfirmOpen(open);
    },
    [deleteMutation.isPending],
  );

  return (
    <>
      {/* ── Botões ── */}
      <div className="flex items-center justify-end gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-7 w-7"
          onClick={() => onEdit(day)}
          disabled={deleteMutation.isPending}
          aria-label="Editar registro"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-7 w-7"
          onClick={handleDeleteClick}
          disabled={deleteMutation.isPending}
          aria-label="Excluir registro"
        >
          {deleteMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* ── Confirm Dialog ── */}
      <AlertDialog open={confirmOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro do dia{" "}
              <strong>{format(parseDayDate(day.date), "dd/MM/yyyy")}</strong>{" "}
              será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-600/90"
            >
              {deleteMutation.isPending ? (
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

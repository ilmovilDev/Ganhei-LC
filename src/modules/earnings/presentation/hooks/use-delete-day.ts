import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDayAction } from "../actions/delete-day.action";
import { earningsKeys } from "../queries/query-keys";
import { DayId } from "../../types/domain.types";
import { DayListItemDto } from "../../application/dtos/day-list-item.dto";
import { useSelectedPeriod } from "@/providers/context-provider";

interface UseDeleteDayOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useDeleteDay({ onSuccess, onError }: UseDeleteDayOptions) {
  const queryClient = useQueryClient();
  const { month, year } = useSelectedPeriod();
  const queryKey = earningsKeys.daysByMonth(year, month);

  return useMutation({
    mutationFn: (id: DayId) => deleteDayAction(id),

    // ─── Optimistic Update: remove imediatamente da lista ────────────────────
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previousDays = queryClient.getQueryData<DayListItemDto[]>(queryKey);

      queryClient.setQueryData<DayListItemDto[]>(queryKey, (old = []) =>
        old.filter((day) => day.id !== id),
      );

      return { previousDays };
    },

    // ─── Sucesso ──────────────────────────────────────────────────────────────
    onSuccess: (result, _id, context) => {
      if (!result.success) {
        queryClient.setQueryData(queryKey, context?.previousDays);
        onError?.(result.error.message);
        return;
      }

      // Delete não precisa de refetch — o item já foi removido otimisticamente
      // Invalida apenas para garantir consistência com totalEarnings do servidor
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.();
    },

    // ─── Erro: rollback ───────────────────────────────────────────────────────
    onError: (_error, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previousDays);
      onError?.("Erro inesperado ao excluir o dia.");
    },
  });
}

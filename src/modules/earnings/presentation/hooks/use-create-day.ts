import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDayAction } from "../actions/create-day.action";
import { DayFormInput } from "../../schemas/day.schema";
import { DayListItemDto } from "../../application/dtos/day-list-item.dto";
import { earningsKeys } from "../queries/query-keys";
import { useSelectedPeriod } from "@/providers/context-provider";

interface UseCreateDayOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useCreateDay({ onSuccess, onError }: UseCreateDayOptions) {
  const queryClient = useQueryClient();
  const { month, year } = useSelectedPeriod();
  const queryKey = earningsKeys.daysByMonth(year, month);

  return useMutation({
    mutationFn: (input: DayFormInput) => createDayAction(input),

    // ─── Optimistic Update ────────────────────────────────────────────────────
    onMutate: async (input) => {
      // Cancela qualquer refetch em andamento para evitar race condition
      await queryClient.cancelQueries({ queryKey });

      // Salva o snapshot atual para rollback em caso de erro
      const previousDays = queryClient.getQueryData<DayListItemDto[]>(queryKey);

      // Injeta o item otimista no cache
      const optimisticDay: DayListItemDto = {
        id: `optimistic-${Date.now()}`,
        date: input.date,
        hours: input.hours,
        kilometers: input.kilometers,
        totalEarnings: input.earnings.reduce((sum, e) => sum + e.amount, 0),
        totalExpenses: 0,
        netProfit: input.earnings.reduce((sum, e) => sum + e.amount, 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        earnings: input.earnings.map((e, i) => ({
          id: `optimistic-earning-${i}`,
          app: e.app,
          amount: e.amount,
        })),
      };

      queryClient.setQueryData<DayListItemDto[]>(queryKey, (old = []) =>
        // Insere no topo, já que a lista é ordenada por date desc
        [optimisticDay, ...old],
      );

      return { previousDays };
    },

    // ─── Sucesso: invalida para buscar o dado real do servidor ────────────────
    onSuccess: (result, _input, context) => {
      if (!result.success) {
        // Server Action retornou erro — faz rollback
        queryClient.setQueryData(queryKey, context?.previousDays);
        onError?.(result.error.message);
        return;
      }

      // Invalida para substituir o item otimista pelo real
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.();
    },

    // ─── Erro de rede/inesperado: rollback ────────────────────────────────────
    onError: (_error, _input, context) => {
      queryClient.setQueryData(queryKey, context?.previousDays);
      onError?.("Erro inesperado ao criar o dia.");
    },
  });
}

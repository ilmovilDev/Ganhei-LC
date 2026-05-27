import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDayAction } from "../actions/update-day.action";
import { DayId } from "../../types/domain.types";
import { DayFormInput } from "../../schemas/day.schema";
import { earningsKeys } from "../queries/query-keys";
import { DayListItemDto } from "../../application/dtos/day-list-item.dto";
import { useSelectedPeriod } from "@/providers/context-provider";

interface UpdateDayVariables {
  id: DayId;
  input: DayFormInput;
}

interface UseUpdateDayOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useUpdateDay({ onSuccess, onError }: UseUpdateDayOptions) {
  const queryClient = useQueryClient();
  const { month, year } = useSelectedPeriod();
  const queryKey = earningsKeys.daysByMonth(year, month);

  return useMutation({
    mutationFn: ({ id, input }: UpdateDayVariables) =>
      updateDayAction(id, input),

    // ─── Optimistic Update ────────────────────────────────────────────────────
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousDays = queryClient.getQueryData<DayListItemDto[]>(queryKey);

      queryClient.setQueryData<DayListItemDto[]>(queryKey, (old = []) =>
        old.map((day) => {
          if (day.id !== id) return day;

          // Substitui o item com os dados otimistas
          return {
            ...day,
            date: input.date,
            hours: input.hours,
            kilometers: input.kilometers,
            totalEarnings: input.earnings.reduce((sum, e) => sum + e.amount, 0),
            netProfit: input.earnings.reduce((sum, e) => sum + e.amount, 0),
            updatedAt: new Date().toISOString(),
            earnings: input.earnings.map((e, i) => ({
              id: day.earnings[i]?.id ?? `optimistic-earning-${i}`,
              app: e.app,
              amount: e.amount,
            })),
          };
        }),
      );

      return { previousDays };
    },

    // ─── Sucesso ──────────────────────────────────────────────────────────────
    onSuccess: (result, _variables, context) => {
      if (!result.success) {
        queryClient.setQueryData(queryKey, context?.previousDays);
        onError?.(result.error.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey });
      onSuccess?.();
    },

    // ─── Erro: rollback ───────────────────────────────────────────────────────
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousDays);
      onError?.("Erro inesperado ao atualizar o dia.");
    },
  });
}

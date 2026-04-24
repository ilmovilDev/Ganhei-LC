"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEarningAction } from "../actions/delete-earning";
import { earningKeys } from "../lib/query-key";

type DeleteParams = {
  id: string;
  month: string;
};

type EarningItemDTO = {
  id: string;
  app: string;
  amount: number;
};

type DayDTO = {
  id: string;
  earnings: EarningItemDTO[];
};

type EarningsCache = DayDTO[];

export function useDeleteEarning(month: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteParams) => deleteEarningAction(id),

    /**
     * ⚡ OPTIMISTIC UPDATE
     */
    onMutate: async ({ id }: DeleteParams) => {
      const key = earningKeys.list(month);

      await queryClient.cancelQueries({ queryKey: key });

      const previousData = queryClient.getQueryData<EarningsCache>(key);

      queryClient.setQueryData<EarningsCache>(key, (old) => {
        if (!old) return old;

        return old.map((day) => ({
          ...day,
          earnings: day.earnings.filter((e) => e.id !== id),
        }));
      });

      return { previousData };
    },

    /**
     * ❌ ROLLBACK
     */
    onError: (_err, _vars, context) => {
      const key = earningKeys.list(month);

      if (context?.previousData) {
        queryClient.setQueryData(key, context.previousData);
      }
    },

    /**
     * 🔄 SYNC FINAL
     */
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: earningKeys.list(month),
      });
    },
  });
}

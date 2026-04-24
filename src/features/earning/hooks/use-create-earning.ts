"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEarningAction } from "../actions/create-earning";
import { earningKeys } from "../lib/query-key";
import type { GetEarningsResponse } from "../types/earning-type";
import { App } from "@/generated/prisma/enums";

type CreateParams = {
  month: string;
  data: {
    date: Date;
    hours: number;
    kilometers: number;
    earnings: {
      app: App;
      amount: number;
    }[];
  };
};

export function useCreateEarning(month: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: CreateParams) => createEarningAction(data),

    /**
     * ⚡ OPTIMISTIC INSERT
     */
    onMutate: async ({ data }: CreateParams) => {
      await queryClient.cancelQueries({
        queryKey: earningKeys.list(month),
      });

      const previousData = queryClient.getQueryData<GetEarningsResponse>(
        earningKeys.list(month),
      );

      /**
       * 🧠 snapshot optimista del día
       */
      const tempId = crypto.randomUUID();

      const optimisticDay = {
        id: tempId,
        clerkId: "optimistic",
        date: data.date,
        hours: data.hours,
        kilometers: data.kilometers,
        createdAt: new Date(),
        updatedAt: new Date(),

        earnings: data.earnings.map((e) => ({
          id: crypto.randomUUID(),
          dayId: tempId,
          app: e.app,
          amount: e.amount,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      };

      /**
       * 🔥 INSERT INTO CACHE
       */
      queryClient.setQueryData<GetEarningsResponse>(
        earningKeys.list(month),
        (old) => {
          if (!old) return [optimisticDay];

          return [optimisticDay, ...old];
        },
      );

      return { previousData };
    },

    /**
     * ❌ ROLLBACK
     */
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(earningKeys.list(month), context.previousData);
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

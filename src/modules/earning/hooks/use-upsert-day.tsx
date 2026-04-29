"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { upsertDayAction } from "../actions/upsert-day.action";
import { dashboardKeys, dayKeys } from "@/modules/earning/constants/query-keys";

// ---------------------------------------------

type Context = {
  previousDays?: unknown;
};

// ---------------------------------------------

export function useUpsertDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertDayAction,

    // ---------------------------------------------
    // OPTIMISTIC (controlado)
    // ---------------------------------------------
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: dayKeys.all,
      });

      const previousDays = queryClient.getQueryData(dayKeys.all);

      return { previousDays } as Context;
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousDays) {
        queryClient.setQueryData(dayKeys.all, ctx.previousDays);
      }
    },

    // ---------------------------------------------
    // SINCRONIZACIÓN FINAL
    // ---------------------------------------------
    onSuccess: () => {
      // 🔥 invalidate DAYS
      queryClient.invalidateQueries({
        queryKey: dayKeys.all,
        exact: false,
      });

      // 🔥 invalidate DASHBOARD (CRÍTICO)
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
        exact: false,
      });
    },
  });
}

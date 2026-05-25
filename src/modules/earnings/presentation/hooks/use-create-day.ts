"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createDayAction } from "../../application/actions/create-day.action";
import { earningsKeys } from "../lib/query-keys";
import { usePeriodContext } from "@/providers/period-provider";

export function useCreateDay() {
  const { month, year } = usePeriodContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDayAction,

    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: earningsKeys.list(month, year),
      });

      toast.success("Registro criado com sucesso");
    },

    onError: () => {
      toast.error("Erro ao criar registro");
    },
  });
}

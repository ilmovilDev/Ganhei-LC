"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateDayAction } from "../../application/actions/update-day.action";
import { earningsKeys } from "../lib/query-keys";
import type { DayFormInput } from "../../schemas/day.schema";
import { usePeriodContext } from "@/providers/period-provider";

interface UpdateDayPayload {
  id: string;
  data: DayFormInput;
}

export function useUpdateDay() {
  const { month, year } = usePeriodContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateDayPayload) => {
      return updateDayAction(id, data);
    },

    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.error.message ?? "Erro ao atualizar registro.");

        return;
      }

      await queryClient.invalidateQueries({
        queryKey: earningsKeys.list(month, year),
      });

      toast.success("Registro atualizado com sucesso.");
    },

    onError: () => {
      toast.error("Erro inesperado ao atualizar.");
    },
  });
}

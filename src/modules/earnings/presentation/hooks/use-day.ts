"use client";

import { useQuery } from "@tanstack/react-query";
import { getDaysByMonthAction } from "../../application/actions/get-days-by-month.action";
import { earningsKeys } from "../lib/query-keys";
import { usePeriodContext } from "@/providers/period-provider";

export function useDays() {
  const { month, year } = usePeriodContext();
  return useQuery({
    queryKey: earningsKeys.list(month, year),

    queryFn: async () => {
      const result = await getDaysByMonthAction({
        month,
        year,
      });

      if (!result.success) {
        throw new Error(result.error.message ?? "Erro ao carregar registros");
      }

      return result.data;
    },
  });
}

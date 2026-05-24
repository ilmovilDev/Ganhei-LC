"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { getDaysByMonthAction } from "../../application/actions/get-days-by-month.action";
import { DayListItemDto } from "../../application/dtos/day-list-item.dto";
import { useEarningsContext } from "../providers/earning-provider";

export function useDays() {
  const { month, year, version } = useEarningsContext();

  const [days, setDays] = useState<DayListItemDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const fetchDays = useCallback(() => {
    startTransition(async () => {
      setError(null);

      const result = await getDaysByMonthAction({
        month,
        year,
      });

      if (!result.success) {
        setError(result.error.message ?? "Erro ao carregar registros.");

        return;
      }

      setDays(result.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, version]);

  useEffect(() => {
    fetchDays();
  }, [fetchDays]);

  return {
    days,
    error,
    isPending,
    refresh: fetchDays,
  };
}

import { useQuery } from "@tanstack/react-query";
import { DayListItemDto } from "../../application/dtos/day-list-item.dto";
import { earningsKeys } from "../queries/query-keys";
import { getDaysByMonthAction } from "../actions/get-days-by-month.action";
import { useSelectedPeriod } from "@/providers/context-provider";

interface UseDaysByMonthParams {
  enabled?: boolean;
}

interface UseDaysByMonthReturn {
  days: DayListItemDto[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDaysByMonth({
  enabled = true,
}: UseDaysByMonthParams): UseDaysByMonthReturn {
  const { month, year } = useSelectedPeriod();
  const query = useQuery({
    queryKey: earningsKeys.daysByMonth(year, month),
    queryFn: async () => {
      const result = await getDaysByMonthAction({ month, year });

      // Lança erro para o React Query capturar e ativar isError
      if (!result.success) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  });

  return {
    days: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}

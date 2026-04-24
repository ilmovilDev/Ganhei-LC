"use client";

import { useQuery } from "@tanstack/react-query";
import { earningKeys } from "../lib/query-key";
import { getEarningsAction } from "../actions/get-earning";

export function useEarnings(month: string) {
  return useQuery({
    queryKey: earningKeys.list(month),

    queryFn: async () => {
      const data = await getEarningsAction(month);
      return data;
    },

    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}

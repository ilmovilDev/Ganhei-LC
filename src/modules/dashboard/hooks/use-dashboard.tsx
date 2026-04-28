"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardAction } from "../actions/get-dashboard.action";

export function useDashboard(month: string) {
  return useQuery({
    queryKey: ["dashboard", month],
    queryFn: () => getDashboardAction({ month }),
  });
}

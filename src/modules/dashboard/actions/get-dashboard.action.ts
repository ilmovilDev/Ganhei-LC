"use server";

import { getDashboardService } from "../services/get-dashboard.service";
import { mapDashboardToMetrics } from "../mappers/dashboard.mapper";
import { getDashboardSchema } from "../schema/get-dashboard.schema";
import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";

interface GetDashboardActionProps {
  month: string;
}

export async function getDashboardAction({ month }: GetDashboardActionProps) {
  const userId = await requireUserOrRedirect();
  const parsed = getDashboardSchema.safeParse({
    month,
    userId,
  });

  if (!parsed.success) {
    throw new Error("Erro ao carregar dashboard");
  }

  const raw = await getDashboardService(parsed.data);

  const metrics = mapDashboardToMetrics(raw);

  return metrics;
}

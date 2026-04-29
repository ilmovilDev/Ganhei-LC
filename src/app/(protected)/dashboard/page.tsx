import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import { normalizeMonth } from "@/lib/helpers/date";

import DashboardHeader from "./_components/header/dashboard-header";
import DashboardMetricsContent from "./_components/dashboard/metrics/dashboard-metrics-content";
import DashboardGraphicsContent from "./_components/dashboard/graphics/dashboard-graphics-content";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await requireUserOrRedirect();

  const params = await searchParams;
  const month = normalizeMonth(params?.month);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader month={month} />

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          <DashboardMetricsContent month={month} />
          <DashboardGraphicsContent />
        </div>
      </div>
    </div>
  );
}

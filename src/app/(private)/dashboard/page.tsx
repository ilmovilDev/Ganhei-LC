import { HeaderPage } from "@/components/navigations/header-page";
import UnderConstruction from "@/components/shared/under-construction";
import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import { parsePeriodParams } from "@/lib/params/parse-period-params";
import { SelectedPeriodProvider } from "@/providers/context-provider";

interface DashboardPageProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const period = parsePeriodParams(params);

  return (
    <SelectedPeriodProvider month={period.month} year={period.year}>
      <div className="flex h-full flex-col gap-4 overflow-hidden">
        <HeaderPage />
        <UnderConstruction showBack />
      </div>
    </SelectedPeriodProvider>
  );
}

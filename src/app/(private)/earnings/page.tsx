import { HeaderPage } from "@/components/navigations/header-page";
import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import { parsePeriodParams } from "@/lib/params/parse-period-params";
import CreateDayButton from "@/modules/earnings/presentation/components/buttons/create-day-button";
import DaysView from "@/modules/earnings/presentation/components/ui/days-view";
import { SelectedPeriodProvider } from "@/providers/context-provider";

interface EarningsPageProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function EarningsPage({
  searchParams,
}: EarningsPageProps) {
  await requireUserOrRedirect();

  const params = await searchParams;
  const period = parsePeriodParams(params);

  // Verificar se o usuario tem permissão para registrar um dia...

  return (
    <SelectedPeriodProvider month={period.month} year={period.year}>
      <div className="flex h-full flex-col gap-4 overflow-hidden">
        <HeaderPage actions={<CreateDayButton userCanRegisterDay />} />

        <div className="min-h-0 flex-1">
          <DaysView />
        </div>
      </div>
    </SelectedPeriodProvider>
  );
}

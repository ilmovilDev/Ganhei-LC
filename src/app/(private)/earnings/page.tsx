import { HeaderPage } from "@/components/navigations/header-page";
import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import { getCurrentMonth, getCurrentYear } from "@/lib/date";
import CreateDayButton from "@/modules/earnings/presentation/components/form/create-day-button";
import DaysView from "@/modules/earnings/presentation/components/table/days-view";
import { PeriodProvider } from "@/providers/period-provider";

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
  const currentMonth = params.month ? Number(params.month) : getCurrentMonth();
  const currentYear = params.year ? Number(params.year) : getCurrentYear();

  // Verificar se o usuario tem permissão para registrar um dia...

  return (
    <PeriodProvider month={currentMonth} year={currentYear}>
      <div className="flex h-full flex-col gap-4 overflow-hidden">
        <HeaderPage actions={<CreateDayButton userCanRegisterDay />} />

        <div className="min-h-0 flex-1">
          <DaysView />
        </div>
      </div>
    </PeriodProvider>
  );
}

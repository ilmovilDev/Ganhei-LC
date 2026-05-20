import { HeaderPage } from "@/components/navigations/header-page";
import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import { getCurrentMonth, getCurrentYear } from "@/lib/date";
import CreateEarningButton from "@/modules/earnings/components/create-day-button";
import { EarningsProvider } from "@/modules/earnings/context/earning.provider";
import DaysContent from "../../../modules/earnings/components/days-content";

interface EarningsPageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function EarningsPage({
  searchParams,
}: EarningsPageProps) {
  await requireUserOrRedirect();
  const { month, year } = await searchParams;
  const currentMonth = month ? parseInt(month) : getCurrentMonth();
  const currentYear = year ? parseInt(year) : getCurrentYear();

  return (
    <EarningsProvider month={currentMonth} year={currentYear}>
      <div className="flex min-h-0 flex-1 flex-col gap-y-5">
        <HeaderPage
          actions={<CreateEarningButton userCanRegisterDay={true} />}
        />
        <DaysContent />
      </div>
    </EarningsProvider>
  );
}

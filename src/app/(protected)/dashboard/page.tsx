import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import { normalizeMonth } from "@/lib/helpers/date";
import DashboardHeader from "./_components/header/dashboard-header";

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
    </div>
  );
}

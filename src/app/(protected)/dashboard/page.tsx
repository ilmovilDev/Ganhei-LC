import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import { normalizeMonth } from "@/lib/helpers/date";
import DashboardContent from "./_components/dashboard-content";
import HeaderSection from "@/components/schared/headers/header-section";
import TimeSelect from "@/components/schared/select/time-select";
import CreateEarningButton from "@/modules/earning/components/buttons/create-earning-button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await requireUserOrRedirect();

  // =========================
  // 🔎 PARAMS
  // =========================
  const params = await searchParams;
  const month = normalizeMonth(params?.month);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* HEADER */}
      <HeaderSection
        title="Dashboard"
        description="Resumo do seu desempenho"
        rightSlot={<TimeSelect month={month} />}
      />

      {/* CONTENT (scrollable) */}
      <DashboardContent />

      {/* FOOTER */}
      <div className="bg-background block p-4">
        <CreateEarningButton userCanRegisterDay />
      </div>
    </div>
  );
}

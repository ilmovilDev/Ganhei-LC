import { normalizeMonth } from "@/lib/helpers/date";
import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import HeaderSection from "@/components/schared/headers/header-section";
import TimeSelect from "@/components/schared/select/time-select";
import EarningContent from "./_components/earning-content";
import CreateEarningButton from "@/modules/earning/components/buttons/create-earning-button";

export default async function EarningPage({
  searchParams,
}: {
  searchParams?: Promise<{ month: string }>;
}) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const month = normalizeMonth(params?.month);
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* HEADER */}
      <HeaderSection
        title="Ganhos"
        description="Controle das suas receitas"
        rightSlot={<TimeSelect month={month} />}
      />

      {/* CONTENT (scrollable) */}
      <EarningContent />

      {/* FOOTER */}
      <div className="bg-background block p-4">
        <CreateEarningButton userCanRegisterDay />
      </div>
    </div>
  );
}

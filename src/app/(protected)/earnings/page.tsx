import { normalizeMonth } from "@/lib/helpers/date";
import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";
import UnderConstruction from "@/components/schared/ui/under-construction";

export default async function EarningPage({
  searchParams,
}: {
  searchParams?: Promise<{ month: string }>;
}) {
  await requireUserOrRedirect();
  const params = await searchParams;
  const month = normalizeMonth(params?.month);
  console.log("Params: ", month);
  return <UnderConstruction showBack />;
}

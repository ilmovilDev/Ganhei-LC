import { requireUser } from "@/app/lib/auth/require-user";
import UnderConstruction from "@/components/shared/under-construction";

export default async function EarningsPage({
  searchParams,
}: {
  searchParams?: Promise<{ month: string }>;
}) {
  await requireUser();

  return (
    <div>
      <UnderConstruction showBack={true} />
    </div>
  );
}

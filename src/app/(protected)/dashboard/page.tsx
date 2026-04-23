import UnderConstruction from "@/components/shared/under-construction";
import { requireUser } from "@/app/lib/auth/require-user";

export default async function DashboardPage() {
  await requireUser();
  return (
    <div>
      <UnderConstruction />
    </div>
  );
}

import UnderConstruction from "@/components/shared/under-construction";
import { requireUser } from "@/app/lib/auth/require-user";

export default async function ExpensesPage() {
  const userId = await requireUser();
  return (
    <div>
      <UnderConstruction showBack={true} />
    </div>
  );
}

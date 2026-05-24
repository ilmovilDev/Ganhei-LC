import { Wallet } from "lucide-react";

export default function EarningsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
      <div className="bg-muted mb-4 rounded-full p-3">
        <Wallet className="text-muted-foreground size-6" />
      </div>

      <h3 className="text-lg font-semibold">Nenhum registro encontrado</h3>

      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Comece registrando seus ganhos diários.
      </p>
    </div>
  );
}

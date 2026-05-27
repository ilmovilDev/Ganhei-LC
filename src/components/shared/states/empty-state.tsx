import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No data found",
  description = "There is nothing to display here yet.",
}: EmptyStateProps) {
  return (
    <div className="border-border flex min-h-75 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-8">
      <div className="bg-muted rounded-full p-4">
        <Inbox className="text-muted-foreground size-10" />
      </div>

      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      </div>
    </div>
  );
}

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = "Loading...",
  description = "Please wait a moment.",
}: LoadingStateProps) {
  return (
    <div className="border-border bg-background flex min-h-75 flex-col items-center justify-center gap-4 rounded-2xl border p-8">
      <Loader2 className="text-muted-foreground size-10 animate-spin" />

      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

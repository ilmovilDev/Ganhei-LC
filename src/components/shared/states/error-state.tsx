import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 flex min-h-75 flex-col items-center justify-center gap-5 rounded-2xl border p-8">
      <div className="bg-destructive/10 rounded-full p-4">
        <AlertTriangle className="text-destructive size-10" />
      </div>

      <div className="space-y-1 text-center">
        <h3 className="text-destructive text-lg font-semibold">{title}</h3>

        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  );
}

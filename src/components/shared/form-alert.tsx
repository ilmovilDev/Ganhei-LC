import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "../typography/text";

interface FormAlertProps {
  message?: string;
}

export function FormAlert({ message }: FormAlertProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-x-2 rounded-xl border border-red-200 bg-red-50 p-2 text-sm text-red-700",
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4" />
      <Text size="sm">{message}</Text>
    </div>
  );
}

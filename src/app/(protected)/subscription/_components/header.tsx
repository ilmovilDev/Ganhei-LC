import HeaderBase from "@/components/shared/header-base";
import { Badge } from "@/components/ui/badge";

export function HeaderSubscription() {
  return (
    <HeaderBase
      left={
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>Plano atual:</span>
          <Badge variant="secondary">Starter</Badge>
        </div>
      }
    />
  );
}

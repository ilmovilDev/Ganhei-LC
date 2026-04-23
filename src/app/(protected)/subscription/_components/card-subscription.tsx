"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardSubscriptionProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isCurrent?: boolean;
  highlight?: boolean;
  badge?: string;
}

export function CardSubscription({
  title,
  price,
  description,
  features,
  isCurrent,
  highlight,
  badge,
}: CardSubscriptionProps) {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between rounded-2xl border",
        highlight && "border-primary scale-[1.02] shadow-lg",
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>

          {badge && (
            <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs">
              {badge}
            </span>
          )}
        </div>

        <p className="text-2xl font-bold">{price}</p>

        <p className="text-muted-foreground text-xs">{description}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Features */}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          disabled={isCurrent}
          variant={isCurrent ? "secondary" : "default"}
          className="w-full cursor-pointer"
        >
          {isCurrent ? "Plano atual" : "Escolher plano"}
        </Button>
      </CardContent>
    </Card>
  );
}

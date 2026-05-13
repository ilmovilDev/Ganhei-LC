"use client";

import { useUser } from "@clerk/nextjs";

import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

import { Skeleton } from "@/components/ui/skeleton";

const GREETINGS = [
  { until: 12, text: "Bom dia 👋" },
  { until: 18, text: "Boa tarde 👋" },
  { until: 24, text: "Boa noite 👋" },
] as const;

function getGreeting(): string {
  const hour = new Date().getHours();

  return GREETINGS.find((g) => hour < g.until)?.text ?? "Olá 👋";
}

export function UserGreeting() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-center">
      <Text size="sm" className="text-muted-foreground leading-tight">
        {getGreeting()}
      </Text>

      <Heading size="xs" className="truncate leading-tight">
        {user?.firstName ?? "Convidado"}
      </Heading>
    </div>
  );
}

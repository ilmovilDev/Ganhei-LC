"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) return "Bom dia 👋";
  if (hour < 18) return "Boa tarde 👋";
  return "Boa noite 👋";
}

export default function UserGreeting() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
    );
  }

  const username = user?.firstName ?? "Convidado";

  return (
    <div className="flex flex-col leading-none">
      <h2 className="text-sm font-semibold tracking-tight md:text-base">
        Olá, {username}
      </h2>

      <p className="text-muted-foreground text-xs">{getGreeting()}</p>
    </div>
  );
}

"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { user, isLoaded } = useUser();

  const username = user?.firstName ?? "Convidado";

  return (
    <header className="bg-background flex h-16 items-center justify-between border-b p-4">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <div className="flex flex-col leading-tight">
          {!isLoaded ? (
            <>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1 h-3 w-40" />
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold tracking-tight">
                {`Olá, ${username}`}
              </h2>

              <p className="text-muted-foreground text-xs">{getGreeting()}</p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {!isLoaded ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <UserButton />
        )}
      </div>
    </header>
  );
}

// ---------------------------------------------
// UX: greeting dinâmico (micro-copy premium)
// ---------------------------------------------
function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia 👋";
  if (hour < 18) return "Boa tarde 👋";
  return "Boa noite 👋";
}

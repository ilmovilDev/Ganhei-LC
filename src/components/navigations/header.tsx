"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";
import { UserGreeting } from "./user-greeting";

export function Header() {
  return (
    <header className="border-border/50 bg-background/80 sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl sm:h-18 lg:px-6">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="shrink-0" />

        <div className="hidden sm:block">
          <UserGreeting />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <UserButton />
      </div>
    </header>
  );
}

"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

type HeaderProps = {
  left?: ReactNode;
  right?: ReactNode;
};

export default function HeaderBase({ left, right }: HeaderProps) {
  const { isLoaded } = useUser();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b p-4">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {left}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {right}
        <div className="flex h-8 w-8 items-center justify-center">
          {isLoaded ? (
            <UserButton />
          ) : (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </div>
      </div>
    </header>
  );
}

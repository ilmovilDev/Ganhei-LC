"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { routesConfig } from "@/config/navigations/routes.config";
import { Heading } from "../typography/heading";

//////////////
/// Helper ///
//////////////
function getRouteByPath(pathname: string): string {
  const route = routesConfig.find((route) => route.path === pathname);
  return route?.label ?? "Dashboard";
}

export function Header() {
  const pathname = usePathname();

  const currentRouteLabel = getRouteByPath(pathname);

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-x-3">
        <SidebarTrigger />

        <Heading size="sm">{currentRouteLabel}</Heading>
      </div>

      {/* Right */}
      <UserButton />
    </header>
  );
}

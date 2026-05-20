"use client";

import { ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation";
import TimeSelect from "@/components/shared/time-select";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { RouteConfig, routesConfig } from "@/config/navigations/routes.config";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  actions?: ReactNode;
}

function getCurrentRoute(pathname: string): RouteConfig {
  return (
    routesConfig.find((route) => route.path === pathname) ?? {
      label: "Dashboard",
      description: "Visão geral da plataforma",
      path: "/dashboard",
      icon: undefined as never,
    }
  );
}

export function HeaderPage({ className, actions }: Props) {
  const pathname = usePathname();

  const currentRoute = getCurrentRoute(pathname);

  return (
    <section
      className={cn(
        "flex flex-row items-center justify-between gap-4",
        className,
      )}
    >
      {/* Left */}
      <div className="min-w-0 space-y-1">
        <Heading size="md" className="truncate">
          {currentRoute.label}
        </Heading>

        {currentRoute.description && (
          <Text
            size="sm"
            className="text-muted-foreground hidden max-w-2xl md:block"
          >
            {currentRoute.description}
          </Text>
        )}
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Right */}
        {actions && actions}
        <Suspense
          fallback={
            <div className="bg-muted h-10 w-28 animate-pulse rounded-md" />
          }
        >
          <TimeSelect />
        </Suspense>
      </div>
    </section>
  );
}

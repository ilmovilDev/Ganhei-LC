"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routesConfig } from "@/config/navigations/routes.config";
import { cn } from "@/lib/utils";
import { Text } from "../typography/text";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = routesConfig.filter((route) => route.showInNav);

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <Image
          src="/logo.svg"
          width={280}
          height={60}
          alt="Ganhei LC"
          className="-ml-2.5"
          priority
        />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarMenu className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.path || pathname.startsWith(`${item.path}/`);

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.path}>
                      <Icon
                        className={cn("h-4 w-4", isActive && "text-primary")}
                      />
                      <span className={cn(isActive && "text-primary")}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

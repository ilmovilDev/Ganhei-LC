import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigations/app-sidebar";
import { Header } from "@/components/navigations/header";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <main className="bg-background flex h-dvh w-full overflow-hidden">
        <aside className="shrink-0">
          <AppSidebar />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex min-h-0 w-full flex-1 flex-col p-4">
            {children}
          </main>
        </div>
      </main>
    </SidebarProvider>
  );
}

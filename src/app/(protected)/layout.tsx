import React from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/schared/headers/header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="no-scrollbar flex w-full flex-1 flex-col overflow-auto">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}

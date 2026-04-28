"use client";

import UserGreeting from "@/components/schared/header/user-greeting";
import HeaderMonthSelector from "./header-month-selector";
import HeaderPrimaryAction from "./header-primary-action";

interface DashboardHeaderProps {
  month?: string;
}

export default function DashboardHeader({ month }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 px-4 py-2 md:flex-row md:items-center md:justify-between">
      {/* LEFT */}
      <div className="hidden md:block">
        <UserGreeting />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-x-2">
        <HeaderMonthSelector month={month} />
        <HeaderPrimaryAction />
      </div>
    </div>
  );
}

"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import UserGreeting from "./user-greeting";

export default function HeaderLeft() {
  return (
    <div className="flex w-full items-center gap-x-2">
      <SidebarTrigger />

      {/* Greeting solo en mobile */}
      <div className="md:hidden">
        <UserGreeting />
      </div>
    </div>
  );
}

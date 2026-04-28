"use client";

import { UserButton } from "@clerk/nextjs";

export default function HeaderRight() {
  return (
    <div className="flex w-full items-center justify-end gap-x-2">
      <UserButton />
    </div>
  );
}

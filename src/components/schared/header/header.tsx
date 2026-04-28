"use client";

import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";

export default function Header() {
  return (
    <header className="bg-background flex h-16 items-center justify-between px-4">
      <HeaderLeft />
      <HeaderRight />
    </header>
  );
}

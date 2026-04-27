"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useMobile() {
  // ✅ Inicialización lazy (NO effect)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mql.addEventListener("change", onChange);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return isMobile;
}

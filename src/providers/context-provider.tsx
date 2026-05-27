"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface SelectedPeriodContextValue {
  month: number;
  year: number;
}

interface SelectedPeriodProviderProps {
  month: number;
  year: number;
  children: ReactNode;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const SelectedPeriodContext = createContext<SelectedPeriodContextValue | null>(
  null,
);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function SelectedPeriodProvider({
  month,
  year,
  children,
}: SelectedPeriodProviderProps) {
  const value = useMemo(
    () => ({
      month,
      year,
    }),
    [month, year],
  );

  return (
    <SelectedPeriodContext.Provider value={value}>
      {children}
    </SelectedPeriodContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useSelectedPeriod(): SelectedPeriodContextValue {
  const context = useContext(SelectedPeriodContext);

  if (!context) {
    throw new Error(
      "useSelectedPeriod must be used within <SelectedPeriodProvider>",
    );
  }

  return context;
}

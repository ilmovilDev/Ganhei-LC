"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface PeriodContextValue {
  month: number;
  year: number;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const PeriodContext = createContext<PeriodContextValue | null>(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

interface PeriodProviderProps {
  month: number;
  year: number;
  children: React.ReactNode;
}

export function PeriodProvider({ month, year, children }: PeriodProviderProps) {
  const value = useMemo(() => ({ month, year }), [month, year]);

  return (
    <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
  );
}

export function usePeriodContext(): PeriodContextValue {
  const ctx = useContext(PeriodContext);

  if (!ctx) {
    throw new Error(
      "usePeriodContext deve ser usado dentro de <PeriodProvider>",
    );
  }

  return ctx;
}

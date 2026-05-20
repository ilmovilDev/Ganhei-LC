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

interface EarningsContextValue {
  month: number;
  year: number;
  /**
   * version — inteiro que incrementa a cada refetch.
   * Os hooks de cada zona observam este valor via useEffect
   * e re-executam o fetch quando ele muda.
   */
  version: number;
  refetch: () => void;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const EarningsContext = createContext<EarningsContextValue | null>(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

interface EarningsProviderProps {
  month: number;
  year: number;
  children: React.ReactNode;
}

export function EarningsProvider({
  month,
  year,
  children,
}: EarningsProviderProps) {
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const value = useMemo(
    () => ({ month, year, version, refetch }),
    [month, year, version, refetch],
  );

  return (
    <EarningsContext.Provider value={value}>
      {children}
    </EarningsContext.Provider>
  );
}

export function useEarningsContext(): EarningsContextValue {
  const ctx = useContext(EarningsContext);

  if (!ctx) {
    throw new Error(
      "useEarningsContext deve ser usado dentro de <EarningsProvider>",
    );
  }

  return ctx;
}

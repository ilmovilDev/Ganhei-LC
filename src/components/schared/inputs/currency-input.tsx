"use client";

import { Input } from "@/components/ui/input";
import { useMemo } from "react";

// ---------------------------------------------

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
}

// ---------------------------------------------

export function CurrencyInput({ value, onChange }: CurrencyInputProps) {
  // ✅ Derivado (NO estado)
  const display = useMemo(() => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  }, [value]);

  // ---------------------------------------------

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");

    const numeric = Number(raw) / 100;

    onChange(numeric);
  }

  // ---------------------------------------------

  return (
    <Input
      inputMode="numeric"
      value={display}
      onChange={handleChange}
      className="text-right font-semibold"
      aria-label="Valor em reais"
    />
  );
}

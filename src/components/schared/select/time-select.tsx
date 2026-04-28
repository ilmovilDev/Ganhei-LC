"use client";

import { useEffect, useMemo, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Meses normalizados (SIEMPRE 2 dígitos)
 */
const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
] as const;

type MonthValue = (typeof MONTH_OPTIONS)[number]["value"];

const VALID_MONTHS = new Set(MONTH_OPTIONS.map((m) => m.value));

/**
 * Devuelve mes actual en formato "MM"
 */
function getCurrentMonth(): MonthValue {
  const now = new Date();
  return String(now.getMonth() + 1).padStart(2, "0") as MonthValue;
}

/**
 * Normaliza cualquier valor de entrada a "MM" válido
 */
function normalizeMonth(value: string | null | undefined): MonthValue | null {
  if (!value) return null;

  // Ej: "4" -> "04"
  const normalized = value.padStart(2, "0");

  if (VALID_MONTHS.has(normalized as MonthValue))
    return normalized as MonthValue;

  return null;
}

type TimeSelectProps = {
  /**
   * Valor proveniente del server (searchParams)
   */
  month?: string;
};

export default function TimeSelect({ month }: TimeSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const currentMonth = useMemo(() => {
    const fromProp = normalizeMonth(month);
    if (fromProp) return fromProp;

    const fromUrl = normalizeMonth(searchParams.get("month"));
    if (fromUrl) return fromUrl;

    return getCurrentMonth();
  }, [month, searchParams]);

  useEffect(() => {
    const urlMonthRaw = searchParams.get("month");
    const urlMonth = normalizeMonth(urlMonthRaw);

    // Si ya es válido y coincide → no hacer nada
    if (urlMonth === currentMonth) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("month", currentMonth);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [currentMonth, pathname, router, searchParams]);

  /**
   * 3. Cambio manual del usuario
   */
  const handleChange = (value: string) => {
    if (!VALID_MONTHS.has(value as MonthValue)) return;

    const params = new URLSearchParams(searchParams.toString());

    // Evita navegación innecesaria
    if (params.get("month") === value) return;

    params.set("month", value);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const selectedMonthLabel =
    MONTH_OPTIONS.find((m) => m.value === currentMonth)?.label ?? "Selecionar";

  return (
    <Select value={currentMonth} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "flex h-10 w-full md:w-fit",
          "bg-background border px-2 shadow-sm",
          isPending && "opacity-70",
        )}
        disabled={isPending}
      >
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />

          <span className="text-sm font-medium">{selectedMonthLabel}</span>
        </div>
      </SelectTrigger>

      <SelectContent position="popper">
        {MONTH_OPTIONS.map((m) => (
          <SelectItem key={m.value} value={m.value}>
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

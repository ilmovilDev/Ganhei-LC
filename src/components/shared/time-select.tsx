"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const MONTHS_FULL = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function buildYearRange() {
  const cur = new Date().getFullYear();
  return { min: cur - 2, max: cur };
}

function normalizeMonth(v: string | null): number {
  const n = parseInt(v ?? "", 10);
  return n >= 1 && n <= 12 ? n - 1 : new Date().getMonth();
}
function normalizeYear(v: string | null): number {
  const { min, max } = buildYearRange();
  const n = parseInt(v ?? "", 10);
  return n >= min && n <= max ? n : new Date().getFullYear();
}

interface TimeSelectProps {
  month?: string;
  year?: string;
}

export default function TimeSelect({ month, year }: TimeSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // ← fuente de verdad reactiva
  const [isPending, startTransition] = useTransition();

  // Lee siempre del URL; cae al prop como fallback inicial
  const selMonth = normalizeMonth(searchParams.get("month") ?? month ?? null);
  const selYear = normalizeYear(searchParams.get("year") ?? year ?? null);

  const [open, setOpen] = useState(false);
  const [navYear, setNavYear] = useState(selYear);
  const ref = useRef<HTMLDivElement>(null);

  const { min, max } = buildYearRange();
  const now = new Date();

  // Sincroniza navYear si selYear cambia externamente (ej. back/forward del browser)
  //   useEffect(() => {
  //     setNavYear(selYear);
  //   }, [selYear]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function navigate(m: number, y: number) {
    const params = new URLSearchParams(searchParams.toString()); // preserva otros params
    params.set("month", String(m + 1).padStart(2, "0"));
    params.set("year", String(y));
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    setOpen(false);
  }

  function goToday() {
    navigate(now.getMonth(), now.getFullYear());
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => {
          setNavYear(selYear);
          setOpen((o) => !o);
        }}
        disabled={isPending}
        className={cn(
          "inline-flex h-10 items-center gap-2 px-3.5",
          "bg-background rounded-md border text-sm font-medium",
          "transition-colors duration-150",
          "hover:bg-muted hover:border-border",
          open && "bg-muted border-border",
          isPending && "pointer-events-none opacity-60",
        )}
      >
        <Calendar className="text-muted-foreground h-4 w-4" />
        <span className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
          {MONTHS_FULL[selMonth]} {selYear}
        </span>
        <div className="bg-border mx-0.5 h-3.5 w-px" />
        <ChevronDown
          className={cn(
            "text-muted-foreground h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="bg-background absolute top-[calc(100%+8px)] right-0 z-50 w-68 rounded-xl border p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setNavYear((y) => Math.max(min, y - 1))}
                disabled={navYear <= min}
                className="text-muted-foreground hover:bg-muted flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="w-11 text-center text-sm font-medium">
                {navYear}
              </span>
              <button
                onClick={() => setNavYear((y) => Math.min(max, y + 1))}
                disabled={navYear >= max}
                className="text-muted-foreground hover:bg-muted flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={goToday}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-2 py-1 text-xs transition-colors"
            >
              Hoje
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {MONTHS_SHORT.map((m, i) => {
              const isSelected = i === selMonth && navYear === selYear;
              const isToday =
                i === now.getMonth() && navYear === now.getFullYear();
              return (
                <button
                  key={i}
                  onClick={() => navigate(i, navYear)}
                  className={cn(
                    "rounded-lg py-1.5 text-xs transition-colors",
                    isSelected
                      ? "bg-foreground text-background font-medium"
                      : isToday
                        ? "ring-border text-foreground hover:bg-muted ring-[0.5px]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end border-t pt-2.5">
            <div className="text-muted-foreground bg-muted inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs">
              <Check className="h-3.5 w-3.5" />
              {MONTHS_FULL[selMonth]} {selYear}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

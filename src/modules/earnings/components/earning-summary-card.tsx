"use client";

import { TrendingUp, Wallet, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-currency";
import { MonthSummary } from "../types";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface SummaryCardsProps {
  // Antes recebia rows: Day[] e calculava no cliente.
  // Agora recebe o resumo já calculado pelo servidor —
  // null enquanto ainda não chegou nenhuma resposta.
  summary: MonthSummary | null;
  isLoading: boolean;
}

interface StatItemProps {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  dimmed?: boolean;
}

// ─────────────────────────────────────────────
// SUBCOMPONENTS
// ─────────────────────────────────────────────

function StatItem({ label, value, sub, positive, dimmed }: StatItemProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p
        className={cn(
          "text-xl leading-none font-semibold tabular-nums",
          positive === true && "text-emerald-600 dark:text-emerald-400",
          positive === false && "text-red-600 dark:text-red-400",
          dimmed && "text-muted-foreground",
        )}
      >
        {value}
      </p>
      {sub && <p className="text-muted-foreground text-[11px]">{sub}</p>}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card animate-pulse space-y-4 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <div className="bg-muted h-3 w-24 rounded" />
        <div className="bg-muted h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-3">
        <div className="bg-muted h-7 w-32 rounded" />
        <div className="grid grid-cols-2 gap-3 border-t pt-1">
          <div className="space-y-1.5">
            <div className="bg-muted h-2.5 w-16 rounded" />
            <div className="bg-muted h-5 w-20 rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="bg-muted h-2.5 w-16 rounded" />
            <div className="bg-muted h-5 w-20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function EarningsSummaryCards({
  summary,
  isLoading,
}: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  // summary null → mês sem nenhum registro
  if (!summary || summary.totalDays === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EmptyCard
          icon={<Wallet className="h-4 w-4" />}
          label="Resumo financeiro"
          message="Registre um dia para ver os totais"
        />
        <EmptyCard
          icon={<Clock className="h-4 w-4" />}
          label="Produtividade"
          message="Registre um dia para ver as médias"
        />
      </div>
    );
  }

  // Médias calculadas no cliente a partir dos totais do servidor.
  // São derivadas simples — não precisam ir ao banco.
  const avgNetPerDay =
    summary.totalDays > 0 ? summary.netProfit / summary.totalDays : 0;
  const avgNetPerHour =
    summary.totalHours > 0 ? summary.netProfit / summary.totalHours : 0;
  const netMargin =
    summary.grossProfit > 0
      ? (summary.netProfit / summary.grossProfit) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Card 1 — Financeiro */}
      <div className="bg-card space-y-4 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Resumo financeiro</p>
          <div className="rounded-lg bg-emerald-50 p-1.5 dark:bg-emerald-900/30">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        {/* Destaque: líquido total */}
        <div>
          <p className="text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase">
            Líquido total
          </p>
          <p
            className={cn(
              "text-3xl leading-none font-bold tabular-nums",
              summary.netProfit >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400",
            )}
          >
            {formatCurrency(summary.netProfit)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Margem líquida de{" "}
            <span className="text-foreground font-medium">
              {netMargin.toFixed(1)}%
            </span>{" "}
            sobre o bruto
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t pt-3">
          <StatItem
            label="Bruto"
            value={formatCurrency(summary.grossProfit)}
            positive={true}
          />
          <StatItem
            label="Despesas"
            value={formatCurrency(summary.totalExpenses)}
            positive={summary.totalExpenses === 0 ? undefined : false}
            dimmed={summary.totalExpenses === 0}
          />
        </div>
      </div>

      {/* Card 2 — Produtividade */}
      <div className="bg-card space-y-4 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Produtividade</p>
          <div className="rounded-lg bg-blue-50 p-1.5 dark:bg-blue-900/30">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Destaque: líquido por hora */}
        <div>
          <p className="text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase">
            Líquido / hora
          </p>
          <p className="text-3xl leading-none font-bold tabular-nums">
            {formatCurrency(avgNetPerHour)}
            <span className="text-muted-foreground ml-1 text-base font-normal">
              /h
            </span>
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Média de{" "}
            <span className="text-foreground font-medium">
              {formatCurrency(avgNetPerDay)}
            </span>{" "}
            por dia trabalhado
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t pt-3">
          <StatItem
            label="Dias"
            value={String(summary.totalDays)}
            sub="trabalhados"
          />
          <StatItem
            label="Horas"
            value={`${summary.totalHours}h`}
            sub="no período"
          />
          <StatItem
            label="Km"
            value={`${summary.totalKm.toFixed(0)}`}
            sub="rodados"
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE CARD
// ─────────────────────────────────────────────

function EmptyCard({
  icon,
  label,
  message,
}: {
  icon: React.ReactNode;
  label: string;
  message: string;
}) {
  return (
    <div className="bg-card/50 flex flex-col gap-3 rounded-xl border border-dashed p-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        <div className="bg-muted text-muted-foreground rounded-lg p-1.5">
          {icon}
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

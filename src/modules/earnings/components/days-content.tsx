"use client";

import { AlertCircle } from "lucide-react";
import { useEarningsContext } from "../context/earning.provider";
import { useDays } from "../hooks";
import DaysTable from "./days-table";
import { EarningsSummaryCards } from "./earning-summary-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DaysContent() {
  const { month, year } = useEarningsContext();

  // rows      → dias visíveis na tabela (pode ser apenas os 5 iniciais)
  // summary   → totais do mês completo vindos do servidor
  // hasMore   → controla se o botão "Carregar mês completo" aparece
  // loadAll   → chamado quando o botão é clicado
  const { rows, summary, isPending, isLoadingAll, error, hasMore, loadAll } =
    useDays();

  // isFirstLoad → true apenas na carga inicial quando não há nada na tela ainda
  const isFirstLoad = isPending && rows.length === 0;
  const hasData = rows.length > 0;

  if (error) {
    return (
      <div className="border-destructive/30 bg-destructive/5 text-destructive flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Erro ao carregar os dados. Tente novamente.
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4">
        {/*
          Cards de resumo — recebem `summary` (mês completo do servidor)
          e NÃO dependem de `rows`, então os totais são sempre corretos
          mesmo quando a tabela mostra apenas os primeiros 5 dias.
        */}
        <EarningsSummaryCards summary={summary} isLoading={isFirstLoad} />

        {/* Mensagem de mês vazio — só exibe após carregar sem dados */}
        {!isPending && !hasData && (
          <p className="text-muted-foreground px-0.5 text-sm">
            Sem registros em {month.toString().padStart(2, "0")}/{year}.
          </p>
        )}

        {/* Tabela com os registros paginados */}
        <div className="flex min-h-0 flex-1 flex-col">
          <DaysTable
            pages={[rows]}
            isLoading={isFirstLoad}
            hasNextPage={hasMore}
            fetchNextPage={loadAll}
            isFetchingNextPage={isLoadingAll}
          />
        </div>
      </div>
    </div>
  );
}

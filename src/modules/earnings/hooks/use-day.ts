"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { getDaysByMonthAction } from "../actions";
import { Day, MonthSummary } from "../types";
import { useEarningsContext } from "../context/earning.provider";

const INITIAL_LIMIT = 5;

interface UseDaysReturn {
  rows: Day[]; // registros visíveis na tabela (paginado)
  summary: MonthSummary | null; // totais do mês completo (sempre do servidor)
  isPending: boolean; // true durante o fetch inicial (primeiros 5)
  isLoadingAll: boolean; // true enquanto carrega o mês completo na tabela
  error: string | null;
  hasMore: boolean; // true quando há mais dias além dos 5 iniciais
  loadAll: () => void; // chamado pelo botão "Carregar mês completo"
}

export function useDays(): UseDaysReturn {
  const { month, year, version } = useEarningsContext();

  const [rows, setRows] = useState<Day[]>([]);
  const [summary, setSummary] = useState<MonthSummary | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoadingAll, startLoadAllTransition] = useTransition();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowAll(false);
  }, [month, year, version]);

  const fetchData = useCallback(
    (all: boolean) => {
      setError(null);
      const runTransition = all ? startLoadAllTransition : startTransition;

      runTransition(async () => {
        const result = await getDaysByMonthAction(
          month,
          year,
          all ? undefined : INITIAL_LIMIT,
        );

        if (!result.success) {
          setError(result.error.message ?? "Erro ao carregar os registros.");
          return;
        }

        // rows → tabela (paginado)
        setRows(result.data.days);
        // total → controla se o botão "carregar mais" aparece
        setTotalCount(result.data.total);
        // summary → cards de resumo (mês completo, sempre)
        setSummary(result.data.summary);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [month, year, version],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData(showAll);
  }, [fetchData, showAll]);

  const loadAll = useCallback(() => {
    setShowAll(true);
  }, []);

  // hasMore → true quando a tabela exibe menos dias do que o total real do mês
  const hasMore = !showAll && rows.length < totalCount;

  return { rows, summary, isPending, isLoadingAll, error, hasMore, loadAll };
}

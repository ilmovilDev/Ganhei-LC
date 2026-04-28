"use client";

import { DollarSign, Wallet, Clock, Receipt, Car } from "lucide-react";

import MetricCard from "./metric-card";
import MetricCardSkeleton from "./metric-card-skeleton";

import { useDashboard } from "@/modules/dashboard/hooks/use-dashboard";
import { formatCurrency } from "@/lib/helpers/format-currency";

// ---------------------------------------------

interface MetricsGridProps {
  month: string;
}

// ---------------------------------------------

export default function MetricsGrid({ month }: MetricsGridProps) {
  const { data, isLoading } = useDashboard(month);

  const metrics = [
    {
      title: "Ganhos líquidos",
      value: formatCurrency(data?.net ?? 0),
      description: "Após deduções",
      icon: <Wallet />,
      color: "green" as const,
      span: "sm:col-span-2 lg:col-span-1",
    },
    {
      title: "Ganhos brutos",
      value: formatCurrency(data?.gross ?? 0),
      description: "Antes das deduções",
      icon: <DollarSign />,
      color: "gray" as const,
    },
    {
      title: "Ganho por hora",
      value: formatCurrency(data?.perHour ?? 0),
      description: "Média por hora",
      icon: <Clock />,
      color: "purple" as const,
    },
    {
      title: "Total gastos",
      value: formatCurrency(data?.expenses ?? 0),
      description: "Total de despesas",
      icon: <Receipt />,
      color: "red" as const,
    },
    {
      title: "Km percorridos",
      value: `${data?.km ?? 0} km`,
      description: "Quilometragem do mês",
      icon: <Car />,
      color: "blue" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {isLoading
        ? metrics.map((metric, index) => (
            <div key={index} className={metric.span}>
              <MetricCardSkeleton />
            </div>
          ))
        : metrics.map((metric, index) => (
            <div key={index} className={metric.span}>
              <MetricCard {...metric} />
            </div>
          ))}
    </div>
  );
}

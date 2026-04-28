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

  // 🔥 evita duplicación
  const metrics = [
    {
      title: "Ganhos líquidos",
      value: formatCurrency(data?.net ?? 0),
      description: "Após deduções",
      icon: <Wallet />,
      color: "green" as const,
      span: "col-span-2 md:col-span-1",
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
      value: formatCurrency(data?.km ?? 0),
      description: "Quilometragem do mês",
      icon: <Car />,
      color: "blue" as const,
    },
  ];

  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))] gap-4">
      {isLoading
        ? // 🔥 skeletons consistentes
          metrics.map((_, index) => (
            <div
              key={index}
              className={index === 0 ? "col-span-2 md:col-span-1" : ""}
            >
              <MetricCardSkeleton />
            </div>
          ))
        : // ✅ data real
          metrics.map((metric, index) => (
            <div key={index} className={metric.span}>
              <MetricCard {...metric} />
            </div>
          ))}
    </div>
  );
}

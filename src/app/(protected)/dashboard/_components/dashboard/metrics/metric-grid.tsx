"use client";

import { DollarSign, Wallet, Clock, Receipt, Car } from "lucide-react";

import { formatCurrency } from "@/lib/helpers/format-currency";
import { DashboardMetrics } from "@/modules/dashboard/types/dashboard.types";

import MetricCard from "./metric-card";

interface MetricsGridProps {
  data: DashboardMetrics;
}

export default function MetricsGrid({ data }: MetricsGridProps) {
  const metrics = [
    {
      title: "Ganhos líquidos",
      value: formatCurrency(data.net),
      description: "Após custos",
      icon: <Wallet />,
      color: "green" as const,
      span: "col-span-2 lg:col-span-3 xl:col-span-1",
      size: "highlight" as const,
    },
    {
      title: "Ganhos brutos",
      value: formatCurrency(data.gross),
      description: "Sem descontos",
      icon: <DollarSign />,
      color: "green" as const,
      span: "lg:col-span-3 xl:col-span-1",
    },
    {
      title: "Despesas",
      value: formatCurrency(data.expenses),
      description: "Custos totais",
      icon: <Receipt />,
      color: "red" as const,
      span: "lg:col-span-2 xl:col-span-1",
    },
    {
      title: "Por hora",
      value: formatCurrency(data.perHour),
      description: "Média/hora",
      icon: <Clock />,
      color: "gray" as const,
      span: "lg:col-span-2 xl:col-span-1",
    },
    {
      title: "Quilometragem",
      value: `${data.km} km`,
      description: "Distância",
      icon: <Car />,
      color: "gray" as const,
      span: "lg:col-span-2 xl:col-span-1",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-2 lg:grid-cols-6 xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <div key={index} className={metric.span}>
          <MetricCard {...metric} />
        </div>
      ))}
    </div>
  );
}

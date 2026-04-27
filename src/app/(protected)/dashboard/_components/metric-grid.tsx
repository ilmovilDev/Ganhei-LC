"use client";

import { DollarSign, Wallet, Clock, Receipt, Car } from "lucide-react";
import MetricCard from "./metric-card";

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        title="Ganhos brutos"
        value="R$ 1.250,00"
        description="Antes das deduções"
        icon={<DollarSign size={18} />}
        color="green"
      />

      <MetricCard
        title="Ganhos líquidos"
        value="R$ 870,00"
        description="Após deduções"
        icon={<Wallet size={18} />}
        color="green"
      />

      <MetricCard
        title="Ganho por hora"
        value="R$ 43,50"
        description="Média por hora"
        icon={<Clock size={18} />}
        color="purple"
      />

      <MetricCard
        title="Total gastos"
        value="R$ 380,00"
        description="Total de despesas"
        icon={<Receipt size={18} />}
        color="red"
      />

      {/* FULL WIDTH */}
      <div className="col-span-2">
        <MetricCard
          title="Km percorridos"
          value="156,8 km"
          description="Quilometragem do dia"
          icon={<Car size={18} />}
          color="blue"
        />
      </div>
    </div>
  );
}

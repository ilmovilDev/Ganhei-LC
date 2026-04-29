"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { BarChart3 } from "lucide-react";

// ---------------------------------------------

export default function DashboardGraphicsContent() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      {/* CARD 1 */}
      <Card className="border-dashed">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="bg-muted flex size-12 items-center justify-center rounded-xl">
            <BarChart3 className="text-muted-foreground size-5" />
          </div>

          <CardTitle className="text-base font-semibold">
            Ganhos por aplicativo
          </CardTitle>

          <CardDescription className="max-w-60 text-center text-xs leading-relaxed">
            Visualize a distribuição dos seus ganhos por plataforma.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-6 text-center">
          <p className="text-muted-foreground text-xs">Em desenvolvimento</p>
        </CardContent>
      </Card>

      {/* CARD 2 */}
      <Card className="border-dashed">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="bg-muted flex size-12 items-center justify-center rounded-xl">
            <BarChart3 className="text-muted-foreground size-5" />
          </div>

          <CardTitle className="text-base font-semibold">
            Gastos por categoria
          </CardTitle>

          <CardDescription className="max-w-60 text-center text-xs leading-relaxed">
            Acompanhe como seus custos estão distribuídos no mês.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-6 text-center">
          <p className="text-muted-foreground text-xs">Em desenvolvimento</p>
        </CardContent>
      </Card>
    </div>
  );
}

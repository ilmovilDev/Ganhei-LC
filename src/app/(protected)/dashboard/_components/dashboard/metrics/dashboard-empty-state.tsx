"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { FileX } from "lucide-react";

// ---------------------------------------------

export default function DashboardEmptyState() {
  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <Card className="w-full border-dashed shadow-sm">
        <CardHeader className="flex flex-col items-center pb-2 text-center">
          {/* ICON */}
          <div className="bg-muted flex size-14 items-center justify-center rounded-xl md:size-16">
            <FileX className="text-muted-foreground size-6 md:size-8" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-3 text-center">
          {/* TITLE */}
          <CardTitle className="text-base font-semibold md:text-xl">
            Nenhum dado encontrado
          </CardTitle>

          {/* DESCRIPTION */}
          <CardDescription className="max-w-xs text-xs leading-relaxed md:text-sm">
            Ainda não há registros para este mês. Cadastre seus ganhos para
            visualizar suas métricas.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

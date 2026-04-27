"use client";

import { Hammer, Clock, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  title?: string;
  description?: string;
  showBack?: boolean;
};

export default function UnderConstruction({
  title = "Página en construcción",
  description = "Estamos trabajando en esta sección para ofrecerte la mejor experiencia posible. Vuelve pronto 🚀",
  showBack,
}: Props) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center px-6">
      <div className="flex max-w-xl flex-col items-center space-y-6 text-center">
        {/* Icon */}
        <div className="bg-muted rounded-2xl p-6 shadow-sm">
          <Hammer className="text-primary h-10 w-10" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-sm sm:text-base">
          {description}
        </p>

        {/* Status badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            En progreso
          </div>

          <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Rocket className="h-3.5 w-3.5" />
            Próximamente
          </div>
        </div>

        {/* Actions */}
        {showBack && (
          <div className="pt-4">
            <Link href="/dashboard">
              <Button variant="default">Volver al dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

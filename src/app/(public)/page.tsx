import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { DollarSign, Gauge, Clock, BarChart3 } from "lucide-react";
import { redirect } from "next/navigation";
import { Feature } from "./_components/feature";
import { Stat } from "./_components/stat";

export default async function AuthPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="bg-background text-foreground flex h-screen flex-col items-center justify-center overflow-y-auto md:flex-row md:justify-between lg:overflow-hidden">
      {/* LEFT SIDE */}
      <div className="flex items-center justify-between overflow-hidden px-4 py-2 md:w-1/2 md:items-start md:py-4">
        <div className="space-y-5 sm:space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-emerald-600 p-1.5 text-white sm:p-2">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-base font-semibold sm:text-lg">Ganhei</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl leading-snug font-bold tracking-tight sm:text-3xl sm:leading-tight lg:text-4xl">
            Controle total <br />
            da sua <span className="text-emerald-500">renda</span>
          </h1>

          {/* Description */}
          <p className="text-muted-foreground max-w-sm text-sm sm:max-w-md sm:text-base">
            Acompanhe ganhos, despesas e descubra sua rentabilidade real por
            hora. Decisões mais inteligentes com dados simples.
          </p>

          {/* Stats */}
          <div className="flex gap-6 sm:gap-8">
            <Stat label="R$/h" desc="Ganho por hora" />
            <Stat label="Km" desc="Distância do mês" />
            <Stat label="Líq." desc="Resultado real" />
          </div>

          {/* Features */}
          <div className="hidden space-y-4 pt-2 sm:space-y-5 md:flex">
            <Feature
              icon={<BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />}
              title="Registro diário rápido"
              description="Apps, horas e quilômetros em segundos"
            />

            <Feature
              icon={<Gauge className="h-4 w-4 sm:h-5 sm:w-5" />}
              title="Dashboard em tempo real"
              description="Métricas claras por mês"
            />

            <Feature
              icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
              title="Rentabilidade por hora"
              description="Saiba se vale a pena trabalhar mais"
            />
          </div>
        </div>

        {/* Footer */}
        {/* <p className="text-muted-foreground mt-6 text-[10px] sm:mt-8 sm:text-xs">
          © 2026 Ganhei - Gratuito para começar
        </p> */}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-between overflow-hidden px-4 py-2 md:w-1/2 md:justify-center md:py-4">
        <Card className="w-full max-w-md rounded-2xl shadow-lg">
          <CardContent className="p-8">
            <h2 className="mb-2 text-xl font-semibold">Entrar na sua conta</h2>

            <p className="text-muted-foreground mb-6 text-sm">
              Acesse ou crie sua conta gratuitamente
            </p>

            {/* Google Button */}
            <SignInButton>
              <Button className="w-full" variant="secondary">
                Continuar com Google
              </Button>
            </SignInButton>

            <p className="text-muted-foreground mt-6 text-center text-xs">
              Ao continuar, você concorda com os Termos de uso e a Política de
              privacidade
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

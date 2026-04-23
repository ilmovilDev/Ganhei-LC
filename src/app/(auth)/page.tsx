import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function SignInPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="flex max-w-lg flex-col gap-y-4 p-4">
      <Image
        src="/logo.svg"
        width={320}
        height={80}
        alt="Ganhei AI"
        className="mb-4 -ml-2.5"
      />

      {/* Headline */}
      <h1 className="text-4xl leading-tight font-bold">
        Controle total da sua renda
      </h1>

      {/* Descripción */}
      <p className="text-muted-foreground max-w-md text-base leading-relaxed">
        Acompanhe seus ganhos e gastos no dia a dia e descubra sua rentabilidade
        real por hora. Tome decisões mais inteligentes e aumente seus lucros com
        dados simples e claros.
      </p>
      {/* Login button */}
      <SignInButton>
        <Button className="cursor-pointer">
          <p>Fazer login ou criar conta</p>
        </Button>
      </SignInButton>
    </div>
  );
}

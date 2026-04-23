import { requireUser } from "@/app/lib/auth/require-user";
import UnderConstruction from "@/components/shared/under-construction";

export default async function SubscriptonsPage() {
  await requireUser();
  return (
    <div>
      <UnderConstruction showBack={true} />
    </div>
  );
}

// <>
//   <HeaderSubscription />
//   <div className="flex flex-col gap-y-4 p-4">
//     {/* HEADER */}
//     <div>
//       <h1 className="text-2xl font-bold">Planos</h1>
//       <p className="text-muted-foreground text-sm">
//         Escolha o plano ideal para acompanhar suas finanças
//       </p>
//     </div>

//     {/* GRID */}
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//       {/* STARTER */}
//       <CardSubscription
//         title="Starter"
//         price="Grátis"
//         description="Para começar"
//         isCurrent={currentPlan === "starter"}
//         features={[
//           "Até 15 dias registrados",
//           "Controle básico de ganhos",
//           "Visualização limitada",
//         ]}
//       />

//       {/* PRO MENSAL */}
//       <CardSubscription
//         title="Pro Mensal"
//         price="R$ 29,90/mês"
//         description="Flexível"
//         highlight
//         isCurrent={currentPlan === "monthly"}
//         features={[
//           "Dias ilimitados",
//           "Controle completo de ganhos",
//           "Registro de gastos",
//           "Métricas avançadas",
//         ]}
//       />

//       {/* PRO TRIMESTRAL */}
//       <CardSubscription
//         title="Pro Trimestral"
//         price="R$ 79,90 / 3 meses"
//         description="Mais econômico"
//         badge="-10%"
//         isCurrent={currentPlan === "quarterly"}
//         features={[
//           "Dias ilimitados",
//           "Controle completo de ganhos",
//           "Registro de gastos",
//           "Métricas avançadas",
//         ]}
//       />
//     </div>
//   </div>
// </>

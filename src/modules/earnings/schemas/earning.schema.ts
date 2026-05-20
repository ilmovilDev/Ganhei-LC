import { App } from "@/generated/prisma/enums";
import { isTwoDecimalNumber } from "@/lib/utils/is-two-decimal-number";
import { z } from "zod";

const amount = z
  .number({
    message: "O valor deve ser um número.",
  })
  .positive({
    message: "O valor deve ser maior que zero.",
  })
  .refine(isTwoDecimalNumber, {
    message: "O valor não pode ter mais de 2 casas decimais.",
  });

const app = z.nativeEnum(App, {
  message: "Aplicativo inválido.",
});

export const EarningInput = z.object({
  app,
  amount,
});

export const EarningsArray = z
  .array(EarningInput)
  .min(1, {
    message: "Informe pelo menos um aplicativo.",
  })
  .superRefine((items, ctx) => {
    const usedApps = new Set<App>();

    items.forEach((item, index) => {
      /* ------------------------------------------------------------------ */
      /* APP REQUIRED                                                        */
      /* ------------------------------------------------------------------ */
      if (!item.app) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "app"],
          message: "Selecione um aplicativo.",
        });

        return;
      }

      /* ------------------------------------------------------------------ */
      /* DUPLICATE APPS                                                      */
      /* ------------------------------------------------------------------ */
      if (usedApps.has(item.app)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "app"],
          message:
            "Não é possível registrar o mesmo aplicativo duas vezes no mesmo dia.",
        });

        return;
      }

      usedApps.add(item.app);
    });
  });

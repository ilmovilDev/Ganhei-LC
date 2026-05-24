import { z } from "zod";
import { App } from "@/generated/prisma/enums";
import { isTwoDecimalNumber } from "@/lib/utils/is-two-decimal-number";

export const earningAmountSchema = z
  .number({
    message: "O valor deve ser um número.",
  })
  .positive({
    message: "O valor deve ser maior que zero.",
  })
  .max(999999.99, {
    message: "O valor informado é muito alto.",
  })
  .refine(isTwoDecimalNumber, {
    message: "O valor não pode ter mais de 2 casas decimais.",
  });

export const earningAppSchema = z.nativeEnum(App, {
  message: "Aplicativo inválido.",
});

export const earningInputSchema = z.object({
  app: earningAppSchema,

  amount: earningAmountSchema,
});

export const earningsArraySchema = z
  .array(earningInputSchema)
  .min(1, {
    message: "Informe pelo menos um aplicativo.",
  })
  .superRefine((items, ctx) => {
    const usedApps = new Set<App>();

    items.forEach((item, index) => {
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

export type EarningInputData = z.infer<typeof earningInputSchema>;

export type EarningsArrayData = z.infer<typeof earningsArraySchema>;

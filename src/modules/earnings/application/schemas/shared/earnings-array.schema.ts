import { z } from "zod";
import { App } from "@/generated/prisma/enums";
import { earningInputSchema } from "../earning.schema";

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

export type EarningsArrayInput = z.input<typeof earningsArraySchema>;
export type EarningsArrayOutput = z.output<typeof earningsArraySchema>;

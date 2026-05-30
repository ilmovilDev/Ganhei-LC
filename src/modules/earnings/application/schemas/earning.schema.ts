import { z } from "zod";
import { App } from "@/generated/prisma/enums";
import { moneySchema } from "@/shared/schemas/money/money.schema";

export const earningAppSchema = z.nativeEnum(App, {
  message: "Aplicativo inválido.",
});

export const earningInputSchema = z.object({
  app: earningAppSchema,
  amount: moneySchema,
});

export type EarningInput = z.input<typeof earningInputSchema>;
export type EarningOutput = z.output<typeof earningInputSchema>;

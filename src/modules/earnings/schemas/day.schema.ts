import { z } from "zod";
import { isTwoDecimalNumber } from "@/lib/utils/is-two-decimal-number";
import { EarningsArray } from "./earning.schema";

export const dayFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),

  hours: z
    .number({ message: "As horas devem ser um número." })
    .int({ message: "As horas devem ser um número inteiro." })
    .min(1, { message: "Mínimo de 1 hora." })
    .max(24, { message: "Máximo de 24 horas." }),

  kilometers: z
    .number({ message: "Os quilômetros devem ser um número." })
    .positive({ message: "Os quilômetros devem ser maior que zero." })
    .max(1000, { message: "Os quilômetros parecem ser excessivos." })
    .refine(isTwoDecimalNumber, {
      message: "Os quilômetros não podem ter mais de 2 casas decimais.",
    }),

  earnings: EarningsArray,
});

export type DayFormData = z.infer<typeof dayFormSchema>;

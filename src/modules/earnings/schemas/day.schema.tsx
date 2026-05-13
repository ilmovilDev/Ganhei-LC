import { z } from "zod";
import { normalizeToMidnight } from "@/lib/date/normalize-date";
import { isTwoDecimalNumber } from "@/lib/utils/is-two-decimal-number";
import { EarningsArraySchema } from "./earning.schema";

export const dayFormSchema = z.object({
  date: z
    .date({
      message: "Selecione uma data válida.",
    })
    .refine(
      (date) => {
        const normalizedDate = normalizeToMidnight(date);

        const today = normalizeToMidnight(new Date());

        return normalizedDate <= today;
      },
      {
        message: "Não é possível registrar uma data futura.",
      },
    ),

  hours: z
    .number({
      message: "As horas devem ser um número.",
    })
    .int({
      message: "As horas devem ser um número inteiro.",
    })
    .min(1, {
      message: "Mínimo de 1 hora.",
    })
    .max(24, {
      message: "Máximo de 24 horas.",
    }),

  kilometers: z
    .number({
      message: "Os quilômetros devem ser um número.",
    })
    .positive({
      message: "Os quilômetros devem ser maior que zero.",
    })
    .refine(isTwoDecimalNumber, {
      message: "Os quilômetros não podem ter mais de 2 casas decimais.",
    }),

  earnings: EarningsArraySchema,
});

export type DayFormData = z.infer<typeof dayFormSchema>;

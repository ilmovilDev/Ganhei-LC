import { z } from "zod";
import { isTwoDecimalNumber } from "@/lib/utils/is-two-decimal-number";
import { earningsArraySchema } from "./earning.schema";

export const isoDateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime());
  }, "Invalid date");

export const hoursSchema = z
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
  });

export const kilometersSchema = z
  .number({
    message: "Os quilômetros devem ser um número.",
  })
  .positive({
    message: "Os quilômetros devem ser maior que zero.",
  })
  .max(1000, {
    message: "Os quilômetros parecem ser excessivos.",
  })
  .refine(isTwoDecimalNumber, {
    message: "Os quilômetros não podem ter mais de 2 casas decimais.",
  });

export const dayFormSchema = z.object({
  date: isoDateOnlySchema,
  hours: hoursSchema,
  kilometers: kilometersSchema,
  earnings: earningsArraySchema,
});

export type DayFormInput = z.input<typeof dayFormSchema>;
export type DayFormOutput = z.output<typeof dayFormSchema>;

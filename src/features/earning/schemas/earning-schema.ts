import { App } from "@/generated/prisma/enums";
import { z } from "zod";

/**
 * 🔥 Enum seguro
 */
export const appEnum = z.nativeEnum(App, {
  message: "Aplicativo inválido",
});

/**
 * 💰 Amount robusto (input seguro desde form)
 */
export const amountSchema = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val), {
    message: "O valor deve ser um número válido",
  })
  .refine((val) => val > 0, {
    message: "O valor deve ser maior que zero",
  })
  .refine((val) => val <= 10000, {
    message: "O valor não pode ser maior que R$10.000",
  });

/**
 * 📅 Date normalizada
 */
export const dateSchema = z
  .string()
  .min(1, "A data é obrigatória")
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), {
    message: "Data inválida",
  });

/**
 * 🧩 Item
 */
export const earningItemSchema = z.object({
  app: appEnum,
  amount: amountSchema,
});

/**
 * 🚀 CREATE
 */
export const createEarningSchema = z.object({
  date: dateSchema,

  hours: z
    .number({ message: "Horas são obrigatórias" })
    .min(0, "Horas inválidas")
    .max(24, "Máximo de 24 horas"),

  kilometers: z
    .number({ message: "KM são obrigatórios" })
    .min(0, "KM inválidos")
    .max(1000, "Valor muito alto"),

  earnings: z.array(earningItemSchema).min(1, "Adicione pelo menos um ganho"),
});

/**
 * ❌ DELETE
 */
export const deleteEarningSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

/**
 * 🔍 FILTRO
 */
export const getEarningsSchema = z.object({
  month: z.string().regex(/^(0[1-9]|1[0-2])$/, "Mês inválido (01-12)"),
});

/**
 * 🔎 DAY
 */
export const getDayByIdSchema = z.object({
  dayId: z.string().min(1, "ID do dia é obrigatório"),
});

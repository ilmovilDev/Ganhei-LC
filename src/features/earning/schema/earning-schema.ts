import { App } from "@/generated/prisma/enums";
import { z } from "zod";

/**
 * 🔥 FIX: enum compatível com Prisma
 */
export const appEnum = z.nativeEnum(App, {
  message: "Aplicativo inválido",
});

/**
 * 💰 Valor monetário robusto (suporta string de input)
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
 * 📅 Data com transformação real
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
  earnings: z
    .array(earningItemSchema)
    .min(1, "Adicione pelo menos um ganho")
    .max(10, "Máximo de 10 registros por dia"),
});

/**
 * 🔄 UPDATE (mais seguro)
 */
export const updateEarningSchema = z.object({
  id: z.string().min(1, "ID do registro é obrigatório"),
  app: appEnum,
  amount: amountSchema,
});

/**
 * ❌ DELETE
 */
export const deleteEarningSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

/**
 * 🔍 FILTROS
 */
export const getEarningsSchema = z.object({
  month: z.string().regex(/^(0[1-9]|1[0-2])$/, "Mês inválido (01-12)"),
});

/**
 * 🔎 GET DAY
 */
export const getDayByIdSchema = z.object({
  dayId: z.string().min(1, "ID do dia é obrigatório"),
});

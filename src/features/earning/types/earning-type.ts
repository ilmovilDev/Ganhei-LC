import { z } from "zod";
import {
  createEarningSchema,
  deleteEarningSchema,
  earningItemSchema,
  getEarningsSchema,
} from "../schemas/earning-schema";
import { App } from "@/generated/prisma/client";

/**
 * 🧠 BASE RESPONSE (reutilizable)
 */
export type BaseResponse = {
  success: boolean;
  message?: string;
};

/**
 * 🧠 INPUT TYPES (derivados de Zod)
 */
export type CreateEarningInput = z.infer<typeof createEarningSchema>;
export type DeleteEarningInput = z.infer<typeof deleteEarningSchema>;
export type GetEarningsInput = z.infer<typeof getEarningsSchema>;

export type EarningItemInput = z.infer<typeof earningItemSchema>;

/**
 * 📊 DTOs (DATA LAYER → UI)
 * 🔥 IMPORTANTE: sin Decimal (solo number)
 */

export type EarningDTO = {
  id: string;
  app: App;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type DayDTO = {
  id: string;
  date: Date;
  hours: number;
  kilometers: number;
  earnings: EarningDTO[];
  createdAt: Date;
  updatedAt: Date;
};

/**
 * 🚀 RESPONSES (API CONTRACT)
 */

/**
 * CREATE
 */
export type CreateEarningResponse = BaseResponse;

/**
 * UPDATE (granular)
 */
export type UpdateEarningResponse = BaseResponse;

/**
 * DELETE
 */
export type DeleteEarningResponse = BaseResponse;

/**
 * GET LIST
 */
export type GetEarningsResponse = DayDTO[];

/**
 * GET ONE
 */
export type GetDayByIdResponse = DayDTO;

/**
 * 📊 VIEW MODELS (UI layer)
 * 🔥 desacoplado del backend
 */

export type EarningsTableRow = {
  id: string;
  date: string; // formatado
  app: string;
  amount: number;
};

/**
 * 📈 FUTURO (analytics)
 */

export type EarningsSummary = {
  total: number;
  byApp: {
    app: App;
    total: number;
  }[];
};

import { z } from "zod";
import {
  createEarningSchema,
  deleteEarningSchema,
  earningItemSchema,
  getEarningsSchema,
  updateEarningSchema,
} from "../schema/earning-schema";
import { App } from "@/generated/prisma/enums";

/**
 * 🧠 INPUT TYPES
 */

export type CreateEarningInput = z.infer<typeof createEarningSchema>;
export type UpdateEarningInput = z.infer<typeof updateEarningSchema>;
export type DeleteEarningInput = z.infer<typeof deleteEarningSchema>;
export type GetEarningsInput = z.infer<typeof getEarningsSchema>;

export type EarningItemInput = z.infer<typeof earningItemSchema>;

/**
 * 🧾 DOMAIN DTO (backend real)
 */

export type EarningDTO = {
  id: string;
  app: App;
  amount: number;
  createdAt: Date;
};

export type DayDTO = {
  id: string;
  date: Date;
  earnings: EarningDTO[];
};

/**
 * 🎯 VIEW MODEL (UI)
 */

export type EarningsTableRow = {
  id: string;
  date: string;
  app: App; // 🔥 FIX (NO string)
  amount: number;
};

/**
 * 📈 AGGREGATIONS
 */

export type EarningsSummary = {
  total: number;
  byApp: Record<App, number>;
};

/**
 * ⚛️ API RESPONSES
 */

export type EarningsQueryResponse = DayDTO[];

export type MutationResponse = {
  success: boolean;
};

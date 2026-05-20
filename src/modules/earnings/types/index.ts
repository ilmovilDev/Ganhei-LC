import { App } from "@/generated/prisma/enums";
import { DayFormData } from "../schemas/day.schema";
import { Result } from "@/types";

// ─────────────────────────────────────────────
// PRIMITIVOS
// ─────────────────────────────────────────────
export type ClerkId = string;
export type DayId = string;
export type UpsertMode = "create" | "update";

// ─────────────────────────────────────────────
// ENTIDADES BASE
// ─────────────────────────────────────────────
export interface Earning {
  id: string;
  app: App;
  amount: number;
}

export interface Day {
  id: DayId;
  date: string; // "YYYY-MM-DD"
  hours: number;
  kilometers: number;
  clerkId: ClerkId;
  earnings: Earning[];
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
}

// ─────────────────────────────────────────────
// FORM INPUT
// ─────────────────────────────────────────────
export interface DayFormInput {
  id: DayId;
  date: string;
  hours: number;
  kilometers: number;
  earnings: Earning[];
}

// ─────────────────────────────────────────────
// RESUMO MENSAL
// Agregado calculado no servidor — representa o mês completo
// independente de quantos registros foram carregados na tabela.
// ─────────────────────────────────────────────
export interface MonthSummary {
  grossProfit: number; // soma de totalEarnings de todos os dias do mês
  totalExpenses: number; // soma de totalExpenses de todos os dias do mês
  netProfit: number; // soma de netProfit de todos os dias do mês
  totalHours: number; // soma de hours de todos os dias do mês
  totalKm: number; // soma de kilometers de todos os dias do mês
  totalDays: number; // contagem de dias registrados no mês
}

// ─────────────────────────────────────────────
// PAGINAÇÃO + RESUMO
// Shape retornado pelo service e pela action de listagem mensal.
// - days   → registros paginados (primeiros N ou todos)
// - total  → total real de dias no mês (para controlar botão "carregar mais")
// - summary→ agregados do mês completo (para os cards de resumo)
// ─────────────────────────────────────────────
export interface DaysByMonthData {
  days: Day[];
  total: number;
  summary: MonthSummary;
}

// ─────────────────────────────────────────────
// INPUTS — SERVICE & ACTION
// ─────────────────────────────────────────────
export interface ByIdInput {
  id: DayId;
  clerkId: ClerkId;
}

export interface ByMonthInput {
  clerkId: ClerkId;
  month: number; // 1–12
  year: number;
  limit?: number;
}

export interface CreateDayInput {
  clerkId: ClerkId;
  data: DayFormData;
}

export interface UpdateDayInput {
  id: DayId;
  clerkId: ClerkId;
  data: DayFormData;
}

export type DeleteDayInput = ByIdInput;
export type GetDaysByMonthInput = ByMonthInput;

// ─────────────────────────────────────────────
// OUTPUTS — SERVICE
// ─────────────────────────────────────────────
export type CreateDayServiceOutput = Result<{ success: true }>;
export type UpdateDayServiceOutput = Result<{ success: true }>;
export type DeleteDayServiceOutput = Result<{ success: true }>;
export type GetDaysByMonthServiceOutput = Result<DaysByMonthData>;

// ─────────────────────────────────────────────
// OUTPUTS — ACTION
// ─────────────────────────────────────────────
export type CreateDayActionOutput = Result<{ success: true }>;
export type UpdateDayActionOutput = Result<{ success: true }>;
export type DeleteDayActionOutput = Result<{ success: true }>;
export type GetDaysByMonthActionOutput = Result<DaysByMonthData>;

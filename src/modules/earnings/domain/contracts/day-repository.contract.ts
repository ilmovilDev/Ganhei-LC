import {
  CreateDayRepositoryParams,
  DeleteDayRepositoryParams,
  FindDayByIdParams,
  FindManyDaysByMonthParams,
  UpdateDayRepositoryParams,
  UpdateFinancialTotalsRepositoryParams,
} from "../../application/types";
import { PrismaDayPayload } from "../../infrastructure/select/day.select";

export interface DayRepositoryContract {
  findManyByMonth(
    params: FindManyDaysByMonthParams,
  ): Promise<PrismaDayPayload[]>;

  findById(params: FindDayByIdParams): Promise<PrismaDayPayload | null>;
  create(params: CreateDayRepositoryParams): Promise<PrismaDayPayload>;
  update(params: UpdateDayRepositoryParams): Promise<void>;
  delete(params: DeleteDayRepositoryParams): Promise<void>;
  existsByDate(params: { clerkId: string; date: Date }): Promise<boolean>;
  updateFinancialTotals(
    params: UpdateFinancialTotalsRepositoryParams,
  ): Promise<void>;
}

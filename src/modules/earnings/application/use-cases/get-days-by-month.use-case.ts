import { monthRangeUTC } from "@/shared/lib/date/month-range";
import { DayRepositoryContract } from "../../domain/contracts/day-repository.contract";
import { toDayDto } from "../../infrastructure/mappers/day.mapper";
import { DayListItemDto } from "../dtos";
import { queryMonthSchema } from "@/shared/schemas/date";

interface GetDaysByMonthUseCaseRequest {
  clerkId: string;
  month: number;
  year: number;
}

export class GetDaysByMonthUseCase {
  constructor(private readonly repository: DayRepositoryContract) {}

  async execute({
    clerkId,
    month,
    year,
  }: Readonly<GetDaysByMonthUseCaseRequest>): Promise<DayListItemDto[]> {
    // ─────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────
    const validatedQuery = queryMonthSchema.parse({
      month,
      year,
    });

    // ─────────────────────────────────────
    // RANGE
    // ─────────────────────────────────────
    const { from, to } = monthRangeUTC(
      validatedQuery.year,
      validatedQuery.month,
    );

    // ─────────────────────────────────────
    // QUERY
    // ─────────────────────────────────────
    const days = await this.repository.findManyByMonth({
      clerkId,
      from,
      to,
    });

    // ─────────────────────────────────────
    // DTO MAPPING
    // ─────────────────────────────────────
    return days.map(toDayDto);
  }
}

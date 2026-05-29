import { monthRangeUTC } from "@/shared/lib/date/month-range";
import { toDayDto } from "../../infrastructure/mappers/day.mapper";
import { DayRepository } from "../../infrastructure/repositories/day.repository";

interface GetDaysByMonthUseCaseRequest {
  clerkId: string;
  month: number;
  year: number;
}

export class GetDaysByMonthUseCase {
  constructor(private readonly repository: DayRepository) {}

  async execute({ clerkId, month, year }: GetDaysByMonthUseCaseRequest) {
    const { from, to } = monthRangeUTC(year, month);

    const days = await this.repository.findManyByMonth({
      clerkId,
      from,
      to,
    });

    return days.map(toDayDto);
  }
}

import { DayRepository } from "../../infrastructure/repositories/day.repository";
import { GetDaysByMonthInput } from "../../types/inputs.types";
import { DayListItemDto } from "../dtos/day-list-item.dto";
import { toDayListItemDto } from "../mappers/day-list-item.mapper";

export class GetDaysByMonthUseCase {
  private readonly dayRepository = new DayRepository();

  async execute({
    clerkId,
    month,
    year,
  }: GetDaysByMonthInput): Promise<DayListItemDto[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const days = await this.dayRepository.findManyByMonth({
      clerkId,
      startDate,
      endDate,
    });

    return days.map(toDayListItemDto);
  }
}

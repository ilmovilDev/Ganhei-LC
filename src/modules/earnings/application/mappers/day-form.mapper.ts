import { DayFormInput } from "../../schemas/day.schema";
import { DayListItemDto } from "../dtos/day-list-item.dto";

export function toDayFormData(day: DayListItemDto): DayFormInput {
  return {
    date: day.date,
    hours: day.hours,
    kilometers: day.kilometers,
    earnings: day.earnings.map((earning) => ({
      app: earning.app,
      amount: earning.amount,
    })),
  };
}

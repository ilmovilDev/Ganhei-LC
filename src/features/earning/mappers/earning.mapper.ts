import { Day, Earning } from "@/generated/prisma/client";
import { DayDTO } from "../types/earning-type";

type DayWithEarnings = Day & {
  earnings: Earning[];
};

export function toDayDTO(day: DayWithEarnings): DayDTO {
  return {
    id: day.id,
    date: day.date,
    hours: Number(day.hours),
    kilometers: Number(day.kilometers),
    createdAt: day.createdAt,
    updatedAt: day.updatedAt,

    earnings: day.earnings.map((e) => ({
      id: e.id,
      app: e.app,
      amount: Number(e.amount),
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    })),
  };
}

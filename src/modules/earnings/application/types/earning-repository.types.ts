import { App } from "@/generated/prisma/enums";

export interface CreateEarningRepositoryParams {
  dayId: string;
  app: App;
  amount: number;
}

export interface DeleteEarningRepositoryParams {
  dayId: string;
}

export interface FindEarningRepositoryParams {
  dayId: string;
}

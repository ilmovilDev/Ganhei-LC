import { App } from "@/generated/prisma/enums";

export interface EarningItemDto {
  id: string;
  app: App;
  amount: number;
}

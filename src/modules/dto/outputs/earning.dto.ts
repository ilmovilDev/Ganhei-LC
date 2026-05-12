import type { App } from "@/generated/prisma/enums";

export type EarningDTO = {
  id: string;
  app: App;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

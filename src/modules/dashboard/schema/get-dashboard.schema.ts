import { z } from "zod";

export const getDashboardSchema = z.object({
  userId: z.string().min(1),
  month: z.string().regex(/^(0[1-9]|1[0-2])$/, {
    message: "Mês inválido",
  }),
});

export type GetDashboardInput = z.infer<typeof getDashboardSchema>;

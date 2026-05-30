import { cuidSchema } from "@/shared/schemas/common/cuid.schema";
import { z } from "zod";

export const deleteDaySchema = z.object({
  id: cuidSchema,
});

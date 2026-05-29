import { z } from "zod";
import { idSchema } from "./primitives";

export const deleteDaySchema = z.object({
  id: idSchema,
});

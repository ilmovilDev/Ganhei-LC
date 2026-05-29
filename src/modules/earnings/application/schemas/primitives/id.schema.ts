import { z } from "zod";

export const idSchema = z.cuid({
  message: "ID inválido.",
});

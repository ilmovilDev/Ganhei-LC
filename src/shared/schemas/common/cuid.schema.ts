import { z } from "zod";

export const cuidSchema = z.cuid({
  message: "ID inválido.",
});

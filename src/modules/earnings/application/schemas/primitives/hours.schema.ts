import { z } from "zod";

export const hoursSchema = z
  .number({
    message: "As horas devem ser um número.",
  })
  .int({
    message: "As horas devem ser um número inteiro.",
  })
  .min(1, {
    message: "Mínimo de 1 hora.",
  })
  .max(24, {
    message: "Máximo de 24 horas.",
  });

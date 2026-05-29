import { z } from "zod";
import { isTwoDecimalNumber } from "@/lib/utils/is-two-decimal-number";

export const kilometersSchema = z
  .number({
    message: "Os quilômetros devem ser um número.",
  })
  .positive({
    message: "Os quilômetros devem ser maior que zero.",
  })
  .max(999.99, {
    message: "Os quilômetros parecem ser excessivos.",
  })
  .refine(isTwoDecimalNumber, {
    message: "Os quilômetros não podem ter mais de 2 casas decimais.",
  });

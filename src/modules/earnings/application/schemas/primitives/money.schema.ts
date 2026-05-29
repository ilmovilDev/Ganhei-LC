import { z } from "zod";
import { isTwoDecimalNumber } from "@/lib/utils/is-two-decimal-number";

export const moneySchema = z
  .number({
    message: "O valor deve ser um número.",
  })
  .positive({
    message: "O valor deve ser maior que zero.",
  })
  .max(9999.99, {
    message: "O valor informado é muito alto.",
  })
  .refine(isTwoDecimalNumber, {
    message: "O valor não pode ter mais de 2 casas decimais.",
  });

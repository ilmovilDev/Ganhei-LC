import { z } from "zod";

const appSchema = z.object({
  name: z.string().min(1, "Selecione o aplicativo"),

  amount: z
    .number({
      message: "Informe o valor",
    })
    .min(0.01, "Valor mínimo é R$ 0,01")
    .max(10000, "Valor máximo é R$ 10.000"),
});

export const daySchema = z
  .object({
    date: z
      .date({
        message: "Selecione uma data",
      })
      .refine((date) => date <= new Date(), {
        message: "Não é permitido datas futuras",
      }),

    hours: z.number().min(1, "Mínimo 1 hora").max(24, "Máximo 24 horas"),

    kilometers: z
      .number({
        message: "Informe os quilômetros",
      })
      .min(0, "Não pode ser negativo")
      .max(1000, "Máximo 1000 km"),

    apps: z.array(appSchema).min(1, "Adicione pelo menos um aplicativo"),
  })
  .superRefine((data, ctx) => {
    // ❌ duplicados
    const names = data.apps.map((a) => a.name);
    if (new Set(names).size !== names.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Não é permitido repetir aplicativos",
        path: ["apps"],
      });
    }
  });

// ---------------------------------------------

export type DayFormData = z.input<typeof daySchema>;

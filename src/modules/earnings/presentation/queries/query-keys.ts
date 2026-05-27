export const earningsKeys = {
  /** Raiz — invalida TUDO do módulo earnings */
  all: ["earnings"] as const,

  /** Família de queries de "days" */
  days: () => [...earningsKeys.all, "days"] as const,

  /** Lista de dias filtrada por mês/ano */
  daysByMonth: (year: number, month: number) =>
    [...earningsKeys.days(), { year, month }] as const,

  /** Um dia específico por id */
  day: (id: string) => [...earningsKeys.days(), id] as const,
} as const;

export type EarningsKeys = typeof earningsKeys;

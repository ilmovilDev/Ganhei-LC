export const earningKeys = {
  all: ["earnings"] as const,

  list: (month: string) => [...earningKeys.all, "list", month] as const,

  detail: (dayId: string) => [...earningKeys.all, "detail", dayId] as const,
};

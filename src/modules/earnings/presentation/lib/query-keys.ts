export const earningsKeys = {
  all: ["earnings"] as const,

  lists: () => [...earningsKeys.all, "list"] as const,

  list: (month: number, year: number) =>
    [...earningsKeys.lists(), month, year] as const,
};

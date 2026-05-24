export const daySelect = {
  id: true,
  clerkId: true,
  date: true,
  hours: true,
  kilometers: true,
  totalEarnings: true,
  totalExpenses: true,
  netProfit: true,
  createdAt: true,
  updatedAt: true,
  earnings: {
    select: {
      id: true,
      app: true,
      amount: true,
    },
  },
} as const;

export type Plan = "monthly" | "quarterly";

export const priceMap: Record<Plan, string> = {
  monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
  quarterly: process.env.STRIPE_PREMIUM_QUARTERLY_PRICE_ID!,
};

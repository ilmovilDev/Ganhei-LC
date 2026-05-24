import { App } from "@/generated/prisma/enums";

type AppConfig = {
  value: App;
  label: string;
};

export const Apps = [
  { value: App.UBER, label: "Uber" },
  { value: App.NINETY_NINE, label: "99" },
  { value: App.INDRIVE, label: "inDrive" },
  { value: App.IFOOD, label: "iFood" },
  { value: App.NINETY_NINE_FOOD, label: "99Food" },
  { value: App.SHOPEE, label: "Shopee" },
  { value: App.GENERIC_DELIVERY, label: "Entrega" },
  { value: App.OTHER, label: "Outro" },
] as const satisfies ReadonlyArray<AppConfig>;

// Derivado de Apps — single source of truth
export const APP_LABELS: Record<App, string> = Object.fromEntries(
  Apps.map(({ value, label }) => [value, label]),
) as Record<App, string>;

export type AppOption = (typeof Apps)[number];

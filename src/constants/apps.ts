import { App } from "@/generated/prisma/enums";

export interface AppOption {
  value: App;
  label: string;
}

export const Apps: readonly AppOption[] = [
  {
    value: App.UBER,
    label: "Uber",
  },
  {
    value: App.INDRIVER,
    label: "InDriver",
  },
  {
    value: App.NINE_NINE,
    label: "99",
  },
  {
    value: App.NINE_NINE_FOOD,
    label: "99 Food",
  },
  {
    value: App.IFOOD,
    label: "iFood",
  },
  {
    value: App.DELIVERY,
    label: "Delivery",
  },
  {
    value: App.SHOPEE,
    label: "Shopee",
  },
  {
    value: App.OTHER,
    label: "Outro",
  },
] as const;

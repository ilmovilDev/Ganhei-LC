import { App } from "@/generated/prisma/client";
import { Car, Bike, Package, Store, MoreHorizontal } from "lucide-react";
import { LucideIcon } from "lucide-react";

// ---------------------------------------------

type AppConfig = {
  value: App;
  label: string;
  icon: LucideIcon;
};

// ---------------------------------------------

export const Apps = [
  {
    value: "UBER",
    label: "Uber",
    icon: Car,
  },
  {
    value: "NINETY_NINE",
    label: "99",
    icon: Car,
  },
  {
    value: "INDRIVE",
    label: "inDrive",
    icon: Car,
  },

  // FOOD DELIVERY
  {
    value: "IFOOD",
    label: "iFood",
    icon: Bike,
  },
  {
    value: "NINETY_NINE_FOOD",
    label: "99 Food",
    icon: Bike,
  },

  // GENERIC DELIVERY
  {
    value: "GENERIC_DELIVERY",
    label: "Entrega",
    icon: Package,
  },

  // MARKETPLACE
  {
    value: "SHOPEE",
    label: "Shopee",
    icon: Store,
  },

  // FALLBACK
  {
    value: "OTHER",
    label: "Outro",
    icon: MoreHorizontal,
  },
] as const satisfies ReadonlyArray<AppConfig>;

// ---------------------------------------------

export type AppOption = (typeof Apps)[number];

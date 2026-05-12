import {
  CreditCard,
  Crown,
  Gem,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react";

export interface RouteConfig {
  label: string;
  path: string;
  icon: LucideIcon;
  showInNav?: boolean;
}

export const routesConfig: RouteConfig[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    showInNav: true,
  },
  {
    label: "Receitas",
    path: "/earnings",
    icon: Gem,
    showInNav: true,
  },
  {
    label: "Despesas",
    path: "/expenses",
    icon: CreditCard,
    showInNav: true,
  },
  {
    label: "Assinaturas",
    path: "/subscriptions",
    icon: Crown,
    showInNav: true,
  },
];

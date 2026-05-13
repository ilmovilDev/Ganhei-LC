import {
  CreditCard,
  Crown,
  Gem,
  LayoutDashboard,
  LucideIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export interface RouteConfig {
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
  showInNav?: boolean;
}

export const routesConfig: RouteConfig[] = [
  {
    label: "Dashboard",
    description: "Visão geral dos seus ganhos e despesas",
    path: "/dashboard",
    icon: LayoutDashboard,
    showInNav: true,
  },
  {
    label: "Receitas",
    description: "Controle seus ganhos nos aplicativos",
    path: "/earnings",
    icon: TrendingUp,
    showInNav: true,
  },
  {
    label: "Despesas",
    description: "Controle seus gastos e otimize seus lucros",
    path: "/expenses",
    icon: TrendingDown,
    showInNav: true,
  },
];

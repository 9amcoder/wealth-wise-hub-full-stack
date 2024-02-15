import { Boxes, Home, LayoutDashboard, UserCog } from "lucide-react";

export const ROUTES = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Transactions",
      icon: Boxes,
      href: "/transaction",
      color: "text-violet-500",
    },
    {
      label: "Analytics",
      icon: LayoutDashboard,
      href: "/analytic",
      color: "text-pink-700",
    },
    {
      label: "Accounts",
      icon: UserCog,
      href: "/account",
      color: "text-orange-700",
    },
  ];
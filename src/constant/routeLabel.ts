import { Boxes, Home, LayoutDashboard, UserCog, ImageDown } from "lucide-react";

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
    label: "Upload Receipts",
    icon: ImageDown,
    href: "/uploadreceipt",
    color: "text-orange-500",
  },
  {
    label: "Analytics",
    icon: LayoutDashboard,
    href: "/analytic",
    color: "text-green-700",
  },
  {
    label: "Accounts",
    icon: UserCog,
    href: "/account",
    color: "text-orange-700",
  },
];

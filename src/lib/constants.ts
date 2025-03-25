import {
  BarChart3,
  Building2,
  CircleUserRound,
  HelpCircle,
  Home,
  Lock,
  Settings,
  Users,
} from "lucide-react";
import { MenuItem } from "./types";

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "Home",
    allowedRoles: ["admin", "manager", "user"],
  },
  {
    title: "Users",
    path: "/users",
    icon: "Users",
    allowedRoles: ["admin", "manager"],
  },
  {
    title: "Dispensaries",
    path: "/dispensaries",
    icon: "Building2",
    allowedRoles: ["admin", "manager"],
  },
  {
    title: "Service Requests",
    path: "/service-requests",
    icon: "BarChart3",
    allowedRoles: ["admin", "manager"],
  },
  // {
  //   title: "Settings",
  //   path: "/settings",
  //   icon: "Settings",
  //   allowedRoles: ["admin"],
  // },
];

export const LOCAL_STORAGE_KEYS = {
  USERS: 'myersAdmin_users',
  DISPENSARIES: 'myersAdmin_dispensaries',
  SERVICE_REQUESTS: 'myersAdmin_serviceRequests',
  AUTH: 'myersAdmin_auth',
  INVOICES: 'myersAdmin_invoices',
  PAYMENTS: 'myersAdmin_payments', 
  SERVICE_AGREEMENTS: 'myersAdmin_serviceAgreements'
};

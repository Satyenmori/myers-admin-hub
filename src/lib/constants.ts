
import { MenuItem } from "./types";

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "layout-dashboard",
    allowedRoles: ["admin", "manager", "user"],
  },
  {
    title: "Users",
    path: "/users",
    icon: "users",
    allowedRoles: ["admin", "manager"],
  },
  {
    title: "Dispensaries",
    path: "/dispensaries",
    icon: "building-store",
    allowedRoles: ["admin", "manager", "user"],
  },
  {
    title: "Service Requests",
    path: "/service-requests",
    icon: "clipboard-list",
    allowedRoles: ["admin", "manager", "user"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: "settings",
    allowedRoles: ["admin"],
  },
];

export const LOCAL_STORAGE_KEYS = {
  AUTH: "myers-admin-auth",
  USERS: "myers-admin-users",
  DISPENSARIES: "myers-admin-dispensaries",
  THEME: "myers-admin-theme",
};

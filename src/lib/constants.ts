export const MENU_ITEMS = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    allowedRoles: ["admin", "manager", "user"],
  },
  {
    title: "Users",
    path: "#",
    icon: "Users",
    allowedRoles: ["admin", "manager"],
    submenu: [
      {
        title: "Manage Admin Users",
        path: "/users",
        icon: "ShieldCheck",
        allowedRoles: ["admin", "manager"],
      },
      {
        title: "Manage Support Engineers",
        path: "/manage-support-engineers",
        icon: "Wrench",
        allowedRoles: ["admin", "manager"],
      }
    ]
  },
  {
    title: "Dispensaries",
    path: "/dispensaries",
    icon: "Store",
    allowedRoles: ["admin", "manager", "user"],
  },
  {
    title: "Service Requests",
    path: "/service-requests",
    icon: "TicketCheck",
    allowedRoles: ["admin", "manager", "user"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: "Settings",
    allowedRoles: ["admin"],
  },
];

export const ROLES = ["admin", "manager", "user"] as const;
export const STATUSES = ["active", "inactive"] as const;

export const LOCAL_STORAGE_KEYS = {
  USERS: "myers-security:users",
  DISPENSARIES: "myers-security:dispensaries",
  SERVICE_REQUESTS: "myers-security:service-requests",
  AUTH: "myers-security:auth",
  INVOICES: "myers-security:invoices",
  PAYMENTS: "myers-security:payments",
  SERVICE_AGREEMENTS: "myers-security:service-agreements",
  THEME: "myers-security:theme",
};

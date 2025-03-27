
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X, ChevronDown, User, Users, Building, ClipboardList, BarChart, CreditCard, FileText, UserCog, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles?: string[];
  submenu?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const toggleSubmenu = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Check if a path is active or one of its children is active
  const isPathActive = (path: string) => {
    // Exact match
    if (location.pathname === path) return true;
    
    // Or, if the path is a prefix (for submenu items)
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    
    return false;
  };

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      id: "users-management",
      label: "User Management",
      path: "#",
      icon: <Users className="h-5 w-5" />,
      allowedRoles: ["admin", "manager"],
      submenu: [
        {
          id: "view-users",
          label: "View Users",
          path: "/users",
          icon: <User className="h-4 w-4" />,
        },
        {
          id: "support-engineers",
          label: "Support Engineers",
          path: "/manage-support-engineers",
          icon: <UserCog className="h-4 w-4" />,
        },
      ],
    },
    {
      id: "dispensaries",
      label: "Dispensaries",
      path: "/dispensaries",
      icon: <Building className="h-5 w-5" />,
    },
    {
      id: "service-requests",
      label: "Service Requests",
      path: "/service-requests",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      id: "financial",
      label: "Financial Records",
      path: "#",
      icon: <CreditCard className="h-5 w-5" />,
      allowedRoles: ["admin", "manager"],
      submenu: [
        {
          id: "invoices",
          label: "Invoices",
          path: "/invoices",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          id: "payments",
          label: "Payments",
          path: "/payments",
          icon: <CreditCard className="h-4 w-4" />,
        },
      ],
    },
    {
      id: "knowledge-base",
      label: "Knowledge Base",
      path: "/knowledge-base",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(user?.role || "");
  });

  return (
    <>
      {/* Sidebar for medium and larger screens */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gray-100 shadow-lg transition-transform duration-300 dark:bg-gray-800 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b px-4 md:hidden">
          <span className="text-xl font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="h-full overflow-y-auto pb-32 pt-5">
          <nav className="mt-5 px-3">
            <div className="space-y-1">
              {filteredMenuItems.map((item) => (
                <div key={item.id}>
                  {item.submenu ? (
                    // Menu with submenu
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.id)}
                        className={cn(
                          "group flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                          isPathActive(item.path) || openMenus[item.id]
                            ? "bg-muted text-foreground"
                            : "hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 text-muted-foreground">
                            {item.icon}
                          </span>
                          {item.label}
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openMenus[item.id] ? "rotate-180" : ""
                          )}
                        />
                      </button>
                      {/* Submenu */}
                      {openMenus[item.id] && (
                        <div className="mt-1 space-y-1 pl-10">
                          {item.submenu.map((subItem) => (
                            <NavLink
                              key={subItem.id}
                              to={subItem.path}
                              className={({ isActive }) =>
                                cn(
                                  "group flex items-center rounded-md p-2 text-sm transition-colors",
                                  isActive
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted hover:text-foreground"
                                )
                              }
                              onClick={onClose}
                            >
                              <span className="mr-3 text-current opacity-70">
                                {subItem.icon}
                              </span>
                              {subItem.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Regular menu item
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted hover:text-foreground"
                        )
                      }
                      onClick={onClose}
                    >
                      <span className="mr-3 text-muted-foreground">
                        {item.icon}
                      </span>
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

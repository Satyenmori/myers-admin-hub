
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MENU_ITEMS } from "@/lib/constants";
import { ChevronDown, ChevronRight, CircleUserRound, Lock, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import logo from "../../images/myerslogo.webp"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isAuthorized } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  const LucideIcon = ({ name }: { name: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.CircleHelp;
    return <Icon className="h-5 w-5" />;
  };

  const filteredMenuItems = MENU_ITEMS.filter(item => 
    isAuthorized(item.allowedRoles)
  );

  const toggleSubmenu = (path: string) => {
    if (expandedMenus.includes(path)) {
      setExpandedMenus(expandedMenus.filter(item => item !== path));
    } else {
      setExpandedMenus([...expandedMenus, path]);
    }
  };

  const isSubmenuOpen = (path: string) => expandedMenus.includes(path);

  const isSubmenu = (item: any) => item.submenu && item.submenu.length > 0;

  const isSubmenuActive = (item: any) => {
    if (!isSubmenu(item)) return false;
    return item.submenu.some((subItem: any) => location.pathname === subItem.path);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="relative">
            <img src={logo} alt="User Avatar" className="h-8 w-16 text-myers-blue" />
            </div>
            <div className="flex flex-col">
              <span className="font-poppins font-semibold text-sidebar-foreground">
                Myers Security
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                Admin Panel
              </span>
            </div>
          </Link>
          
          <button
            onClick={onClose}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
        
        <div className="px-4 py-4">
          {/* <div className="flex items-center gap-3 mb-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              <LucideIcons.User className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-medium text-sidebar-foreground">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role || "Role"}
              </span>
            </div>
          </div> */}
          
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const hasSubmenuActive = isSubmenuActive(item);
              
              if (isSubmenu(item)) {
                return (
                  <div key={item.title} className="mb-1">
                    <button
                      onClick={() => toggleSubmenu(item.path)}
                      className={`nav-link ${hasSubmenuActive ? "active" : ""} w-full flex justify-between items-center`}
                    >
                      <div className="flex items-center">
                        <LucideIcon name={item.icon} />
                        <span className="ml-3">{item.title}</span>
                      </div>
                      {isSubmenuOpen(item.path) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isSubmenuOpen(item.path) && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                        {item.submenu.filter((subItem: any) => isAuthorized(subItem.allowedRoles)).map((subItem: any) => {
                          const isSubActive = location.pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`nav-link ${isSubActive ? "active" : ""} py-2`}
                            >
                              <LucideIcon name={subItem.icon} />
                              <span>{subItem.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <LucideIcon name={item.icon} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="mt-auto p-4 border-t border-sidebar-border">
          {/* <div className="rounded-lg bg-sidebar-accent/50 p-4">
            <h4 className="text-sm font-medium text-sidebar-foreground mb-2">
              Need Help?
            </h4>
            <p className="text-xs text-sidebar-foreground/70 mb-3">
              Check our documentation.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-xs text-sidebar-primary hover:underline"
            >
              <LucideIcons.HelpCircle className="h-3 w-3 mr-1" />
              View Documentation
            </a>
          </div> */}
          <div className="flex items-center gap-3 mb-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              <LucideIcons.User className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-medium text-sidebar-foreground">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role || "Role"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { 
  Bell, 
  LogOut, 
  Menu, 
  Moon, 
  Search, 
  Settings, 
  Sun, 
  User,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    
    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 flex items-center px-4 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
        
        {/* <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-full bg-muted/30 pl-10 pr-4 py-2 text-sm outline-none focus:bg-muted/50 transition-colors"
          />
        </div> */}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-accent hover:text-accent-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
        
        <button 
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {mode === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-accent cursor-pointer"> 
                {/* bg-accent/50 add in above div so add round in back avtar*/}
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {/* <span className="text-sm font-medium hidden sm:inline-block">
                {user?.name || "User"}
              </span> */}
              {/* <ChevronDown className="h-4 w-4 opacity-70" /> */}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-3">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="font-medium">{user?.name || "User"}</h4>
                <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                  {user?.role || "User"}
                </span>
              </div>
            </div>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem className="cursor-pointer flex items-center p-2 rounded-md hover:bg-accent">
              <User className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center p-2 rounded-md hover:bg-accent">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem 
              className="cursor-pointer flex items-center p-2 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive" 
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

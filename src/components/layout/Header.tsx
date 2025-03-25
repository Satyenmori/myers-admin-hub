
import React from "react";
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
  User 
} from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30 flex items-center px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
        
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-full bg-muted/30 pl-10 pr-4 py-2 text-sm outline-none focus:bg-muted/50 transition-colors"
          />
        </div>
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

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/50 p-1 pl-1 pr-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium hidden sm:inline-block">
              {user?.name || "User"}
            </span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

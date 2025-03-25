
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User } from "../lib/types";
import useLocalStorage from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../lib/constants";
import { generateInitialUsers } from "../lib/data";
import { toast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useLocalStorage<AuthState>(LOCAL_STORAGE_KEYS.AUTH, {
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const [users, setUsers] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, generateInitialUsers());

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setAuthState(prev => ({ ...prev, loading: false }));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For now, just check if email exists in our users array
    const user = users.find(u => u.email === email && u.status === "active");

    if (user) {
      // Simple auth for demo - in real app would check password hash
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      return true;
    }

    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const isAuthorized = (allowedRoles: string[]): boolean => {
    if (!authState.isAuthenticated || !authState.user) return false;
    return allowedRoles.includes(authState.user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

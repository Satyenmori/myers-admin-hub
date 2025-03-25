
import React, { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../lib/constants";
import { ThemeState } from "../lib/types";

interface ThemeContextType extends ThemeState {
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<ThemeState>(LOCAL_STORAGE_KEYS.THEME, {
    mode: "light",
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme.mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme.mode]);

  const toggleTheme = () => {
    setTheme(prev => ({
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        ...theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

import {
    COLORS,
    getAppTheme,
    setAppTheme,
    ThemeMode,
} from "@/constants/colors";
import { createContext, ReactNode, useContext, useState } from "react";
  
  const ThemeContext = createContext({
    mode: "light" as ThemeMode,
    colors: COLORS,
    toggleTheme: () => {},
    isDark: false,
  });
  
  export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>(getAppTheme());
  
    const isDark = mode === "dark";
  
    function toggleTheme() {
      const nextTheme = mode === "light" ? "dark" : "light";
  
      setAppTheme(nextTheme);
      setMode(nextTheme);
    }
  
    return (
      <ThemeContext.Provider
        value={{
          mode,
          colors: COLORS,
          toggleTheme,
          isDark,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }
  
  export function useAppTheme() {
    return useContext(ThemeContext);
  }
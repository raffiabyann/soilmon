import { useContext, type ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeContext, type ThemeContextValue } from "@/app/ThemeContext";

/** Provides theme state to the application (SPEC §17). */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useTheme();
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Access the current theme context. */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

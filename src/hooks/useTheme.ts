import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  getInitialTheme,
  getStoredTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/theme/theme";

interface UseThemeResult {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Theme state hook (SPEC §17).
 *
 * - CSS custom properties remain the source of truth for actual colors.
 * - Persists the preference to localStorage.
 * - Respects system preference on first visit when nothing is stored.
 */
export function useTheme(): UseThemeResult {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  // Keep the document root in sync with the current theme.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (e.g. private mode); in-memory state still works.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // Follow system changes only while the user has no explicit stored preference.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme() === null) {
        setThemeState(event.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return { theme, toggleTheme, setTheme };
}

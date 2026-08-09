/**
 * Theme system types + constants (SPEC §17, §32.16, §32.17).
 *
 * Theme switching changes design-token VALUES only. Layout and information
 * hierarchy never change with the theme. The sidebar's forest green and the
 * semantic status colors remain constant across themes.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "soilmon-theme";

/** Applies the theme to the document root via the data-theme attribute. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

/** Reads a previously stored theme preference, if any. */
export function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

/** Resolves the initial theme: stored preference, else system preference. */
export function getInitialTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

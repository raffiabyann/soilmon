import { useThemeContext } from "@/app/ThemeProvider";
import { icons } from "@/lib/icons";

/**
 * Compact sun/moon theme toggle (SPEC §32.6).
 * Right-most control in the header. Single icon button, no dropdown.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";
  const Icon = isDark ? icons.themeLight : icons.themeDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-inner border border-border text-muted transition-colors duration-150 ease-out hover:border-border/80 hover:bg-border/20 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
    </button>
  );
}

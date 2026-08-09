/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic design tokens -> CSS custom properties (see src/theme/tokens.css).
        // Values change per theme; layout/hierarchy do not (SPEC §17, §32.16, §32.17).
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        sidebar: "rgb(var(--color-sidebar) / <alpha-value>)",
        "sidebar-text": "rgb(var(--color-sidebar-text) / <alpha-value>)",
        // Status semantics remain constant across themes (SPEC §17).
        "status-ok": "rgb(var(--color-status-ok) / <alpha-value>)",
        "status-warn": "rgb(var(--color-status-warn) / <alpha-value>)",
        "status-error": "rgb(var(--color-status-error) / <alpha-value>)",
        "status-info": "rgb(var(--color-status-info) / <alpha-value>)",
        "status-purple": "rgb(var(--color-purple) / <alpha-value>)",
      },
      borderRadius: {
        card: "12px",
        inner: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

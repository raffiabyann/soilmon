/**
 * Shared navigation configuration.
 *
 * Single source of truth for the sidebar nav items used by both
 * Sidebar (desktop) and MobileNav (mobile drawer).
 * Update here to change labels, routes, or ordering across both components.
 */
import { icons, type LucideIcon } from "@/lib/icons";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  to: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",    icon: icons.dashboard, to: "/"             },
  { label: "Data History", icon: icons.lineChart,  to: "/data-history" },
  { label: "Alerts",       icon: icons.bell,       to: "/alerts"       },
  { label: "Reports",      icon: icons.reports,    to: "/reports"      },
  { label: "Settings",     icon: icons.settings,   to: "/settings"     },
];

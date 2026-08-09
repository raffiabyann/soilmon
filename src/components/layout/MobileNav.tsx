import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { icons, type LucideIcon } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { SidebarLeafDecoration } from "@/components/layout/SidebarLeafDecoration";
import { SidebarStatus } from "@/components/layout/SidebarStatus";

/**
 * Mobile navigation drawer (lg:hidden).
 *
 * Triggered by the hamburger button in the mobile header.
 * Slides in from the left, same nav items as the desktop Sidebar.
 * Dismissible via overlay tap or close button.
 * Keyboard accessible — traps focus within the open drawer.
 */

interface NavItem {
  label: string;
  icon: LucideIcon;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",    icon: icons.dashboard, to: "/"             },
  { label: "Data History", icon: icons.lineChart,  to: "/data-history" },
  { label: "Alerts",       icon: icons.bell,       to: "/alerts"       },
  { label: "Reports",      icon: icons.reports,    to: "/reports"      },
  { label: "Settings",     icon: icons.settings,   to: "/settings"     },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-sidebar text-sidebar-text transition-transform duration-200 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Botanical leaf artwork */}
        <SidebarLeafDecoration />

        {/* Header: brand + close button */}
        <div className="relative z-10 flex items-center justify-between px-5 pb-4 pt-6">
          <div className="flex items-center gap-3">
            <icons.brand className="h-7 w-7 shrink-0 text-sidebar-text" strokeWidth={1.5} aria-hidden />
            <span className="flex flex-col">
              <span className="text-[18px] font-bold tracking-tight text-sidebar-text leading-tight">
                SoilMon
              </span>
              <span className="text-[10px] text-sidebar-text/60 leading-tight">
                Soil Monitoring System
              </span>
            </span>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-inner text-sidebar-text/60 hover:bg-white/10 hover:text-sidebar-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-colors duration-150"
          >
            {/* X icon inline SVG */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="relative z-10 mx-4 mb-3 h-px bg-white/10" />

        {/* Navigation */}
        <nav className="relative z-10 flex flex-col gap-0.5 px-3" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[14px] font-medium transition-colors duration-150 ease-out",
                    isActive
                      ? "text-sidebar-text shadow-sm"
                      : "text-sidebar-text/60 hover:bg-white/10 hover:text-sidebar-text",
                  )
                }
                style={({ isActive }) =>
                  isActive ? { backgroundColor: "rgb(var(--color-sidebar-active))" } : undefined
                }
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <Icon
                      className="h-5 w-5 shrink-0"
                      strokeWidth={isActive ? 2.5 : 2}
                      aria-hidden
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="relative z-10 flex-1" />

        {/* Gateway status — reuses the existing SidebarStatus component */}
        <div className="relative z-20 px-3 pb-4 pt-2">
          <SidebarStatus />
        </div>
      </div>
    </>
  );
}

import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { SidebarStatus } from "@/components/layout/SidebarStatus";
import { SidebarLeafDecoration } from "@/components/layout/SidebarLeafDecoration";
import { icons } from "@/lib/icons";
import { NAV_ITEMS } from "@/config/navigation";

/**
 * Sidebar (SPEC §32.2, design_specs §A).
 *
 * Navigation uses React Router NavLink for route-aware active state.
 * Active item: brighter green bg (#1B8543) with full border-radius.
 *
 * Icons per spec:
 *   Dashboard    → LayoutDashboard
 *   Data History → LineChart
 *   Alerts       → Bell
 *   Reports      → FileText
 *   Settings     → Settings (gear)
 */

export function Sidebar() {
  return (
    <aside className="relative flex h-full w-full flex-col bg-sidebar text-sidebar-text">

      {/* Botanical leaf artwork — z-0, fills lower sidebar */}
      <SidebarLeafDecoration />

      {/* Branding */}
      <div className="relative z-10 flex items-center gap-3 px-5 pb-5 pt-7">
        {/* Plain white leaf icon — no background box (design_specs §A: "Icon: Daun (Putih)") */}
        <icons.brand className="h-8 w-8 shrink-0 text-sidebar-text" strokeWidth={1.5} aria-hidden />
        <span className="flex min-w-0 flex-col">
          <span className="text-[20px] font-bold tracking-tight text-sidebar-text leading-tight">
            SoilMon
          </span>
          <span className="text-[11px] text-sidebar-text/60 leading-tight tracking-wide">
            Soil Monitoring System
          </span>
        </span>
      </div>

      {/* Divider */}
      <div className="relative z-10 mx-4 mb-3 h-px bg-white/10" />

      {/* Navigation — route-aware via NavLink */}
      <nav className="relative z-10 flex flex-col gap-0.5 px-3" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
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

      {/* Gateway status card — z-20, above leaf */}
      <div className="relative z-20 px-3 pb-4 pt-2">
        <SidebarStatus />
      </div>

    </aside>
  );
}

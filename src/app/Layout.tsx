import { useState, useCallback, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PageBackground } from "@/components/layout/PageBackground";
import { MobileNav } from "@/components/layout/MobileNav";

/**
 * Application shell.
 *
 * Desktop (≥1024px): fixed 240px sidebar + fluid main column.
 * Mobile (<1024px):  no sidebar — replaced by hamburger/drawer via MobileNav.
 *
 * overflow-x-hidden on the root prevents any mobile horizontal overflow.
 */

function FooterLeafWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 right-0 z-0 overflow-hidden"
      style={{ width: 320, height: 400, opacity: 0.04 }}
    >
      <svg
        width="320"
        height="400"
        viewBox="0 0 248 320"
        preserveAspectRatio="xMaxYMax meet"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
      >
        <path d="M124 10 C56 55 50 165 124 306 C198 165 192 55 124 10 Z" strokeWidth="2" />
        <path d="M124 22 L124 295" strokeWidth="1.5" />
        <path d="M124 62 C98 72 78 90 64 112" strokeWidth="1.2" />
        <path d="M124 62 C150 72 170 90 184 112" strokeWidth="1.2" />
        <path d="M124 112 C100 122 82 140 70 162" strokeWidth="1.1" />
        <path d="M124 112 C148 122 166 140 178 162" strokeWidth="1.1" />
        <path d="M124 166 C104 175 88 192 78 214" strokeWidth="1.0" />
        <path d="M124 166 C144 175 160 192 170 214" strokeWidth="1.0" />
        <path d="M124 220 C108 228 96 243 88 262" strokeWidth="0.9" />
        <path d="M124 220 C140 228 152 243 160 262" strokeWidth="0.9" />
      </svg>
    </div>
  );
}

export function Layout({ children }: { children?: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="relative min-h-full overflow-x-hidden bg-bg text-text">
      <PageBackground />
      <FooterLeafWatermark />

      {/* Mobile drawer — only rendered below lg breakpoint */}
      <MobileNav open={drawerOpen} onClose={closeDrawer} />

      {/* Fixed full-height sidebar (desktop only) */}
      <div className="fixed inset-y-0 left-0 z-20 hidden w-[var(--sidebar-width)] lg:block">
        <Sidebar />
      </div>

      {/* Main column */}
      <div className="relative z-10 lg:pl-[var(--sidebar-width)]">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-5 lg:px-8">
          <Header onMenuOpen={openDrawer} />
          <main className="py-4 sm:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

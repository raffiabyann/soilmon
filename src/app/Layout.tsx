import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PageBackground } from "@/components/layout/PageBackground";

/**
 * Application shell (SPEC §32.1, §32.2, §32.3, §32.18).
 *
 * Two regions: a full-height fixed forest-green sidebar and a fluid
 * main column with the header and dashboard content.
 *
 * Sidebar width and main-column offset both derive from --sidebar-width
 * in tokens.css (240px) — single source of truth.
 *
 * FooterLeaf: faint botanical leaf watermark at lower-right of page per
 * design_specs §G ("ornamen daun air samar di area latar belakang kanan layar").
 */

/** Faint leaf watermark — lower-right of page, behind all content (SPEC §32.12, design_specs §G). */
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
        {/* Primary leaf outline */}
        <path d="M124 10 C56 55 50 165 124 306 C198 165 192 55 124 10 Z" strokeWidth="2" />
        {/* Central vein */}
        <path d="M124 22 L124 295" strokeWidth="1.5" />
        {/* Lateral veins */}
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
  return (
    <div className="relative min-h-full bg-bg text-text">
      {/* Subtle topographic background decoration (SPEC §32.12) */}
      <PageBackground />

      {/* Footer-area right-side leaf watermark (design_specs §G) */}
      <FooterLeafWatermark />

      {/* Fixed full-height sidebar (desktop) — width from --sidebar-width token */}
      <div className="fixed inset-y-0 left-0 z-20 hidden w-[var(--sidebar-width)] lg:block">
        <Sidebar />
      </div>

      {/* Main column, offset by sidebar width on desktop */}
      <div className="relative z-10 lg:pl-[var(--sidebar-width)]">
        <div className="mx-auto w-full max-w-[1600px] px-5 lg:px-8">
          <Header />
          <main className="py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

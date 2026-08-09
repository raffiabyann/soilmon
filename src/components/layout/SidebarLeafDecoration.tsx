/**
 * Botanical leaf artwork for the SoilMon sidebar (SPEC §32.2, §32.12).
 *
 * Absolutely positioned relative to the sidebar <aside> (which has `relative`).
 * Fills the lower 55% of the sidebar with a large, intentional agricultural
 * composition using preserveAspectRatio="xMidYMax slice" — the leaf fills
 * the full container width without letterboxing, making it dramatically visible.
 *
 * z-index: 0 — strictly behind Gateway card (z-20) and nav (z-10).
 */
export function SidebarLeafDecoration() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-0"
      style={{ height: "52%" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 248 320"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-sidebar-text"
        style={{ opacity: 0.14 }}
      >
        {/* ── Primary large leaf — dominant botanical element ── */}
        <path
          d="M124 10 C56 55 50 165 124 306 C198 165 192 55 124 10 Z"
          strokeWidth="1.8"
        />
        {/* Central vein */}
        <path d="M124 22 L124 295" strokeWidth="1.3" />

        {/* Lateral veins — upper */}
        <path d="M124 62  C98  72  78  90  64  112" strokeWidth="1.1" />
        <path d="M124 62  C150 72  170 90  184 112" strokeWidth="1.1" />
        {/* Lateral veins — mid */}
        <path d="M124 112 C100 122 82  140 70  162" strokeWidth="1.0" />
        <path d="M124 112 C148 122 166 140 178 162" strokeWidth="1.0" />
        {/* Lateral veins — lower */}
        <path d="M124 166 C104 175 88  192 78  214" strokeWidth="0.9" opacity="0.75" />
        <path d="M124 166 C144 175 160 192 170 214" strokeWidth="0.9" opacity="0.75" />
        {/* Lateral veins — bottom */}
        <path d="M124 220 C108 228 96  243 88  262" strokeWidth="0.8" opacity="0.55" />
        <path d="M124 220 C140 228 152 243 160 262" strokeWidth="0.8" opacity="0.55" />

        {/* ── Secondary leaf — left offset, creates depth ── */}
        <path
          d="M46 72 C14 100 12 164 46 202 C80 164 78 100 46 72 Z"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <path d="M46 82 L46 194" strokeWidth="1.0" opacity="0.45" />
        <path d="M46 112 C32 120 22 132 16 148" strokeWidth="0.8" opacity="0.4" />
        <path d="M46 112 C60 120 70 132 76 148" strokeWidth="0.8" opacity="0.4" />
        <path d="M46 148 C34 155 26 165 20 180" strokeWidth="0.7" opacity="0.3" />
        <path d="M46 148 C58 155 66 165 72 180" strokeWidth="0.7" opacity="0.3" />

        {/* ── Ground contour lines ── */}
        <path d="M8  298 C58  278 190 278 240 298" strokeWidth="1.0" opacity="0.4" />
        <path d="M20 310 C65  294 183 294 228 310" strokeWidth="0.8" opacity="0.28" />
      </svg>
    </div>
  );
}

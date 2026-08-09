/**
 * Very subtle agricultural / topographic background decoration for the main
 * column (SPEC §18, §32.12).
 *
 * Extremely low opacity, fixed behind all content, non-interactive. Must never
 * interfere with readability. No gradients, glassmorphism, or heavy styling.
 */
export function PageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.04]"
    >
      <svg
        className="h-full w-full text-accent"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 800"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Faint topographic contour lines */}
        <path d="M-50 180 C 250 90, 520 260, 820 150 S 1300 220, 1350 120" />
        <path d="M-50 300 C 260 210, 540 380, 840 270 S 1300 340, 1350 240" />
        <path d="M-50 430 C 240 340, 560 500, 860 390 S 1300 460, 1350 360" />
        <path d="M-50 560 C 270 470, 540 630, 840 520 S 1300 590, 1350 490" />
        <path d="M-50 690 C 250 600, 560 760, 860 650 S 1300 720, 1350 620" />
        {/* Nested contour rings */}
        <ellipse cx="320" cy="380" rx="150" ry="95" />
        <ellipse cx="320" cy="380" rx="95" ry="58" />
        <ellipse cx="900" cy="470" rx="180" ry="110" />
        <ellipse cx="900" cy="470" rx="115" ry="68" />
      </svg>
    </div>
  );
}

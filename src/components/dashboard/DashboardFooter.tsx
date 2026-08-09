/**
 * Dashboard footer attribution (SPEC §32.11).
 *
 * Exactly two lines of centered text per spec §32.11 and design_specs §G:
 *   Line 1 (small, grey):  ENGINEERED FOR PRECISION BY
 *   Line 2 (bold, slate):  UNIVERSITAS MULTIMEDIA NUSANTARA & PT. IDE KREATIF TEKNOLOGI
 *
 * No brand icon, no project title, no disclaimer, no links (SPEC §32.20 #17–18).
 */
export function DashboardFooter() {
  return (
    <footer className="border-t border-border pb-6 pt-5">
      <div className="flex flex-col items-center gap-1 text-center">
        {/* Line 1: small, grey, uppercase */}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
          Engineered for Precision by
        </p>
        {/* Line 2: bold, slate-800 */}
        <p className="text-sm font-bold text-text">
          Universitas Multimedia Nusantara &amp; PT. IDE Kreatif Teknologi
        </p>
      </div>
    </footer>
  );
}

import hilirasiLogo from "@/assets/hilirasi.jpg";
import umnLogo from "@/assets/umn.jpg";
import dekatifLogo from "@/assets/dekatif.png";

/**
 * Institutional logo group (SPEC §13, §32.4).
 *
 * EXACTLY four slots in fixed order: Hilirisasi, UMN, FTI (pending), DEKATIF.
 * Normalised to a consistent rendered height. Gaps are intentional and balanced.
 */
export function HeaderLogos() {
  return (
    <div className="flex items-center gap-3" aria-label="Institutional logos">
      <img
        src={hilirasiLogo}
        alt="Hilirisasi"
        className="h-9 w-auto object-contain"
      />
      <img
        src={umnLogo}
        alt="Universitas Multimedia Nusantara"
        className="h-9 w-auto object-contain"
      />
      {/* FTI slot — asset pending. Same height/alignment as other logos (SPEC §32.4). */}
      <div
        className="flex h-9 w-14 items-center justify-center text-[11px] font-semibold text-muted"
        role="img"
        aria-label="FTI logo (pending)"
        title="FTI logo slot reserved"
      >
        FTI
      </div>
      <img
        src={dekatifLogo}
        alt="DEKATIF"
        className="h-9 w-auto object-contain"
      />
    </div>
  );
}

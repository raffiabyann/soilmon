import hilirasiLogo from "@/assets/hilirasi.png";
import umnLogo from "@/assets/umn.png";
import dekatifLogo from "@/assets/dekatif.png";

/**
 * Institutional logo group (SPEC §13, §32.4).
 *
 * Mobile: h-5 (20px) with gap-1 — fits 375px without overflow.
 * sm:     h-7 (28px).
 * lg:     h-9 (36px) — desktop reference design unchanged.
 */
export function HeaderLogos() {
  return (
    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3" aria-label="Institutional logos">
      <img
        src={hilirasiLogo}
        alt="Hilirisasi"
        className="h-5 w-auto object-contain sm:h-7 lg:h-9"
      />
      <img
        src={umnLogo}
        alt="Universitas Multimedia Nusantara"
        className="h-5 w-auto object-contain sm:h-7 lg:h-9"
      />
      {/* FTI slot — asset pending */}
      <div
        className="flex h-5 w-7 items-center justify-center text-[9px] font-semibold text-muted sm:h-7 sm:w-10 sm:text-[10px] lg:h-9 lg:w-14 lg:text-[11px]"
        role="img"
        aria-label="FTI logo (pending)"
        title="FTI logo slot reserved"
      >
        FTI
      </div>
      <img
        src={dekatifLogo}
        alt="DEKATIF"
        className="h-5 w-auto object-contain sm:h-7 lg:h-9"
      />
    </div>
  );
}

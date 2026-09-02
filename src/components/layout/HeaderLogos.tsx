import hilirasiLogo from "@/assets/hilirasi.png";
import umnLogo from "@/assets/umn.png";
import ftiLogoStacked from "@/assets/fti.png";
import ftiLogoWide from "@/assets/fti-h.png";
import dekatifLogo from "@/assets/dekatif.png";

/**
 * Institutional logo group (SPEC §13, §32.4).
 *
 * Sizing is balanced by ink area, not by raw height. The four marks span aspect
 * ratios from 0.66 (Hilirisasi, UMN) to 2.75 (FTI horizontal), so a common
 * height makes the wide ones read ~3x heavier than the portrait ones. The
 * heights below land within ~1.6x of each other: portrait 52px at xl, wide
 * marks 32-35px.
 *
 * The translate-y nudges optically centre each lockup. Every one of these
 * carries its weight off-centre — UMN and DEKATIF sit 10.7% high, Hilirisasi
 * 6.6% low — so flex centring alone leaves them visibly unaligned. The
 * percentages resolve against each image's own height, so one value holds at
 * every breakpoint.
 *
 * FTI ships as two lockups: stacked below xl, and horizontal at xl. The full-size
 * treatment waits for xl because at lg the sidebar appears and the header still
 * has to fit the date, auto-refresh and theme controls on one line — a 312px
 * logo row overlaps the title there.
 */
export function HeaderLogos() {
  return (
    <div
      className="flex items-center gap-1.5 sm:gap-4 xl:gap-7"
      aria-label="Institutional logos"
    >
      <img
        src={hilirasiLogo}
        alt="Hilirisasi"
        className="h-5 w-auto -translate-y-[7%] object-contain sm:h-10 xl:h-[52px]"
      />
      <img
        src={umnLogo}
        alt="Universitas Multimedia Nusantara"
        className="h-[18px] w-auto translate-y-[3%] object-contain sm:h-[37px] xl:h-12"
      />
      <img
        src={ftiLogoStacked}
        alt="Fakultas Teknik dan Informatika"
        className="h-[18px] w-auto translate-y-[17%] object-contain sm:h-[35px] xl:hidden"
      />
      <img
        src={ftiLogoWide}
        alt="Fakultas Teknik dan Informatika"
        className="hidden w-auto translate-y-[3%] object-contain xl:block xl:h-8"
      />
      <img
        src={dekatifLogo}
        alt="DEKATIF"
        className="h-[14px] w-auto translate-y-[11%] object-contain sm:h-[27px] xl:h-[35px]"
      />
    </div>
  );
}

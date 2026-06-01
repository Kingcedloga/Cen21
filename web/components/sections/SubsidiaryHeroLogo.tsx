"use client";

import Image from "next/image";

const DEFAULT_ACCENT = "#d4ad65";

type SubsidiaryHeroLogoProps = {
  src: string;
  alt: string;
  /** 0 = ghost monochrome, 1 = couleurs officielles */
  reveal: number;
  accentColor?: string;
};

/**
 * Logo filiale — ghost ivory au chargement, crossfade vers les couleurs
 * de la charte au scroll (opacity only, GPU-friendly).
 */
export function SubsidiaryHeroLogo({
  src,
  alt,
  reveal,
  accentColor = DEFAULT_ACCENT,
}: SubsidiaryHeroLogoProps) {
  const p = Math.min(1, Math.max(0, reveal));
  const ghostOpacity = (1 - p) * 0.9;
  const glowBlur = 14 + p * 12;
  const glowAlpha = Math.round(p * 0.42 * 255)
    .toString(16)
    .padStart(2, "0");

  const sizeClass =
    "h-20 w-auto max-w-full object-contain object-left md:h-24 lg:h-28";

  return (
    <div className="relative w-fit max-w-[min(100%,20rem)] md:max-w-[min(100%,24rem)] lg:max-w-[min(100%,26rem)]">
      <Image
        src={src}
        alt={alt}
        width={400}
        height={140}
        priority
        className={sizeClass}
        style={{
          opacity: p,
          transform: `scale(${0.988 + p * 0.012})`,
          transformOrigin: "left center",
          filter:
            p > 0.08
              ? `drop-shadow(0 2px ${glowBlur}px ${accentColor}${glowAlpha})`
              : "none",
        }}
      />
      <Image
        src={src}
        alt=""
        aria-hidden
        width={400}
        height={140}
        priority
        className={`pointer-events-none absolute left-0 top-0 ${sizeClass} brightness-0 invert`}
        style={{ opacity: ghostOpacity }}
      />
    </div>
  );
}

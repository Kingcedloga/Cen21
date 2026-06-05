"use client";

import Image from "next/image";

const DEFAULT_ACCENT = "#d4ad65";

type SubsidiaryHeroLogoProps = {
  src: string;
  alt: string;
  /** 0 = ghost monochrome, 1 = couleurs officielles */
  reveal: number;
  accentColor?: string;
  align?: "left" | "center";
  size?: "default" | "compact" | "cinematic" | "cinematic-xl";
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
  align = "left",
  size = "default",
}: SubsidiaryHeroLogoProps) {
  const p = Math.min(1, Math.max(0, reveal));
  const ghostOpacity = (1 - p) * 0.9;
  const glowBlur = 14 + p * 12;
  const glowAlpha = Math.round(p * 0.42 * 255)
    .toString(16)
    .padStart(2, "0");

  const sizeClass =
    size === "cinematic-xl"
      ? "subsidiary-hero__logo h-32 w-auto max-w-full object-contain sm:h-36 md:h-44 lg:h-52 xl:h-56"
      : size === "cinematic"
        ? "subsidiary-hero__logo h-24 w-auto max-w-full object-contain md:h-32 lg:h-36"
        : size === "compact"
          ? "subsidiary-hero__logo h-14 w-auto max-w-full object-contain sm:h-16 md:h-[4.5rem] lg:h-20"
          : "subsidiary-hero__logo h-20 w-auto max-w-full object-contain md:h-24 lg:h-28";

  const objectClass = align === "center" ? "object-center" : "object-left";
  const origin = align === "center" ? "center center" : "left center";
  const wrapClass =
    align === "center"
      ? size === "cinematic-xl"
        ? "relative mx-auto w-fit max-w-[min(100%,28rem)] sm:max-w-[min(100%,32rem)] md:max-w-[min(100%,38rem)] lg:max-w-[min(100%,44rem)]"
        : "relative mx-auto w-fit max-w-[min(100%,22rem)] md:max-w-[min(100%,28rem)] lg:max-w-[min(100%,32rem)]"
      : size === "compact"
        ? "relative w-fit max-w-[min(100%,16rem)] md:max-w-[min(100%,19rem)] lg:max-w-[min(100%,21rem)]"
        : "relative w-fit max-w-[min(100%,20rem)] md:max-w-[min(100%,24rem)] lg:max-w-[min(100%,26rem)]";

  const imageWidth =
    size === "cinematic-xl" ? 560 : size === "compact" ? 320 : 400;
  const imageHeight =
    size === "cinematic-xl" ? 196 : size === "compact" ? 112 : 140;

  return (
    <div className={wrapClass}>
      <div className="relative inline-block max-w-full">
        <Image
          src={src}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          priority
          className={`${sizeClass} ${objectClass}`}
          style={{
            opacity: p,
            transform: `scale(${0.988 + p * 0.012})`,
            transformOrigin: origin,
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
          width={imageWidth}
          height={imageHeight}
          priority
          className={`pointer-events-none absolute inset-0 ${sizeClass} ${objectClass} brightness-0 invert`}
          style={{ opacity: ghostOpacity, transformOrigin: origin }}
        />
      </div>
    </div>
  );
}

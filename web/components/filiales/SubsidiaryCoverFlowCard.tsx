"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { useSectorLabel } from "@/lib/use-sector-label";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { Subsidiary } from "@/lib/types";

function locationLine(subsidiary: Subsidiary, sectorLabel: string) {
  const city = subsidiary.practicalInfo.address?.split(",").pop()?.trim();
  if (city) return city;
  return sectorLabel;
}

export function SubsidiaryCoverFlowCard({
  subsidiary,
  isActive,
  width,
  onFocus,
}: {
  subsidiary: Subsidiary;
  isActive: boolean;
  width: number;
  onFocus?: () => void;
}) {
  const t = useTranslations("common");
  const sectorLabel = useSectorLabel(subsidiary.sector);
  const meta = `${sectorLabel} · ${locationLine(subsidiary, sectorLabel)}`;
  const router = useRouter();
  const href = `/filiales/${subsidiary.slug}`;

  const onPrefetch = () => {
    try {
      router.prefetch(href);
    } catch {
      // best effort
    }
  };

  const inner = (
    <>
      <Image
        src={subsidiary.coverImage}
        alt=""
        fill
        placeholder="blur"
        blurDataURL={BLUR_PETROL}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={`${width}px`}
        priority={isActive}
      />
      {/* Mobile : voile très léger (évite la bande sombre pleine largeur) — desktop inchangé. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/[0.45] via-black/10 to-transparent sm:hidden"
        aria-hidden
      />
      <div
        className="absolute inset-0 hidden bg-gradient-to-t from-petrol via-petrol/55 to-petrol/0 sm:block"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 hidden h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent sm:block"
        aria-hidden
      />

      <div
        className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/50 px-2 py-1 backdrop-blur-md sm:right-3 sm:top-3 sm:px-2.5 sm:py-1.5"
        style={{ borderColor: `${subsidiary.accentColor}66` }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor] sm:h-2 sm:w-2"
          style={{ backgroundColor: subsidiary.accentColor, color: subsidiary.accentColor }}
          aria-hidden
        />
        <span className="text-[10px] font-semibold tracking-wide text-ivory sm:text-[11px]">
          Premium
        </span>
      </div>

      {/* Bloc texte centré — padding/typo responsives calibrés pour cartes
          mobile très étroites (144 px) sans débordement, montée progressive
          jusqu'à 296 px desktop. */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 pt-10 text-center sm:px-4 sm:pb-4 sm:pt-14 md:px-5 md:pb-5 md:pt-20">
        {subsidiary.brandLogo ? (
          <div className="mx-auto flex h-5 max-w-[88%] items-center justify-center sm:h-6 md:h-7">
            <Image
              src={subsidiary.brandLogo}
              alt={subsidiary.name}
              width={136}
              height={28}
              className="h-full w-auto max-w-full object-contain object-center"
              sizes={`${Math.round(width * 0.88)}px`}
            />
          </div>
        ) : (
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold line-clamp-1 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)] sm:text-[10px] sm:tracking-[0.18em] md:text-[11px] md:tracking-[0.2em]">
            {sectorLabel}
          </p>
        )}
        <h3 className="mt-1 font-[family-name:var(--font-dm-sans)] text-[1.15rem] font-bold leading-[1.15] text-ivory line-clamp-2 sm:mt-1.5 sm:text-[1.35rem] md:text-2xl lg:text-[1.65rem]">
          {subsidiary.name}
        </h3>
        <p className="mt-1 text-[11px] text-ivory/80 line-clamp-1 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] sm:mt-1.5 sm:text-[12px] md:mt-2 md:text-sm">
          {meta}
        </p>
      </div>
    </>
  );

  const shellClass = `group relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-2xl border-2 bg-anthracite shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-[box-shadow,border-color,filter] duration-300 ${
    isActive
      ? "border-gold/60 shadow-[0_32px_80px_rgba(212,173,101,0.25)] ring-2 ring-gold/30 brightness-100"
      : "border-white/15 brightness-[0.72] saturate-[0.85]"
  }`;

  if (isActive) {
    return (
      <Link
        href={href}
        prefetch
        onMouseEnter={onPrefetch}
        onFocus={onPrefetch}
        className={`${shellClass} block cursor-pointer`}
        aria-label={t("discover", { name: subsidiary.name })}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onFocus}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className={`${shellClass} cursor-pointer text-left`}
      aria-label={t("show", { name: subsidiary.name })}
    >
      {inner}
    </button>
  );
}

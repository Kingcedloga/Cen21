"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Building2,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

import { SECTOR_LABELS } from "@/lib/content";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { Sector, Subsidiary } from "@/lib/types";

const SECTOR_ICON: Record<Sector, LucideIcon> = {
  restaurant: UtensilsCrossed,
  bar: Wine,
  lounge: Armchair,
  nightclub: Sparkles,
  evenementiel: Building2,
};

function locationLine(subsidiary: Subsidiary) {
  const city = subsidiary.practicalInfo.address?.split(",").pop()?.trim();
  if (city) return city;
  return SECTOR_LABELS[subsidiary.sector];
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
  const Icon = SECTOR_ICON[subsidiary.sector];
  const meta = `${SECTOR_LABELS[subsidiary.sector]} · ${locationLine(subsidiary)}`;
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
      {/* Voile dégradé renforcé en bas pour assurer la lisibilité du bloc texte */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/55 to-petrol/0"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
        aria-hidden
      />

      <div className="absolute left-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/25 bg-petrol/80 shadow-lg backdrop-blur-md sm:left-3 sm:top-3 sm:h-10 sm:w-10">
        <Icon className="h-4 w-4 text-ivory sm:h-5 sm:w-5" strokeWidth={1.75} aria-hidden />
      </div>

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
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold line-clamp-1 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)] sm:text-[10px] sm:tracking-[0.18em] md:text-[11px] md:tracking-[0.2em]">
          {SECTOR_LABELS[subsidiary.sector]}
        </p>
        <h3 className="mt-1 font-[family-name:var(--font-cormorant)] text-[1.15rem] font-medium leading-[1.15] text-ivory line-clamp-2 [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] sm:mt-1.5 sm:text-[1.35rem] md:text-2xl lg:text-[1.65rem]">
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
      ? "border-gold/60 shadow-[0_32px_80px_rgba(197,160,89,0.25)] ring-2 ring-gold/30 brightness-100"
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
        aria-label={`Découvrir ${subsidiary.name}`}
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
      aria-label={`Afficher ${subsidiary.name}`}
    >
      {inner}
    </button>
  );
}

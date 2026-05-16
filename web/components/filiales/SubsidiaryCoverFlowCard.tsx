import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Building2,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

import { SECTOR_LABELS } from "@/lib/content";
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

  const inner = (
    <>
      <Image
        src={subsidiary.coverImage}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={`${width}px`}
        priority={isActive}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/50 to-petrol/5" aria-hidden />

      <div className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-petrol/80 shadow-xl backdrop-blur-md">
        <Icon className="h-5 w-5 text-ivory" strokeWidth={1.75} aria-hidden />
      </div>

      <div
        className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/50 px-2.5 py-1.5 backdrop-blur-md"
        style={{ borderColor: `${subsidiary.accentColor}66` }}
      >
        <span
          className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
          style={{ backgroundColor: subsidiary.accentColor, color: subsidiary.accentColor }}
          aria-hidden
        />
        <span className="text-[11px] font-semibold tracking-wide text-ivory">Premium</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 pt-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold line-clamp-1">
          {SECTOR_LABELS[subsidiary.sector]}
        </p>
        <h3 className="mt-1.5 font-[family-name:var(--font-cormorant)] text-2xl font-medium leading-tight text-ivory line-clamp-2 md:text-[1.65rem]">
          {subsidiary.name}
        </h3>
        <p className="mt-2 text-sm text-ivory/75 line-clamp-1">{meta}</p>
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
        href={`/filiales/${subsidiary.slug}`}
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
      className={`${shellClass} cursor-pointer text-left`}
      aria-label={`Afficher ${subsidiary.name}`}
    >
      {inner}
    </button>
  );
}

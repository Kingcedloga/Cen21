"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Armchair,
  ArrowUpRight,
  Building2,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

/**
 * Carte « Compact » du bento — second niveau de hiérarchie.
 *
 * Format horizontal éditorial : vignette carrée à gauche, bloc texte
 * (sector / name / tagline) au centre, chevron au survol à droite.
 * Utilisée empilée à côté de la FeatureSubsidiaryCard pour composer
 * un bloc bento équilibré.
 */
export function CompactSubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
  const router = useRouter();
  const href = `/filiales/${subsidiary.slug}`;
  const Icon = SECTOR_ICON[subsidiary.sector];

  const onPrefetch = () => {
    try {
      router.prefetch(href);
    } catch {
      // best effort
    }
  };

  return (
    <article
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      onTouchStart={onPrefetch}
      className="group relative overflow-hidden rounded-2xl border border-white/12 bg-anthracite/45 shadow-[0_14px_32px_-18px_rgba(0,0,0,0.5)] transition-[transform,box-shadow,border-color,background-color] duration-400 ease-out hover:translate-x-1 hover:border-gold/45 hover:bg-anthracite/65 hover:shadow-[0_18px_44px_-18px_rgba(197,160,89,0.3),0_14px_32px_-16px_rgba(0,0,0,0.6)]"
    >
      <Link
        href={href}
        prefetch
        className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-[-3px]"
        aria-label={`Découvrir ${subsidiary.name}`}
      />

      <div className="flex items-stretch gap-4 p-3 md:p-4">
        {/* Vignette image carrée — proportionnelle à la hauteur de la carte */}
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl md:w-28">
          <Image
            src={subsidiary.coverImage}
            alt=""
            fill
            placeholder="blur"
            blurDataURL={BLUR_PETROL}
            sizes="120px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          {/* Voile sombre + accent radial au survol */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${subsidiary.accentColor}33 0%, transparent 70%)`,
            }}
          />
          {/* Liseré accentColor gauche */}
          <span
            aria-hidden
            className="absolute left-0 top-0 h-full w-[2px]"
            style={{ backgroundColor: subsidiary.accentColor, opacity: 0.9 }}
          />
        </div>

        {/* Bloc éditorial central */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-1">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-gold" strokeWidth={1.85} aria-hidden />
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gold">
              {SECTOR_LABELS[subsidiary.sector]}
            </p>
          </div>
          <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-medium leading-tight tracking-[-0.005em] text-ivory line-clamp-1 md:text-[1.4rem]">
            {subsidiary.name}
          </h3>
          <p className="line-clamp-1 text-[13px] leading-relaxed text-ivory/65 md:text-sm">
            {subsidiary.tagline}
          </p>
        </div>

        {/* Chevron de découverte (translate au survol) */}
        <div
          className="flex shrink-0 items-center justify-center self-center pr-2 md:pr-3"
          aria-hidden
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-ivory/60 transition-all duration-300 group-hover:border-gold/55 group-hover:bg-gold/10 group-hover:text-gold">
            <ArrowUpRight
              className="h-4 w-4 -translate-x-px transition-transform duration-300 group-hover:translate-x-0 group-hover:-translate-y-px"
              strokeWidth={1.75}
            />
          </span>
        </div>
      </div>
    </article>
  );
}

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
 * Carte « Feature » du bento — premier niveau de hiérarchie.
 *
 * - Image dominante (ratio 4/5 mobile/tablet, 5/6 desktop pour densité éditoriale)
 * - Titre Cormorant XL + tagline + description courte
 * - Voile dégradé bas + halo accentColor au survol
 * - Hover : translate-y -1.5 + shadow doré, shimmer subtil sur l'image
 */
export function FeatureSubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
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
      className="group relative h-full overflow-hidden rounded-3xl border border-white/12 bg-anthracite/55 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.6)] transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-gold/55 hover:shadow-[0_32px_80px_-22px_rgba(197,160,89,0.35),0_22px_50px_-18px_rgba(0,0,0,0.7)]"
    >
      <Link
        href={href}
        prefetch
        className="absolute inset-0 z-30 cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-[-3px]"
        aria-label={`Découvrir ${subsidiary.name}`}
      />

      <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6] lg:aspect-auto lg:h-full lg:min-h-[560px]">
        <Image
          src={subsidiary.coverImage}
          alt={subsidiary.name}
          fill
          placeholder="blur"
          blurDataURL={BLUR_PETROL}
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />

        {/* Voile éditorial bas (petrol → fade haut) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-petrol from-[6%] via-petrol/55 to-transparent"
        />
        {/* Halo accentColor activé au survol */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 90%, ${subsidiary.accentColor}40 0%, transparent 65%)`,
          }}
        />
        {/* Liseré accentColor latéral gauche (animé en gold au survol) */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ backgroundColor: subsidiary.accentColor, opacity: 0.85 }}
        />
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-gold opacity-0 transition-all duration-700 group-hover:scale-y-100 group-hover:opacity-90"
        />

        {/* Chip secteur (top-left) */}
        <div className="absolute left-5 top-5 z-10 flex items-center gap-2.5 rounded-full border border-white/20 bg-petrol/80 px-3.5 py-2 backdrop-blur-md md:left-7 md:top-7">
          <Icon className="h-4 w-4 text-gold" strokeWidth={1.85} aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory">
            {SECTOR_LABELS[subsidiary.sector]}
          </span>
        </div>

        {/* Chip Premium / featured (top-right) */}
        {subsidiary.featured && (
          <div
            className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-full border border-gold/45 bg-gold/10 px-3 py-1.5 backdrop-blur-md md:right-7 md:top-7"
            style={{ borderColor: `${subsidiary.accentColor}66` }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: subsidiary.accentColor, color: subsidiary.accentColor }}
              aria-hidden
            />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-gold">
              En vedette
            </span>
          </div>
        )}
      </div>

      {/* Bloc éditorial absolu (overlay sur l'image, en bas) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-3 p-6 md:p-8 lg:p-10">
        <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-medium leading-[1.05] tracking-[-0.015em] text-ivory [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] md:text-4xl lg:text-[2.85rem]">
          <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span>{subsidiary.name}</span>
            <ArrowUpRight
              className="h-6 w-6 -translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:h-7 md:w-7"
              aria-hidden
            />
          </span>
        </h3>
        <p className="font-[family-name:var(--font-cormorant)] text-lg italic text-ivory/85 md:text-xl">
          {subsidiary.tagline}
        </p>
        <p className="line-clamp-2 max-w-[52ch] text-sm leading-[1.65] text-ivory/70 md:text-[15px]">
          {subsidiary.description}
        </p>
      </div>
    </article>
  );
}

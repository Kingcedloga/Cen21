"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";

import { BLUR_PETROL } from "@/lib/image-blur";
import {
  ICON_STROKE,
  Music2,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Martini,
  Armchair,
  sectorIcons,
  type LucideIcon,
} from "@/lib/icons";
import type { GalleryCategory } from "@/lib/gallery-categories";
import type { GalleryItem, Sector } from "@/lib/types";

const CATEGORY_ICONS: Record<GalleryCategory, LucideIcon> = {
  vibes: Star,
  ambiance: Sparkles,
  interior: Armchair,
  food: UtensilsCrossed,
  drinks: Martini,
  events: Music2,
  guests: Users,
};

type SubsidiaryExpandableGalleryProps = {
  items: GalleryItem[];
  subsidiaryName: string;
  sectorLabel: string;
  sector: Sector;
  /** Couleur d'accent (icônes, pastilles). */
  accentColor: string;
  /** Fond du bloc galerie — charte filiale ou défaut. */
  backgroundColor?: string;
  themed?: boolean;
};

export function SubsidiaryExpandableGallery({
  items,
  subsidiaryName,
  sectorLabel,
  sector,
  accentColor,
  backgroundColor,
  themed = false,
}: SubsidiaryExpandableGalleryProps) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const SectorIcon = sectorIcons[sector];
  const duration = reduced ? "0ms" : "650ms";

  const activate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (items.length === 0) return null;

  const panelBg = backgroundColor
    ? backgroundColor
    : themed
      ? "color-mix(in srgb, var(--sub-bg) 88%, black 12%)"
      : "color-mix(in srgb, var(--color-petrol-panel-2) 92%, black 8%)";

  return (
    <div
      className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={subsidiaryName}
    >
      <div
        className="flex min-h-[min(68vw,22rem)] gap-2 rounded-[1.75rem] p-3 md:min-h-[26rem] md:gap-3 md:p-4"
        style={{
          backgroundColor: panelBg,
          minWidth: `min(100%, ${Math.max(items.length * 3.25 + 18, 22)}rem)`,
        }}
      >
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const CategoryIcon =
            CATEGORY_ICONS[(item.tags[0] as GalleryCategory) ?? "vibes"] ??
            CATEGORY_ICONS.vibes;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.alt}
              onMouseEnter={() => activate(index)}
              onFocus={() => activate(index)}
              onClick={() => activate(index)}
              className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 md:rounded-[1.75rem]"
              style={{
                flex: isActive ? "1 1 28rem" : "0 0 3.25rem",
                minWidth: isActive ? "min(62vw, 36rem)" : "3.25rem",
                maxWidth: isActive ? "36rem" : "3.25rem",
                transition: `flex ${duration} var(--ease-luxury), min-width ${duration} var(--ease-luxury), max-width ${duration} var(--ease-luxury)`,
                outlineColor: accentColor,
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                placeholder="blur"
                blurDataURL={BLUR_PETROL}
                className="object-cover object-center transition-transform duration-[700ms] ease-[var(--ease-luxury)] group-hover:scale-[1.03]"
                sizes={
                  isActive
                    ? "(max-width: 768px) 70vw, 576px"
                    : "52px"
                }
                priority={index === 0}
              />

              {/* Overlay inactif */}
              <span
                aria-hidden
                className="absolute inset-0 transition-opacity duration-[650ms] ease-[var(--ease-luxury)]"
                style={{
                  opacity: isActive ? 0 : 1,
                  backgroundColor: "rgba(0, 0, 0, 0.42)",
                }}
              />

              {/* Dégradé bas — carte active */}
              <span
                aria-hidden
                className="absolute inset-0 transition-opacity duration-[650ms] ease-[var(--ease-luxury)]"
                style={{
                  opacity: isActive ? 1 : 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 38%, transparent 72%)",
                }}
              />

              {/* Icône seule — carte inactive */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-3 flex justify-center transition-opacity duration-[480ms] ease-[var(--ease-luxury)] md:bottom-4"
                style={{ opacity: isActive ? 0 : 1 }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md"
                  style={{ color: accentColor }}
                >
                  <CategoryIcon className="h-4 w-4" strokeWidth={ICON_STROKE} />
                </span>
              </span>

              {/* Légende — carte active */}
              <span
                className="absolute inset-x-0 bottom-0 flex items-end gap-3 px-4 pb-4 pt-10 transition-opacity duration-[480ms] ease-[var(--ease-luxury)] md:px-5 md:pb-5"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-md"
                  style={{ color: accentColor }}
                >
                  <SectorIcon className="h-5 w-5" strokeWidth={ICON_STROKE} />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block truncate font-[family-name:var(--font-dm-sans)] text-base font-semibold leading-tight text-white md:text-lg">
                    {subsidiaryName}
                  </span>
                  <span className="mt-0.5 block truncate text-xs uppercase tracking-[0.18em] text-white/75 md:text-[13px]">
                    {sectorLabel}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

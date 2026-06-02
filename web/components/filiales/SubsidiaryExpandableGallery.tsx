"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { BLUR_PETROL } from "@/lib/image-blur";
import type { GalleryCategory } from "@/lib/gallery-categories";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";
import type { GalleryItem } from "@/lib/types";

type SubsidiaryExpandableGalleryProps = {
  items: GalleryItem[];
  subsidiaryName: string;
  sectorLabel: string;
  /** Couleur d'accent (pastilles, focus). */
  accentColor: string;
  /** Fond du bloc galerie — charte filiale ou défaut. */
  backgroundColor?: string;
  themed?: boolean;
};

function itemCategory(item: GalleryItem): GalleryCategory {
  const tag = item.tags[0];
  return (GALLERY_CATEGORIES as readonly string[]).includes(tag ?? "")
    ? (tag as GalleryCategory)
    : "vibes";
}

export function SubsidiaryExpandableGallery({
  items,
  subsidiaryName,
  sectorLabel,
  accentColor,
  backgroundColor,
  themed = false,
}: SubsidiaryExpandableGalleryProps) {
  const reduced = useReducedMotion();
  const tCat = useTranslations("subsidiaries.galleryCategories");
  const [activeIndex, setActiveIndex] = useState(0);

  const duration = reduced ? "0ms" : "650ms";

  const activate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const categoryLabel = (item: GalleryItem) =>
    tCat(itemCategory(item));

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
          const label = categoryLabel(item);

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${label} — ${item.alt}`}
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

              {/* Catégorie — carte inactive (bas gauche, vertical) */}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 left-2.5 flex max-h-[calc(100%-1.5rem)] transition-opacity duration-[480ms] ease-[var(--ease-luxury)] md:bottom-4 md:left-3"
                style={{ opacity: isActive ? 0 : 1 }}
              >
                <span
                  className="max-h-full truncate font-[family-name:var(--font-dm-sans)] text-[8px] font-medium uppercase tracking-[0.18em] [writing-mode:vertical-rl] rotate-180 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] md:text-[9px]"
                  style={{ color: accentColor }}
                >
                  {label}
                </span>
              </span>

              {/* Légende — carte active */}
              <span
                className="absolute inset-x-0 bottom-0 flex items-end gap-3 px-4 pb-4 pt-10 text-left transition-opacity duration-[480ms] ease-[var(--ease-luxury)] md:px-5 md:pb-5"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                <span className="min-w-0 flex-1">
                  <span
                    className="mb-1 inline-block font-[family-name:var(--font-dm-sans)] text-[9px] font-semibold uppercase tracking-[0.18em] md:text-[10px]"
                    style={{ color: accentColor }}
                  >
                    {label}
                  </span>
                  <span className="block truncate font-[family-name:var(--font-dm-sans)] text-sm font-semibold leading-tight text-white md:text-base">
                    {subsidiaryName}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.16em] text-white/75 md:text-[11px]">
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

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

import { GalleryLightbox, type LightboxHouse } from "@/components/gallery/GalleryLightbox";
import { RevealCard } from "@/components/motion/RevealCard";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { BLUR_PETROL } from "@/lib/image-blur";
import { useHydrated, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/gallery.css";

export type WallHouse = LightboxHouse & { slug: string; logo?: string; logoSurface: string };

/** Photos ajoutées à chaque « Afficher plus » (Orbix : grille de 24). */
const BATCH = 24;

/** Grandes vignettes (2 × 2) : deux par série de dix, la grille reste pleine. */
function isFeature(index: number) {
  return index % 10 === 0 || index % 10 === 6;
}

/**
 * Mur de photos de la galerie (refonte R4) : filtres par maison (logo,
 * pastille or qui glisse sous le filtre actif) et compteur, grille révélée
 * (flou, reflet) chargée par lots de 24, visionneuse au clic.
 * `?maison=…` présélectionne une maison (liens depuis les fiches filiales).
 */
export function GalleryWall({ photos, houses }: { photos: GalleryPhoto[]; houses: WallHouse[] }) {
  const t = useTranslations("gallery");
  const params = useSearchParams();
  const requested = params.get("maison");
  const [filter, setFilter] = useState(houses.some((house) => house.slug === requested) ? (requested as string) : "all");
  const [visible, setVisible] = useState(BATCH);
  const [open, setOpen] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotionSafe();
  const hydrated = useHydrated();

  const filtered = filter === "all" ? photos : photos.filter((photo) => photo.houseSlug === filter);
  const shown = filtered.slice(0, visible);
  const houseInfo = Object.fromEntries(houses.map((house) => [house.slug, house]));

  const choose = (slug: string) => {
    setFilter(slug);
    setVisible(BATCH);
    setOpen(null);
  };

  const openAt = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    openerRef.current = event.currentTarget;
    setOpen(index);
  };

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <div role="group" aria-label={t("filterLabel")} className="gallery-filters">
        {[{ slug: "all", name: t("all"), logo: undefined, logoSurface: "" }, ...houses].map((house) => {
          const active = filter === house.slug;
          return (
            <button
              key={house.slug}
              type="button"
              aria-pressed={active}
              onClick={() => choose(house.slug)}
              className={`gallery-filter tap-press ${house.logo ? "gallery-filter--logo" : ""}`}
            >
              {active && (
                <motion.span
                  layoutId="gallery-filter-pill"
                  aria-hidden="true"
                  className="gallery-filter__pill"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              {house.logo && (
                <span className="gallery-filter__logo" style={{ backgroundColor: house.logoSurface }}>
                  <Image src={house.logo} alt="" fill sizes="28px" className="object-contain p-0.5" />
                </span>
              )}
              <span className="relative">{house.name}</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="gallery-count">
        {t("count", { count: filtered.length })}
      </p>

      <ul className="gallery-wall">
        {shown.map((photo, index) => (
          <li key={photo.id} className={isFeature(index) ? "gallery-wall__feature" : undefined}>
            <RevealCard index={index} className="gallery-tile">
              <button
                type="button"
                onClick={(event) => openAt(index, event)}
                aria-label={t("open", { alt: photo.alt })}
                className="gallery-tile__button"
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_PETROL}
                  sizes={isFeature(index) ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 50vw, 25vw"}
                  className="gallery-tile__image"
                />
              </button>
            </RevealCard>
          </li>
        ))}
      </ul>

      {visible < filtered.length && (
        <div className="gallery-more">
          <button type="button" onClick={() => setVisible((count) => count + BATCH)} className="btn-secondary gallery-more__button tap-press">
            {t("loadMore")}
          </button>
          <p aria-live="polite" className="gallery-more__status">
            {t("shownCount", { shown: shown.length, total: filtered.length })}
          </p>
        </div>
      )}

      {hydrated &&
        createPortal(
          <AnimatePresence>
            {open !== null && filtered[open] && (
              <GalleryLightbox
                key="gallery-lightbox"
                photos={filtered}
                index={open}
                houses={houseInfo}
                onIndex={setOpen}
                onClose={close}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

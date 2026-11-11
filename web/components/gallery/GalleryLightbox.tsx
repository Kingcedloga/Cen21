"use client";

import { AnimatePresence, motion, type PanInfo, type Variants } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "@/lib/icons";
import { EASE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/gallery.css";

export type LightboxHouse = { name: string; href: string; external: boolean };

/** Décision au lâcher : distance parcourue (px) ou vitesse (px/s). */
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 450;
const FOCUSABLE = "a[href], button:not([disabled])";

const slide: Variants = {
  enter: (direction: number) => ({ x: direction * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -60, opacity: 0 }),
};

/**
 * Visionneuse de la galerie (refonte R4) : photo plein écran, compteur,
 * légende avec lien vers la maison. Flèches du clavier, balayage au doigt ou
 * glisser à la souris pour changer de photo ; Échap ferme. Le focus reste
 * dans la visionneuse et revient à la vignette à la fermeture (GalleryWall).
 * Rendue sous <body> (portail) : au-dessus de la capsule de navigation.
 */
export function GalleryLightbox({
  photos,
  index,
  houses,
  onIndex,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number;
  houses: Record<string, LightboxHouse>;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const t = useTranslations("gallery");
  const tCommon = useTranslations("common");
  const tContact = useTranslations("contact");
  const reduced = useReducedMotionSafe();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState(0);
  const total = photos.length;
  const photo = photos[index];
  const house = houses[photo.houseSlug];

  const go = (step: number) => {
    setDirection(step);
    onIndex((index + step + total) % total);
  };

  // Ouverture : focus sur « Fermer », page figée (Lenis s'arrête sur `overflow: hidden`).
  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const step = event.key === "ArrowRight" ? 1 : -1;
        setDirection(step);
        onIndex((index + step + total) % total);
        return;
      }
      const dialog = dialogRef.current;
      if (event.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, total, onIndex, onClose]);

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(-1);
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("lightboxLabel")}
      className="lightbox"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.3, ease: EASE.outSoft }}
    >
      <div className="lightbox__bar">
        <p aria-live="polite" className="lightbox__counter">
          {t("position", { index: index + 1, total })}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t("close")} className="lightbox__button">
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="lightbox__stage">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={photo.id}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE.luxury }}
            drag={total > 1 ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.5}
            onDragEnd={onDragEnd}
            className="lightbox__frame"
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="100vw" draggable={false} className="object-contain" />
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t("prev")} className="lightbox__button lightbox__nav lightbox__nav--prev">
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t("next")} className="lightbox__button lightbox__nav lightbox__nav--next">
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="lightbox__caption">
        <p className="lightbox__alt">{photo.alt}</p>
        {house &&
          (house.external ? (
            <a href={house.href} target="_blank" rel="noopener noreferrer" className="lightbox__house">
              {tCommon("discover", { name: house.name })}
              <ArrowUpRight size={14} aria-hidden="true" />
              <span className="sr-only"> ({tContact("newTab")})</span>
            </a>
          ) : (
            <Link href={house.href} className="lightbox__house">
              {tCommon("discover", { name: house.name })}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          ))}
      </div>
    </motion.div>
  );
}

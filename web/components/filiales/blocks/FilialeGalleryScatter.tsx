"use client";

import { AnimatePresence, motion, useTransform, type MotionStyle } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GalleryLightbox, type LightboxHouse } from "@/components/gallery/GalleryLightbox";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { useHydrated } from "@/lib/use-media-query";

import "@/styles/filiale-blocks.css";

/** Photos posées sur la scène (emplacements dans filiale-blocks.css ; 5 sur mobile). */
const SLOTS = 11;
/** Ordre d'arrivée des emplacements : en désordre, comme des photos jetées. */
const LANDING = [3, 7, 0, 9, 5, 1, 10, 4, 8, 2, 6];
/** Part de la piste pendant laquelle les photos arrivent, et durée d'un vol. */
const SPREAD = 0.48;
const FLIGHT = 0.28;

/**
 * Photos de la maison éparpillées autour du titre (Millionaire Club) : la scène
 * reste épinglée et, au fil du défilement, chaque photo arrive du bord de
 * l'écran, pivote et se pose à sa place, comme jetée sur une table. Le
 * défilement pilote tout, dans les deux sens ; rien ne bouge seul.
 * Clic sur une photo ou sur « Voir les N photos » : visionneuse (toutes les
 * photos). Reduced motion : photos posées d'emblée, section non épinglée.
 */
export function FilialeGalleryScatter({
  name,
  photos,
  house,
}: {
  name: string;
  photos: GalleryPhoto[];
  house: LightboxHouse & { slug: string };
}) {
  const hydrated = useHydrated();
  const openerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  if (photos.length === 0) return null;

  const onOpen = (index: number, opener: HTMLElement | null) => {
    openerRef.current = opener;
    setOpen(index);
  };

  return (
    <>
      <StickyTrack
        lengthVh={280}
        mobileLengthVh={230}
        surface="dark"
        id="galerie"
        ariaLabelledby="filiale-gallery-title"
        className="bg-petrol-panel-4"
      >
        <ScatterStage name={name} photos={photos} onOpen={onOpen} />
      </StickyTrack>

      {hydrated &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <GalleryLightbox
                key="filiale-lightbox"
                photos={photos}
                index={open}
                houses={{ [house.slug]: house }}
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

function ScatterStage({
  name,
  photos,
  onOpen,
}: {
  name: string;
  photos: GalleryPhoto[];
  onOpen: (index: number, opener: HTMLElement | null) => void;
}) {
  const t = useTranslations("filiale");
  const { isStatic } = useStickyTrack();
  const allRef = useRef<HTMLSpanElement>(null);
  const placed = photos.slice(0, SLOTS);

  return (
    <div className={`filiale-scatter ${isStatic ? "is-static" : ""}`}>
      <div className="filiale-scatter__center">
        <SectionHeading
          look="editorial"
          eyebrow={t("galleryEyebrow")}
          title={t("galleryTitle", { name })}
          sweep={name}
          titleAs="h2"
          titleId="filiale-gallery-title"
          align="center"
          className="filiale-scatter__heading mb-6!"
        />
        <span ref={allRef} className="filiale-scatter__all">
          <Button variant="secondary" onClick={() => onOpen(0, allRef.current?.querySelector("button") ?? null)}>
            {t("galleryAll", { count: photos.length })}
          </Button>
        </span>
      </div>

      <ul aria-label={t("galleryList", { name })} className="filiale-scatter__list">
        {placed.map((photo, index) => {
          const rank = LANDING.indexOf(index);
          return (
            <ScatterPhoto
              key={photo.id}
              photo={photo}
              index={index}
              rank={rank === -1 ? index : rank}
              count={placed.length}
              onOpen={onOpen}
            />
          );
        })}
      </ul>
    </div>
  );
}

function ScatterPhoto({
  photo,
  index,
  rank,
  count,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  rank: number;
  count: number;
  onOpen: (index: number, opener: HTMLElement | null) => void;
}) {
  const { progress, isStatic } = useStickyTrack();
  // Vol de la photo : départ échelonné selon son rang d'arrivée, fin amortie.
  const start = 0.04 + (rank / Math.max(1, count)) * SPREAD;
  const landed = useTransform(progress, (p) => {
    const k = Math.min(1, Math.max(0, (p - start) / FLIGHT));
    return 1 - (1 - k) ** 3;
  });

  return (
    <motion.li className="filiale-scatter__item" style={{ "--k": isStatic ? 1 : landed } as MotionStyle}>
      <button
        type="button"
        onClick={(event) => onOpen(index, event.currentTarget)}
        aria-label={photo.alt}
        className="filiale-scatter__button"
      >
        <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 13vw, (min-width: 768px) 18vw, 30vw" className="object-cover" />
      </button>
    </motion.li>
  );
}

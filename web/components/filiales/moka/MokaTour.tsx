"use client";

import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GalleryLightbox, type LightboxHouse } from "@/components/gallery/GalleryLightbox";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Button } from "@/components/ui/Button";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import type { SubsidiaryTourStop } from "@/lib/types";
import { useHydrated } from "@/lib/use-media-query";

import "@/styles/moka.css";

/** Course de la visite dans la piste : pause au début et à la fin. */
const TOUR_START = 0.06;
const TOUR_SPAN = 0.86;
/** Part d'une étape consacrée à l'ouverture du cercle (le reste : pause). */
const OPENING = 0.72;

/** Rendu statique : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_FRAME = { clipPath: "none" };
const STILL_IMAGE = { scale: 1 };

const pad = (n: number) => String(n).padStart(2, "0");

/** Ouverture (0 → 1) de l'espace `index` (≥ 1) selon la progression de la piste. */
function opening(progress: number, index: number, count: number) {
  const step = TOUR_SPAN / Math.max(1, count - 1);
  const start = TOUR_START + (index - 1) * step;
  const k = Math.min(1, Math.max(0, (progress - start) / (step * OPENING)));
  return k * k * (3 - 2 * k);
}

/**
 * Visite du lieu (Moka & More) : la scène reste épinglée et chaque espace —
 * l'entrée, le lounge, le bar, la salle, la terrasse — s'ouvre dans un
 * cercle au centre du précédent (le « o » de Moka), qui grossit jusqu'à
 * remplir l'écran pendant que l'espace quitté s'approche, comme si l'on
 * avançait. Le nom de l'espace et le compteur suivent. Épinglée aussi sur
 * mobile. Reduced motion : les espaces en grille, légendés.
 */
export function MokaTour({
  stops,
  photos,
  house,
}: {
  stops: SubsidiaryTourStop[];
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

  if (stops.length === 0) return null;

  return (
    <>
      <StickyTrack
        lengthVh={110 + 75 * stops.length}
        mobileLengthVh={100 + 60 * stops.length}
        surface="dark"
        id="lieu"
        ariaLabelledby="moka-tour-title"
        className="bg-petrol-panel-4"
      >
        <TourStage
          stops={stops}
          photoCount={photos.length}
          onOpen={(opener) => {
            openerRef.current = opener;
            setOpen(0);
          }}
        />
      </StickyTrack>

      {hydrated &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <GalleryLightbox
                key="moka-lightbox"
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

function TourStage({
  stops,
  photoCount,
  onOpen,
}: {
  stops: SubsidiaryTourStop[];
  photoCount: number;
  onOpen: (opener: HTMLElement | null) => void;
}) {
  const t = useTranslations("moka");
  const tFiliale = useTranslations("filiale");
  const { progress, isStatic } = useStickyTrack();
  const allRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  // Espace courant : le dernier dont le cercle a passé la moitié de l'écran.
  useMotionValueEvent(progress, "change", (value) => {
    let current = 0;
    for (let i = 1; i < stops.length; i++) if (opening(value, i, stops.length) >= 0.5) current = i;
    setActive((previous) => (previous === current ? previous : current));
  });

  return (
    <div className={`moka-tour ${isStatic ? "is-static" : ""}`}>
      <div className="moka-tour__head">
        <p className="moka-eyebrow">{t("tourEyebrow")}</p>
        <h2 id="moka-tour-title" className="moka-title">
          {t("tourTitle")}
        </h2>
        {!isStatic && (
          <p aria-hidden="true" className="moka-tour__hint">
            {t("tourHint")}
          </p>
        )}
      </div>

      <ol className="moka-tour__rooms">
        {stops.map((stop, index) => (
          <TourRoom
            key={stop.label}
            stop={stop}
            index={index}
            count={stops.length}
            progress={progress}
            isStatic={isStatic}
          />
        ))}
      </ol>

      <div className="moka-tour__foot">
        {!isStatic && (
          <p aria-hidden="true" className="moka-tour__now">
            <span className="moka-tour__count">
              {pad(active + 1)} <span>/ {pad(stops.length)}</span>
            </span>
            <span key={active} className="moka-tour__label">
              {stops[active]?.label}
            </span>
          </p>
        )}
        {photoCount > 0 && (
          <span ref={allRef}>
            <Button variant="secondary" onClick={() => onOpen(allRef.current?.querySelector("button") ?? null)}>
              {tFiliale("galleryAll", { count: photoCount })}
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}

function TourRoom({
  stop,
  index,
  count,
  progress,
  isStatic,
}: {
  stop: SubsidiaryTourStop;
  index: number;
  count: number;
  progress: MotionValue<number>;
  isStatic: boolean;
}) {
  // Cercle d'ouverture de cet espace (le premier est ouvert d'emblée).
  const clipPath = useTransform(progress, (value) =>
    index === 0 ? "circle(150% at 50% 50%)" : `circle(${(opening(value, index, count) * 78).toFixed(2)}% at 50% 50%)`,
  );
  // L'espace quitté s'approche pendant que le suivant s'ouvre.
  const scale = useTransform(progress, (value) => {
    const next = index + 1 < count ? opening(value, index + 1, count) : 0;
    const own = index === 0 ? 1 : opening(value, index, count);
    return 1.18 - 0.18 * own + 0.22 * next;
  });

  return (
    <li className="moka-tour__room" style={{ zIndex: index + 1 }}>
      <motion.figure className="moka-tour__frame" style={isStatic ? STILL_FRAME : { clipPath }}>
        <motion.div className="absolute inset-0" style={isStatic ? STILL_IMAGE : { scale }}>
          <Image src={stop.image.src} alt={stop.image.alt} fill sizes="100vw" className="object-cover" />
        </motion.div>
        <figcaption className="moka-tour__caption">{stop.label}</figcaption>
      </motion.figure>
    </li>
  );
}

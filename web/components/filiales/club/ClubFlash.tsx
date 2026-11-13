"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GalleryLightbox, type LightboxHouse } from "@/components/gallery/GalleryLightbox";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { useHydrated, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/club.css";

/** Vitesse de chaque colonne (px sur la traversée de l'écran). */
const COLUMN_DRIFT = [40, -90, 10];

/**
 * « Vu au club » : un mur de photos en colonnes qui glissent à des vitesses
 * différentes ; chaque photo s'allume d'un seul flash d'appareil photo à son
 * entrée (un éclair bref, jamais répété). Clic : visionneuse.
 * Reduced motion : ni flash ni glissement.
 */
export function ClubFlash({ name, photos, house }: { name: string; photos: GalleryPhoto[]; house: LightboxHouse & { slug: string } }) {
  const t = useTranslations("club");
  const tFiliale = useTranslations("filiale");
  const hydrated = useHydrated();
  const reduced = useReducedMotionSafe();
  const wide = useMediaQuery("(min-width: 768px)");
  const wallRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: wallRef, offset: ["start end", "end start"] });

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  if (photos.length === 0) return null;

  const count = wide ? 3 : 2;
  const columns = Array.from({ length: count }, (_, c) =>
    photos.map((photo, index) => ({ photo, index })).filter(({ index }) => index % count === c),
  );

  return (
    <div className="club-flash">
      <header className="club-flash__head">
        <p className="club-eyebrow">{t("flashEyebrow")}</p>
        <h2 id="filiale-gallery-title" className="club-flash__title">
          {t("flashTitle")}
        </h2>
        <p className="club-flash__hint">{t("flashHint")}</p>
      </header>

      <div ref={wallRef} role="group" aria-label={tFiliale("galleryList", { name })} className="club-flash__wall" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {columns.map((column, c) => (
          <FlashColumn
            key={`${count}-${c}`}
            items={column}
            drift={COLUMN_DRIFT[c % COLUMN_DRIFT.length]}
            progress={scrollYProgress}
            reduced={reduced}
            onOpen={(index, opener) => {
              openerRef.current = opener;
              setOpen(index);
            }}
          />
        ))}
      </div>

      {hydrated &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <GalleryLightbox key="club-lightbox" photos={photos} index={open} houses={{ [house.slug]: house }} onIndex={setOpen} onClose={close} />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

const STILL = { y: 0 };

function FlashColumn({
  items,
  drift,
  progress,
  reduced,
  onOpen,
}: {
  items: { photo: GalleryPhoto; index: number }[];
  drift: number;
  progress: MotionValue<number>;
  reduced: boolean;
  onOpen: (index: number, opener: HTMLElement) => void;
}) {
  const y = useTransform(progress, [0, 1], [drift, -drift]);
  return (
    <motion.ul className="club-flash__column" style={reduced ? STILL : { y }}>
      {items.map(({ photo, index }) => (
        <FlashTile key={photo.id} photo={photo} index={index} reduced={reduced} onOpen={onOpen} />
      ))}
    </motion.ul>
  );
}

function FlashTile({
  photo,
  index,
  reduced,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  reduced: boolean;
  onOpen: (index: number, opener: HTMLElement) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });
  const lit = seen || reduced;

  return (
    <li ref={ref} className="club-flash__tile">
      <button type="button" onClick={(event) => onOpen(index, event.currentTarget)} aria-label={photo.alt} className="club-flash__button">
        <motion.span
          className="absolute inset-0"
          initial={false}
          animate={lit ? { opacity: 1, scale: 1, filter: "brightness(1)" } : { opacity: 0.15, scale: 1.06, filter: "brightness(0.4)" }}
          transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image src={photo.src} alt="" fill sizes="(min-width: 768px) 30vw, 46vw" className="object-cover" />
        </motion.span>
        {/* L'éclair : une seule fois, à l'entrée. */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="club-flash__burst"
            initial={false}
            animate={seen ? { opacity: [0, 0.75, 0] } : { opacity: 0 }}
            transition={{ duration: 0.55, times: [0, 0.12, 1], ease: "easeOut" }}
          />
        )}
      </button>
    </li>
  );
}

"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GalleryLightbox, type LightboxHouse } from "@/components/gallery/GalleryLightbox";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { useHydrated, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/mexicana.css";

/** Reduced motion : valeur fixe explicite. */
const STILL = { clipPath: "inset(0% 0% 0% 0%)" };

/**
 * La casa : les photos de la maison dans des niches peintes, comme un
 * retablo — cadres rouge, ocre, vert et crème, légèrement de biais. Chaque
 * photo se « peint » de bas en haut en entrant à l'écran (liée au
 * défilement) ; clic : visionneuse. Reduced motion : photos visibles.
 */
export function MexicanaCasa({ name, photos, house }: { name: string; photos: GalleryPhoto[]; house: LightboxHouse & { slug: string } }) {
  const t = useTranslations("mexicana");
  const tFiliale = useTranslations("filiale");
  const hydrated = useHydrated();
  const openerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  if (photos.length === 0) return null;

  return (
    <section id="galerie" aria-labelledby="mexicana-casa-title" data-surface="dark" className="mx-casa scroll-mt-6">
      <div className="mx-casa__inner">
        <header className="mx-casa__head">
          <p className="mx-eyebrow">{t("casaEyebrow")}</p>
          <h2 id="mexicana-casa-title" className="mx-title">
            {t("casaTitle")}
          </h2>
          <p className="mx-casa__lead">{t("casaLead")}</p>
        </header>

        <ul aria-label={tFiliale("galleryList", { name })} className="mx-casa__grid">
          {photos.map((photo, index) => (
            <Niche
              key={photo.id}
              photo={photo}
              index={index}
              onOpen={(opener) => {
                openerRef.current = opener;
                setOpen(index);
              }}
            />
          ))}
        </ul>
      </div>

      {hydrated &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <GalleryLightbox
                key="mexicana-lightbox"
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
    </section>
  );
}

function Niche({ photo, index, onOpen }: { photo: GalleryPhoto; index: number; onOpen: (opener: HTMLElement) => void }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.45"] });
  const clipPath = useTransform(scrollYProgress, (v) => `inset(${((1 - Math.min(1, v * 1.15)) * 100).toFixed(2)}% 0% 0% 0%)`);

  return (
    <li ref={ref} className={`mx-niche mx-niche--${index % 4}`}>
      <button type="button" aria-label={photo.alt} className="mx-niche__button" onClick={(event) => onOpen(event.currentTarget)}>
        <motion.span className="mx-niche__photo" style={reduced ? STILL : { clipPath }}>
          <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
        </motion.span>
      </button>
    </li>
  );
}

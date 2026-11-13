"use client";

import { AnimatePresence, motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GalleryLightbox, type LightboxHouse } from "@/components/gallery/GalleryLightbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { useHydrated, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/filiale-blocks.css";

/**
 * Photos de la maison en deux rangées qui glissent en sens contraire au
 * défilement de la page (K Lounge) : liées au défilement, jamais en boucle
 * automatique. Chaque rangée parcourt toute sa longueur pendant le passage de
 * la section, toutes les photos défilent donc à l'écran, sur mobile aussi.
 * Clic : visionneuse. Reduced motion : rangées fixes, défilables au doigt.
 */
export function FilialeGalleryDrift({
  name,
  photos,
  house,
  tone = "light",
}: {
  name: string;
  photos: GalleryPhoto[];
  house: LightboxHouse & { slug: string };
  tone?: "dark" | "light";
}) {
  const t = useTranslations("filiale");
  const hydrated = useHydrated();
  const reduced = useReducedMotionSafe();
  const rowsRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: rowsRef, offset: ["start end", "end start"] });

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  if (photos.length === 0) return null;

  // Une photo sur deux par rangée : l'ordre de la visionneuse reste celui de la maison.
  const indexed = photos.map((photo, index) => ({ photo, index }));
  const rows = [indexed.filter((_, i) => i % 2 === 0), indexed.filter((_, i) => i % 2 === 1)].filter((row) => row.length > 0);

  const onOpen = (index: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setOpen(index);
  };

  return (
    <div className={`filiale-drift ${tone === "light" ? "filiale-drift--light" : ""}`}>
      <SectionHeading
        look="editorial"
        eyebrow={t("galleryEyebrow")}
        title={t("galleryTitle", { name })}
        sweep={name}
        titleAs="h2"
        titleId="filiale-gallery-title"
        tone={tone}
        align="left"
        className="filiale-drift__head mb-10! md:mb-14!"
      />

      <div ref={rowsRef} aria-label={t("galleryList", { name })} role="group" className={`filiale-drift__rows ${reduced ? "is-static" : ""}`}>
        {rows.map((row, r) => (
          <DriftRow key={r} items={row} reverse={r % 2 === 1} progress={scrollYProgress} reduced={reduced} onOpen={onOpen} />
        ))}
      </div>

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
    </div>
  );
}

/** Reduced motion : position fixe explicite (pas de reste de translation). */
const STILL = { x: 0 };

function DriftRow({
  items,
  reverse,
  progress,
  reduced,
  onOpen,
}: {
  items: { photo: GalleryPhoto; index: number }[];
  reverse: boolean;
  progress: MotionValue<number>;
  reduced: boolean;
  onOpen: (index: number, opener: HTMLElement) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  // Valeur animée (et non état) : la transformation suit la mesure sans nouveau rendu.
  const overflow = useMotionValue(0);

  // Course de la rangée = ce qui dépasse de l'écran (remesurée au redimensionnement).
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => overflow.set(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [overflow]);

  // Course faite entre l'entrée et la sortie des rangées (marges de 15 %).
  const x = useTransform(() => {
    const k = Math.min(1, Math.max(0, (progress.get() - 0.15) / 0.7));
    const distance = overflow.get();
    return reverse ? -distance * (1 - k) : -distance * k;
  });

  return (
    <div ref={viewportRef} className="filiale-drift__viewport">
      <motion.ul ref={trackRef} className="filiale-drift__track" style={reduced ? STILL : { x }}>
        {items.map(({ photo, index }) => (
          <li key={photo.id} className="filiale-drift__item">
            <button type="button" onClick={(event) => onOpen(index, event.currentTarget)} aria-label={photo.alt} className="filiale-drift__button">
              <Image src={photo.src} alt="" fill sizes="(max-width: 767px) 40vw, 18vw" className="object-cover" />
            </button>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GalleryLightbox, type LightboxHouse } from "@/components/gallery/GalleryLightbox";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Button } from "@/components/ui/Button";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { keyframes } from "@/lib/motion";
import { useHydrated } from "@/lib/use-media-query";

import "@/styles/olive.css";

/** Cellule de la grille, en part d'écran (doit suivre --olive-cell dans olive.css). */
const CELL = 0.22;
/** Agrandissement qui fait remplir l'écran à la cellule du milieu. */
const FILL = 1 / CELL;
/** Décalage initial de la grille vers le bas (part d'écran), pour laisser le titre au-dessus. */
const SHIFT = 0.14;
/** Rendu statique : valeurs fixes explicites. */
const STILL_GRID = { scale: 1, y: 0 };
const STILL_FADE = { opacity: 1 };

/**
 * L'album de la maison : neuf photos en grille, épinglées ; au défilement,
 * la grille s'agrandit autour de la photo du milieu jusqu'à ce qu'elle
 * remplisse l'écran — on entre dans la photo —, puis la légende et
 * « Voir les N photos » apparaissent. Visionneuse sur toutes les photos.
 * Reduced motion : grille fixe, légende dessous, section non épinglée.
 */
export function OliveAlbum({
  name,
  photos,
  grid,
  house,
}: {
  name: string;
  /** Toutes les photos (visionneuse). */
  photos: GalleryPhoto[];
  /** Les neuf de la grille, la 5ᵉ au milieu. */
  grid: GalleryPhoto[];
  house: LightboxHouse & { slug: string };
}) {
  const hydrated = useHydrated();
  const openerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  if (grid.length === 0) return null;

  return (
    <>
      <StickyTrack lengthVh={280} mobileLengthVh={230} surface="dark" id="galerie" ariaLabelledby="olive-album-title" className="olive-album-track">
        <AlbumStage
          name={name}
          grid={grid}
          total={photos.length}
          onOpen={(index, opener) => {
            openerRef.current = opener;
            setOpen(index);
          }}
          photoIndex={(photo) => Math.max(0, photos.findIndex((p) => p.src === photo.src))}
        />
      </StickyTrack>

      {hydrated &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <GalleryLightbox
                key="olive-lightbox"
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

function AlbumStage({
  name,
  grid,
  total,
  onOpen,
  photoIndex,
}: {
  name: string;
  grid: GalleryPhoto[];
  total: number;
  onOpen: (index: number, opener: HTMLElement | null) => void;
  photoIndex: (photo: GalleryPhoto) => number;
}) {
  const t = useTranslations("olive");
  const tFiliale = useTranslations("filiale");
  const { progress, isStatic } = useStickyTrack();
  const allRef = useRef<HTMLSpanElement>(null);

  // 0 → 0,12 : la grille ; 0,12 → 0,7 : on entre dans la photo ; puis la légende.
  const scale = useTransform(progress, (v) => keyframes(v, [0.12, 0.7], [1, FILL]));
  // La grille part sous le titre et remonte au centre en s'agrandissant.
  const y = useTransform(progress, (v) =>
    typeof window === "undefined" ? 0 : keyframes(v, [0.12, 0.7], [SHIFT * window.innerHeight, 0]),
  );
  const headOpacity = useTransform(progress, (v) => keyframes(v, [0.08, 0.28], [1, 0]));
  const captionOpacity = useTransform(progress, (v) => keyframes(v, [0.68, 0.82], [0, 1]));

  return (
    <div className={`olive-album ${isStatic ? "is-static" : ""}`}>
      <motion.header className="olive-album__head" style={isStatic ? STILL_FADE : { opacity: headOpacity }}>
        <p className="olive-eyebrow">{t("albumEyebrow")}</p>
        <h2 id="olive-album-title" className="olive-title">
          {tFiliale("galleryTitle", { name })}
        </h2>
        {!isStatic && (
          <p aria-hidden="true" className="olive-album__hint">
            {t("albumHint")}
          </p>
        )}
      </motion.header>

      {/* Calque qui rogne la grille agrandie : sans lui, la scène paraîtrait
          plus haute que l'écran et la piste se désépinglerait. */}
      <div className="olive-album__viewport">
      <motion.ul aria-label={tFiliale("galleryList", { name })} className="olive-album__grid" style={isStatic ? STILL_GRID : { scale, y }}>
        {grid.slice(0, 9).map((photo, index) => (
          <li key={photo.id} className={`olive-album__cell ${index === 4 ? "is-center" : ""}`}>
            <button
              type="button"
              aria-label={photo.alt}
              className="olive-album__button"
              onClick={(event) => onOpen(photoIndex(photo), event.currentTarget)}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes={index === 4 ? "100vw" : "(min-width: 1024px) 28vw, 30vw"}
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </motion.ul>
      </div>

      <motion.div className="olive-album__caption" style={isStatic ? STILL_FADE : { opacity: captionOpacity }}>
        <p className="olive-album__caption-text">{t("albumCaption")}</p>
        <span ref={allRef}>
          <Button onClick={() => onOpen(0, allRef.current?.querySelector("button") ?? null)}>
            {tFiliale("galleryAll", { count: total })}
          </Button>
        </span>
      </motion.div>
    </div>
  );
}

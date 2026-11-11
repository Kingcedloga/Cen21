"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";

import { GalleryLightbox, type LightboxHouse } from "@/components/gallery/GalleryLightbox";
import { RevealCard } from "@/components/motion/RevealCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { useHydrated } from "@/lib/use-media-query";

import "@/styles/filiale-blocks.css";

/**
 * Photos de la maison en bande horizontale (remplace les bandeaux en boucle
 * infinie, interdits) : défilement natif au doigt et au trackpad, glisser à
 * la souris, flèches ; révélation au défilement ; visionneuse au clic.
 */
export function FilialeGalleryStrip({
  name,
  photos,
  house,
}: {
  name: string;
  photos: GalleryPhoto[];
  house: LightboxHouse & { slug: string };
}) {
  const t = useTranslations("filiale");
  const hydrated = useHydrated();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  if (photos.length === 0) return null;

  const scrollBy = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: "smooth" });
  };

  // Glisser à la souris (au doigt, le défilement natif suffit).
  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { down: true, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const state = drag.current;
    if (!state.down) return;
    const dx = event.clientX - state.startX;
    if (Math.abs(dx) > 5) state.moved = true;
    event.currentTarget.scrollLeft = state.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
  };
  // Après un glisser, le clic qui suit n'ouvre pas la visionneuse.
  const onClickCapture = (event: MouseEvent) => {
    if (!drag.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.moved = false;
  };

  return (
    <div className="filiale-strip">
      <div className="filiale-strip__head">
        <SectionHeading
          look="editorial"
          eyebrow={t("galleryEyebrow")}
          title={t("galleryTitle", { name })}
          sweep={name}
          titleAs="h2"
          titleId="filiale-gallery-title"
          align="left"
          className="mb-0!"
        />
        <div className="filiale-strip__arrows">
          <button type="button" onClick={() => scrollBy(-1)} aria-label={t("galleryPrev")} className="filiale-round tap-press">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label={t("galleryNext")} className="filiale-round tap-press">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        aria-label={t("galleryList", { name })}
        className="filiale-strip__track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        {photos.map((photo, index) => (
          <li key={photo.id} className="filiale-strip__item">
            <RevealCard index={index} className="filiale-strip__card">
              <button
                type="button"
                draggable={false}
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setOpen(index);
                }}
                aria-label={photo.alt}
                className="filiale-strip__button"
              >
                <Image src={photo.src} alt="" fill draggable={false} sizes="(max-width: 767px) 72vw, 28vw" className="object-cover" />
              </button>
            </RevealCard>
          </li>
        ))}
      </ul>

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

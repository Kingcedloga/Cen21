"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ArrowLeft, ArrowRight, ShoppingCart, X } from "@/lib/icons";
import { cormorant } from "@/lib/fonts";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { SubsidiaryMuzikGallerySection } from "@/lib/types";

import "@/styles/muzik-cafe-gallery-section.css";

const CARD_STEP = 300;

type Props = {
  content: SubsidiaryMuzikGallerySection;
};

export function MuzikCafeGallerySection({ content }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const trackRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const n = content.items.length;

  const scroll = useCallback(
    (delta: number) => {
      trackRef.current?.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + n) % n : null)),
    [n],
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % n : null)),
    [n],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, close, prev, next]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  const activeItem = lightboxIndex !== null ? content.items[lightboxIndex] : null;

  return (
    <section className={`muzik-gallery ${cormorant.variable}`}>
      <AnimateIn className="muzik-gallery__header">
        <h2 className="muzik-gallery__title">{content.title}</h2>
      </AnimateIn>

      <div className="muzik-gallery__row">
        <div className="muzik-gallery__nav muzik-gallery__nav--prev">
          <button
            type="button"
            className="muzik-gallery__nav-btn"
            aria-label={t("muzikCafeGallery.previousDishes")}
            onClick={() => scroll(-CARD_STEP)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <span className="muzik-gallery__nav-line" aria-hidden="true" />
        </div>

        <div className="muzik-gallery__track" ref={trackRef}>
          {content.items.map((item, i) => (
            <motion.div
              key={item.name}
              className="muzik-gallery__card"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={defaultScrollViewport}
              transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.06 }}
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="muzik-gallery__photo"
                sizes="(max-width: 767px) 60vw, 18vw"
              />
              <div className="muzik-gallery__overlay" aria-hidden="true">
                <span className="muzik-gallery__name">{item.name}</span>
                <span className="muzik-gallery__price">{item.price}</span>
              </div>
              <button
                type="button"
                className="muzik-gallery__cart"
                aria-label={t("muzikCafeGallery.addToOrder", { name: item.name })}
                onClick={(e) => e.stopPropagation()}
              >
                <ShoppingCart size={16} weight="fill" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="muzik-gallery__nav muzik-gallery__nav--next">
          <span className="muzik-gallery__nav-line" aria-hidden="true" />
          <button
            type="button"
            className="muzik-gallery__nav-btn"
            aria-label={t("muzikCafeGallery.nextDishes")}
            onClick={() => scroll(CARD_STEP)}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && activeItem && (
          <motion.div
            className="muzik-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE.luxury }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.imageAlt}
          >
            {/* Cadre photo */}
            <motion.div
              className="muzik-lightbox__frame"
              initial={reduced ? false : { scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? undefined : { scale: 0.9, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.48, ease: EASE.luxury }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="muzik-lightbox__image-wrap">
                <Image
                  src={activeItem.image}
                  alt={activeItem.imageAlt}
                  fill
                  className="muzik-lightbox__image"
                  sizes="(max-width: 767px) 95vw, 70vw"
                  priority
                />
              </div>
              <div className="muzik-lightbox__meta">
                <span className="muzik-lightbox__meta-name">{activeItem.name}</span>
                <span className="muzik-lightbox__meta-price">{activeItem.price}</span>
              </div>
            </motion.div>

            {/* Flèches */}
            <button
              type="button"
              className="muzik-lightbox__arrow muzik-lightbox__arrow--prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label={t("muzikCafeGallery.previousDishes")}
            >
              <ArrowLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="muzik-lightbox__arrow muzik-lightbox__arrow--next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label={t("muzikCafeGallery.nextDishes")}
            >
              <ArrowRight size={22} aria-hidden="true" />
            </button>

            {/* Fermer */}
            <button
              type="button"
              className="muzik-lightbox__close"
              onClick={close}
              aria-label="Fermer"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {/* Compteur */}
            <p
              className="muzik-lightbox__counter"
              aria-live="polite"
              aria-atomic="true"
            >
              {lightboxIndex + 1} / {n}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

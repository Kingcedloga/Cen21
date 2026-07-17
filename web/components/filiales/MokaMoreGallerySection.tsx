"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ArrowLeft, ArrowRight, X } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/moka-more-gallery-section.css";

const AUTO_SCROLL_INTERVAL_MS = 3000;
const SCROLL_STEP_PX = 280;

type Props = {
  photos: string[];
};

export function MokaMoreGallerySection({ photos }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const n = photos.length;

  const stopAutoScroll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (reduced || timerRef.current) return;
    timerRef.current = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + SCROLL_STEP_PX,
        behavior: "smooth",
      });
    }, AUTO_SCROLL_INTERVAL_MS);
  }, [reduced]);

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [startAutoScroll, stopAutoScroll]);

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

  return (
    <section className="moka-gallery">
      <AnimateIn className="moka-gallery__header">
        <h2 className="moka-gallery__title">
          {t("mokaMoreGallery.titlePrefix")}{" "}
          <span className="moka-gallery__title-script">{t("mokaMoreGallery.titleScript")}</span>
        </h2>
        <p className="moka-gallery__description">{t("mokaMoreGallery.description")}</p>
      </AnimateIn>

      <motion.span
        className="moka-gallery__watermark"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 0.06 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.1 }}
      >
        {t("mokaMoreGallery.watermark")}
      </motion.span>

      <div
        className="moka-gallery__track"
        ref={trackRef}
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
        onFocus={stopAutoScroll}
        onBlur={startAutoScroll}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={photo + i}
            className={`moka-gallery__item moka-gallery__item--${i % 4}`}
            role="button"
            tabIndex={0}
            aria-label={t("mokaMoreGallery.viewAria")}
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.07 }}
            onClick={() => setLightboxIndex(i)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightboxIndex(i); }}
          >
            <Image
              src={photo}
              alt=""
              fill
              className="moka-gallery__photo"
              sizes="(max-width: 767px) 60vw, 22vw"
            />
            <span className="moka-gallery__overlay" aria-hidden="true" />
          </motion.div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="moka-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE.luxury }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={t("mokaMoreGallery.viewAria")}
          >
            <motion.div
              className="moka-lightbox__frame"
              initial={reduced ? false : { scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? undefined : { scale: 0.9, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: EASE.luxury }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="moka-lightbox__image-wrap">
                <Image
                  src={photos[lightboxIndex]}
                  alt=""
                  fill
                  className="moka-lightbox__image"
                  sizes="(max-width: 767px) 95vw, 70vw"
                  priority
                />
              </div>
            </motion.div>

            <button
              type="button"
              className="moka-lightbox__arrow moka-lightbox__arrow--prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label={t("mokaMoreGallery.prev")}
            >
              <ArrowLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="moka-lightbox__arrow moka-lightbox__arrow--next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label={t("mokaMoreGallery.next")}
            >
              <ArrowRight size={22} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="moka-lightbox__close"
              onClick={close}
              aria-label={t("mokaMoreGallery.close")}
            >
              <X size={20} aria-hidden="true" />
            </button>

            <p className="moka-lightbox__counter" aria-live="polite" aria-atomic="true">
              {lightboxIndex + 1} / {n}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

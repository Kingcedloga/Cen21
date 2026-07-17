"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { IconInstagram } from "@/components/ui/SocialLinks";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/moka-more-gallery-section.css";

const AUTO_SCROLL_INTERVAL_MS = 3000;
const SCROLL_STEP_PX = 280;

type Props = {
  photos: string[];
  instagramUrl?: string;
};

export function MokaMoreGallerySection({ photos, instagramUrl }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          <motion.a
            key={photo + i}
            className={`moka-gallery__item moka-gallery__item--${i % 4}`}
            href={instagramUrl ?? "#"}
            target={instagramUrl ? "_blank" : undefined}
            rel={instagramUrl ? "noopener noreferrer" : undefined}
            aria-label={t("mokaMoreGallery.viewAria")}
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.07 }}
          >
            <Image
              src={photo}
              alt=""
              fill
              className="moka-gallery__photo"
              sizes="(max-width: 767px) 60vw, 22vw"
            />
            <span className="moka-gallery__overlay" aria-hidden="true">
              <IconInstagram className="moka-gallery__overlay-icon" />
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

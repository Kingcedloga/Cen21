"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";

import { cormorant } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import { fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import type { SubsidiaryAboutSlide, SubsidiaryHeroSection } from "@/lib/types";

import "@/styles/wabi-sabi-hero.css";

type Props = {
  name: string;
  hero: SubsidiaryHeroSection;
  backgroundVideo?: {
    src: string;
    webm?: string;
    poster?: string;
  };
};

const DEFAULT_INTERVAL_MS = 6000;
const SWIPE_THRESHOLD_PX = 48;

function resolveSlides(hero: SubsidiaryHeroSection): SubsidiaryAboutSlide[] {
  const fromSlides = (hero.slides ?? []).filter((slide) => slide.src);
  if (fromSlides.length > 0) return fromSlides;
  return [{ src: hero.image, alt: hero.imageAlt }];
}

export function WabiSabiHero({ name, hero, backgroundVideo }: Props) {
  const reduced = useReducedMotion() ?? false;
  const slides = resolveSlides(hero);
  const intervalMs = hero.slideIntervalMs ?? DEFAULT_INTERVAL_MS;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const len = slides.length;
  const safeIndex = len ? index % len : 0;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!len) return;
      setIndex((nextIndex + len) % len);
    },
    [len],
  );

  const next = useCallback(() => {
    goTo(safeIndex + 1);
  }, [goTo, safeIndex]);

  const prev = useCallback(() => {
    goTo(safeIndex - 1);
  }, [goTo, safeIndex]);

  useEffect(() => {
    if (reduced || len <= 1) return;
    const timer = window.setInterval(next, intervalMs);
    return () => window.clearInterval(timer);
  }, [reduced, len, next, intervalMs]);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || len <= 1) return;
    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;

    const delta = touchStartX.current - endX;
    touchStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta > 0) next();
    else prev();
  };

  const useVideo =
    Boolean(backgroundVideo?.src) && !reduced && len <= 1 && !(hero.slides?.length ?? 0);
  const poster = backgroundVideo?.poster ?? slides[0]?.src ?? hero.image;

  const cardMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: fadeUpVariants,
        transition: { ...fadeUpTransition, delay: 0.06 },
      };

  return (
    <header className={`wabi-sabi-hero ${cormorant.variable}`}>
      <div className="wabi-sabi-hero__backdrop" aria-hidden>
        <span className="wabi-sabi-hero__texture" />
        <span className="wabi-sabi-hero__grain" />
        <span className="wabi-sabi-hero__glow wabi-sabi-hero__glow--tl" />
        <span className="wabi-sabi-hero__glow wabi-sabi-hero__glow--br" />
      </div>

      <div className="wabi-sabi-hero__inner">
        <h1 className="sr-only">{name}</h1>

        <motion.div className="wabi-sabi-hero__card" {...cardMotion}>
          <div
            className="wabi-sabi-hero__frame"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {useVideo ? (
              <video
                className="wabi-sabi-hero__media wabi-sabi-hero__media--video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={poster}
                aria-label={hero.imageAlt}
              >
                {backgroundVideo?.webm ? (
                  <source src={backgroundVideo.webm} type="video/webm" />
                ) : null}
                <source src={backgroundVideo!.src} type="video/mp4" />
              </video>
            ) : (
              <div
                className="wabi-sabi-hero__slideshow"
                aria-live="polite"
                aria-atomic="true"
                aria-label={name}
              >
                {slides.map((slide, slideIndex) => (
                  <div
                    key={`${slide.src}-${slideIndex}`}
                    className={[
                      "wabi-sabi-hero__slide",
                      slideIndex === safeIndex ? "wabi-sabi-hero__slide--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden={slideIndex !== safeIndex}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={slideIndex === 0}
                      placeholder="blur"
                      blurDataURL={BLUR_PETROL}
                      className="wabi-sabi-hero__media"
                      sizes="(max-width: 767px) 96vw, (max-width: 1200px) 92vw, 104rem"
                      quality={92}
                    />
                  </div>
                ))}
              </div>
            )}

            <span className="wabi-sabi-hero__frame-shine" aria-hidden />
            <span className="wabi-sabi-hero__frame-vignette" aria-hidden />
          </div>
        </motion.div>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { galleryEntrySrc } from "@/lib/gallery-categories";
import { DURATION_S, EASE, fadeUpVariants, heroStaggerVariants } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/pinkberry-hero.css";

export function PinkberryHero({ subsidiary }: { subsidiary: Subsidiary }) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const sectionRef = useRef<HTMLElement>(null);

  const images = [
    subsidiary.coverImage,
    ...subsidiary.galleryImages.map(galleryEntrySrc),
  ].filter((src, i, arr) => arr.indexOf(src) === i);

  const [active, setActive] = useState(0);
  const go = useCallback(
    (delta: number) => setActive((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  const scrollToNext = useCallback(() => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [reduced]);

  return (
    <section ref={sectionRef} className="pinkberry-hero" aria-label={subsidiary.name}>
      <div className="pinkberry-hero__circles" aria-hidden="true">
        <motion.span
          className="pinkberry-hero__circle"
          initial={reduced ? false : { opacity: 0, scale: 0.8 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: DURATION_S.base, ease: EASE.luxury, delay: 0.2 }}
        />
        <motion.span
          className="pinkberry-hero__circle pinkberry-hero__circle--2"
          initial={reduced ? false : { opacity: 0, scale: 0.8 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: DURATION_S.base, ease: EASE.luxury, delay: 0.28 }}
        />
      </div>

      <div className="pinkberry-hero__dots" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="pinkberry-hero__dot">
            +
          </span>
        ))}
      </div>

      <div className="pinkberry-hero__content">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate={reduced ? undefined : "visible"}
          variants={reduced ? undefined : heroStaggerVariants}
        >
          <motion.h1
            className="pinkberry-hero__title"
            variants={reduced ? undefined : fadeUpVariants}
          >
            {subsidiary.name}
          </motion.h1>
          <motion.p
            className="pinkberry-hero__tagline"
            variants={reduced ? undefined : fadeUpVariants}
          >
            {subsidiary.tagline}
          </motion.p>
          <motion.div variants={reduced ? undefined : fadeUpVariants}>
            <button type="button" className="pinkberry-hero__cta" onClick={scrollToNext}>
              {t("pinkberryHero.cta")}
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="pinkberry-hero__visual"
          initial={reduced ? false : { opacity: 0, x: 40 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.15 }}
        >
          <Image
            key={images[active]}
            src={images[active]}
            alt={subsidiary.name}
            fill
            priority
            className="pinkberry-hero__image"
            sizes="(max-width: 767px) 70vw, (max-width: 1023px) 40vw, 26rem"
          />
        </motion.div>
      </div>

      {images.length > 1 && (
        <div className="pinkberry-hero__nav">
          <button
            type="button"
            className="pinkberry-hero__nav-btn"
            aria-label={t("pinkberryHero.previousVisual")}
            onClick={() => go(-1)}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="pinkberry-hero__nav-btn"
            aria-label={t("pinkberryHero.nextVisual")}
            onClick={() => go(1)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

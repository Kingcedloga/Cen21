"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { ArrowLeft, ArrowRight } from "@/lib/icons";
import { DURATION_S, EASE } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/moka-more-hero.css";

const MAIN_PHOTO = "/filiales/photos/filiale-06/main-photo.png";
const SECONDARY_PHOTO = "/filiales/photos/filiale-06/secondary-photo.png";

export function MokaMoreHero({ subsidiary }: { subsidiary: Subsidiary }) {
  const reduced = useReducedMotion() ?? false;
  const t = useTranslations("subsidiaries");
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNext = useCallback(() => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [reduced]);

  const textItemMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.08 },
        };

  return (
    <section ref={sectionRef} className="moka-hero" aria-label={subsidiary.name}>
      <div className="moka-hero__texture" aria-hidden="true" />
      <span className="moka-hero__divider" aria-hidden="true" />

      <motion.svg
        className="moka-hero__motif"
        viewBox="0 0 200 140"
        fill="none"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 0.3 }}
        transition={{ duration: 0.6, ease: EASE.luxury, delay: 0.3 }}
      >
        <path
          d="M8 92c22-42 62-42 72 0s46 46 62-8"
          stroke="#CC0000"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M148 12l12 22" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
        <path d="M172 8l7 28" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
      </motion.svg>

      <div className="moka-hero__content">
        <div className="moka-hero__text">
          <motion.p className="moka-hero__eyebrow" {...textItemMotion(0)}>
            {t("mokaMoreHero.eyebrow")}
          </motion.p>
          <motion.h1 className="moka-hero__title" {...textItemMotion(1)}>
            {t("mokaMoreHero.title")}
          </motion.h1>
          <motion.div {...textItemMotion(2)}>
            <button type="button" className="moka-hero__cta" onClick={scrollToNext}>
              {t("mokaMoreHero.ctaLabel")}
            </button>
          </motion.div>

          <motion.div className="moka-hero__nav" {...textItemMotion(3)}>
            <button
              type="button"
              className="moka-hero__nav-btn"
              aria-label={t("mokaMoreHero.previousVisual")}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <span className="moka-hero__nav-divider" aria-hidden="true" />
            <button
              type="button"
              className="moka-hero__nav-btn"
              aria-label={t("mokaMoreHero.nextVisual")}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </motion.div>
        </div>

        <div className="moka-hero__visual">
          <motion.div
            className="moka-hero__main-photo-wrap"
            initial={reduced ? false : { opacity: 0, x: 60 }}
            animate={reduced ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.15 }}
          >
            <Image
              src={MAIN_PHOTO}
              alt={subsidiary.name}
              fill
              priority
              className="moka-hero__main-photo"
              sizes="(max-width: 767px) 90vw, 48vw"
            />
          </motion.div>

          <motion.div
            className="moka-hero__secondary-photo-wrap"
            initial={reduced ? false : { opacity: 0, y: 30, scale: 0.9 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.4 }}
          >
            <Image
              src={SECONDARY_PHOTO}
              alt={subsidiary.name}
              fill
              className="moka-hero__secondary-photo"
              sizes="(max-width: 767px) 40vw, 14rem"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

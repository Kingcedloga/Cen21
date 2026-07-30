"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { DURATION_S, EASE } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/moka-more-hero.css";

const MAIN_PHOTO = "/filiales/photos/filiale-06/main-photo.png";

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

      {/* Motif calligraphique — coin haut droit */}
      <motion.div
        className="moka-hero__motif"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={reduced ? undefined : { duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.3 }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -6, 0] }}
          transition={reduced ? undefined : { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 1.0 }}
        >
          <svg viewBox="0 0 200 140" fill="none" style={{ width: "100%", height: "100%" }}>
            <path d="M8 92c22-42 62-42 72 0s46 46 62-8" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
            <path d="M148 12l12 22" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
            <path d="M172 8l7 28" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Grille de points — coin bas gauche */}
      <motion.div
        className="moka-hero__motif-dots"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={reduced ? undefined : { duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.45 }}
      >
        <motion.div
          style={{ width: "100%", height: "100%" }}
          animate={reduced ? undefined : { y: [0, -5, 0] }}
          transition={reduced ? undefined : { duration: 3.5, ease: "easeInOut", repeat: Infinity, delay: 1.15 }}
        />
      </motion.div>

      {/* Cercle outline — milieu gauche */}
      <motion.div
        className="moka-hero__motif-circle"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={reduced ? undefined : { duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.6 }}
      >
        <motion.div
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          animate={reduced ? undefined : { y: [0, -7, 0] }}
          transition={reduced ? undefined : { duration: 4.5, ease: "easeInOut", repeat: Infinity, delay: 1.3 }}
        />
      </motion.div>

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

        </div>

        <div className="moka-hero__visual">
          <div className="moka-hero__photo-loop">
            <div className="moka-hero__main-photo-wrap">
              <Image
                src={MAIN_PHOTO}
                alt={subsidiary.name}
                fill
                priority
                className="moka-hero__main-photo"
                sizes="(max-width: 767px) 90vw, 48vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

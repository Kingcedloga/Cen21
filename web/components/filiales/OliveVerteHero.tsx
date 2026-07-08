"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { Play } from "@/lib/icons";
import { DURATION_S, EASE } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/olive-verte-hero.css";

const PHOTO_SRC = "/filiales/photos/filiale-01/plat-cutout.png";

const MOTIF_SHAPES = ["circle", "dot", "wave"] as const;

const MOTIF_POSITIONS = [
  { x: "4%", y: "18%" },
  { x: "18%", y: "8%" },
  { x: "8%", y: "42%" },
  { x: "40%", y: "6%" },
  { x: "3%", y: "68%" },
  { x: "14%", y: "88%" },
  { x: "34%", y: "72%" },
  { x: "51%", y: "18%" },
  { x: "6%", y: "94%" },
  { x: "25%", y: "58%" },
  { x: "45%", y: "42%" },
  { x: "31%", y: "28%" },
  { x: "56%", y: "68%" },
  { x: "43%", y: "92%" },
  { x: "22%", y: "12%" },
] as const;

export function OliveVerteHero({ subsidiary }: { subsidiary: Subsidiary }) {
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
    <section ref={sectionRef} className="olive-hero" aria-label={subsidiary.name}>
      {/* Motifs décoratifs dispersés : cercles creux, points, lignes ondulées */}
      <div className="olive-hero__motifs" aria-hidden="true">
        {MOTIF_POSITIONS.map((pos, i) => {
          const shape = MOTIF_SHAPES[i % MOTIF_SHAPES.length];
          return (
            <motion.span
              key={i}
              className={`olive-hero__motif olive-hero__motif--${shape}`}
              style={{ left: pos.x, top: pos.y }}
              initial={reduced ? false : { opacity: 0, scale: 0.6 }}
              animate={
                reduced
                  ? undefined
                  : { opacity: 1, scale: 1, y: [0, -6, 0] }
              }
              transition={{
                opacity: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                scale:   { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                y: {
                  delay: i * 0.08 + 0.4,
                  duration: 3.2 + (i % 4) * 0.3,
                  ease: "easeInOut",
                  repeat: Infinity,
                },
              }}
            >
              {shape === "wave" && (
                <svg viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path
                    d="M1 10c5-9 10-9 15 0s10 9 15 0 10-9 15 0 10 9 13 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </motion.span>
          );
        })}
      </div>

      <div className="olive-hero__content">
        {/* Colonne gauche : eyebrow → titre → description → CTA */}
        <div className="olive-hero__text">
          <motion.p className="olive-hero__eyebrow" {...textItemMotion(0)}>
            {t("oliveVerteHero.eyebrow")}
          </motion.p>
          <motion.h1 className="olive-hero__title" {...textItemMotion(1)}>
            {t("oliveVerteHero.title")}
          </motion.h1>
          <motion.p className="olive-hero__description" {...textItemMotion(2)}>
            {subsidiary.description}
          </motion.p>
          <motion.div className="olive-hero__actions" {...textItemMotion(3)}>
            <button type="button" className="olive-hero__cta-primary" onClick={scrollToNext}>
              {t("oliveVerteHero.ctaPrimary")}
            </button>
            <button type="button" className="olive-hero__cta-secondary" onClick={scrollToNext}>
              <span className="olive-hero__play" aria-hidden="true">
                <Play size={14} weight="fill" />
              </span>
              {t("oliveVerteHero.ctaSecondary")}
            </button>
          </motion.div>
        </div>

        {/* Colonne droite : photo détourée, débordant du cadre */}
        <motion.div
          className="olive-hero__visual"
          initial={reduced ? false : { opacity: 0, x: 60 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.15 }}
        >
          <Image
            src={PHOTO_SRC}
            alt={subsidiary.name}
            fill
            priority
            className="olive-hero__photo"
            sizes="(max-width: 767px) 90vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}

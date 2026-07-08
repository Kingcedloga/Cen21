"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { DURATION_S, EASE, fadeUpVariants, heroStaggerVariants } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/pinkberry-hero.css";

const SLIDE_COLORS = ["#E8427C", "#F4A7C3", "#FF6B6B", "#C84B8F"] as const;

const HERO_IMAGES = [
  "/filiales/photos/filiale-09/PBRY_Original_Logo_MilkPour.png",
  "/filiales/photos/filiale-09/PB_StrawberryCrunch.png",
  "/filiales/photos/filiale-09/PB_WaffleBowl.png",
  "/filiales/photos/filiale-09/PB_WildBlueberry_Topped.png",
] as const;

const MOTIF_POSITIONS = [
  { x: "5%",  y: "10%" },
  { x: "13%", y: "72%" },
  { x: "22%", y: "28%" },
  { x: "3%",  y: "55%" },
  { x: "30%", y: "88%" },
  { x: "18%", y: "44%" },
  { x: "43%", y: "7%"  },
  { x: "37%", y: "60%" },
  { x: "50%", y: "80%" },
  { x: "60%", y: "13%" },
  { x: "72%", y: "35%" },
  { x: "66%", y: "80%" },
  { x: "81%", y: "20%" },
  { x: "87%", y: "65%" },
  { x: "93%", y: "40%" },
  { x: "90%", y: "88%" },
  { x: "46%", y: "93%" },
  { x: "55%", y: "50%" },
  { x: "10%", y: "35%" },
  { x: "77%", y: "91%" },
] as const;

export function PinkberryHero({ subsidiary }: { subsidiary: Subsidiary }) {
  const reduced = useReducedMotion() ?? false;
  const t = useTranslations("subsidiaries");
  const sectionRef = useRef<HTMLElement>(null);

  const images = HERO_IMAGES;

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

  const bgColor = SLIDE_COLORS[active % SLIDE_COLORS.length];

  return (
    <section
      ref={sectionRef}
      className="pinkberry-hero"
      aria-label={subsidiary.name}
      style={{ backgroundColor: bgColor }}
    >
      {/* Motifs décoratifs dispersés sur tout le hero */}
      <div className="pinkberry-hero__motifs" aria-hidden="true">
        {MOTIF_POSITIONS.map((pos, i) => (
          <motion.span
            key={i}
            className="pinkberry-hero__motif"
            style={{ left: pos.x, top: pos.y }}
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={
              reduced
                ? undefined
                : { opacity: 1, scale: 1, y: [0, -5, 0] }
            }
            transition={{
              opacity: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              scale:   { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              y: {
                delay: i * 0.08 + 0.5,
                duration: 3.2 + (i % 5) * 0.4,
                ease: "easeInOut",
                repeat: Infinity,
              },
            }}
          >
            +
          </motion.span>
        ))}
      </div>

      <div className="pinkberry-hero__content">
        {/* Texte gauche */}
        <motion.div
          className="pinkberry-hero__text"
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

        {/* Visuel droit : cercles + photo produit */}
        <motion.div
          className="pinkberry-hero__visual"
          initial={reduced ? false : { opacity: 0, x: 40 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.15 }}
        >
          {/* Cercle extérieur — dashed, rotation lente */}
          <motion.span
            className="pinkberry-hero__circle"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          />
          {/* Cercle intérieur — pulsation scale */}
          <motion.span
            className="pinkberry-hero__circle pinkberry-hero__circle--2"
            animate={reduced ? undefined : { scale: [1, 1.05, 1] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          />
          {/* Photo produit — centrée dans le cercle, déborde en haut */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="pinkberry-hero__photo-wrap"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={images[active]}
                alt={subsidiary.name}
                fill
                priority={active === 0}
                className="pinkberry-hero__image"
                sizes="(max-width: 767px) 55vw, (max-width: 1023px) 38vw, 22rem"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation flèches */}
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

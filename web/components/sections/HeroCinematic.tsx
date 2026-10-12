"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { dynalight } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import {
  DURATION_S,
  EASE,
  fadeUpTransition,
  fadeUpVariants,
  heroStaggerVariants,
} from "@/lib/motion";

export type HeroSlide = {
  src: string;
  alt: string;
};

type HeroCinematicProps = {
  slides: HeroSlide[];
  siteName: string;
  className?: string;
};

const AUTO_MS = 7500;

export function HeroCinematic({ slides, siteName, className = "" }: HeroCinematicProps) {
  const t = useTranslations("hero");
  const tHome = useTranslations("home");
  const list = slides;

  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion() ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallaxe cinématique
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const len = list.length;
  const safeIndex = len ? index % len : 0;

  const next = useCallback(() => {
    setIndex((i) => (len ? (i + 1) % len : 0));
  }, [len]);

  const prev = useCallback(() => {
    setIndex((i) => (len ? (i - 1 + len) % len : 0));
  }, [len]);

  useEffect(() => {
    if (reducedMotion || len <= 1) return;
    const timer = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, len, next]);

  if (len === 0) {
    return (
      <section className="relative flex min-h-screen items-end bg-petrol px-6 pb-24 pt-36 md:pt-40">
        <h1 className="sr-only">{siteName}</h1>
        <div className="flex flex-wrap gap-4">
          <Button href="/filiales">{t("ctaSubsidiaries")}</Button>
          <Button href="/contact" variant="secondary">
            {t("ctaContact")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`relative flex min-h-[100dvh] w-full shrink-0 items-end overflow-hidden ${dynalight.variable} ${className}`}
    >
      {/* ── Background Slides avec Parallaxe & Ken Burns ── */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={reducedMotion ? undefined : { y: imageY, scale: imageScale }}
      >
        {list.map((slide, i) => {
          const isActive = i === safeIndex;
          return (
            <div
              key={`${slide.src}-${i}`}
              className={`absolute inset-0 h-[115%] -top-[7%] transition-opacity duration-hero-crossfade ease-out ${
                isActive ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <div className={`relative h-full w-full ${isActive && !reducedMotion ? "animate-ken-burns" : ""}`}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  placeholder="blur"
                  blurDataURL={BLUR_PETROL}
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ── Overlays Cinématiques Multi-Couches ── */}
      {/* 1. Gradient sombre vertical (lisibilité et ancrage bas) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-petrol via-petrol/60 to-petrol/25"
      />

      {/* 2. Gradient latéral gauche (contraste accru pour le texte) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-petrol/85 via-petrol/35 to-transparent"
      />

      {/* 3. Lueur dorée ambiante en coin inférieur gauche */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 z-[1] h-96 w-96 rounded-full bg-gold/10 blur-3xl"
      />

      {/* 4. Texture subtile de film noise */}
      <div aria-hidden className="noise-overlay z-[2]" />

      {/* ── Flèches de Navigation Slide (Desktop) ── */}
      {len > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-petrol/40 p-3.5 text-ivory/80 backdrop-blur-md transition-all duration-fine hover:border-gold/40 hover:bg-petrol/80 hover:text-gold hover:scale-105 active:scale-95 cursor-pointer hidden md:flex items-center justify-center shadow-lg"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-petrol/40 p-3.5 text-ivory/80 backdrop-blur-md transition-all duration-fine hover:border-gold/40 hover:bg-petrol/80 hover:text-gold hover:scale-105 active:scale-95 cursor-pointer hidden md:flex items-center justify-center shadow-lg"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* ── Contenu Principal Hero ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 pb-20 sm:pb-24 md:pb-28 pt-36 md:pt-48">
        <motion.div
          className="flex flex-col gap-6 md:gap-8 max-w-4xl"
          style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
          initial={reducedMotion ? false : "hidden"}
          animate={reducedMotion ? undefined : "visible"}
          variants={reducedMotion ? undefined : heroStaggerVariants}
        >
          {/* Eyebrow avec ornement signature */}
          <motion.div
            className="flex items-center gap-3"
            variants={reducedMotion ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            <span aria-hidden className="block h-px w-8 bg-gradient-to-r from-transparent to-gold" />
            <span aria-hidden className="inline-flex h-1.5 w-1.5 rotate-45 bg-gold shadow-[0_0_8px_rgba(212,173,101,0.6)]" />
            <p className="eyebrow text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-gold [font-family:var(--font-dynalight),cursive]">
              {t("tagline")}
            </p>
          </motion.div>

          {/* Statement Headline */}
          <motion.div
            variants={reducedMotion ? undefined : fadeUpVariants}
            transition={{ ...fadeUpTransition, delay: 0.08 }}
          >
            <h1 className="font-[family-name:var(--font-dm-sans)] text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold tracking-[-0.035em] leading-[1.02] text-ivory text-balance">
              Cen21{" "}
              <span className="text-gradient-gold italic font-normal [font-family:var(--font-dynalight),cursive] text-[1.12em] ml-1 sm:ml-2">
                Hospitality
              </span>
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-ivory/80 max-w-2xl leading-relaxed font-normal">
              {tHome("metaDescription")}
            </p>
          </motion.div>

          {/* Boutons d'Action */}
          <motion.div
            className="flex flex-wrap items-center gap-4 pt-2"
            variants={reducedMotion ? undefined : fadeUpVariants}
            transition={{ ...fadeUpTransition, delay: 0.16 }}
          >
            <Button
              href="/filiales"
              className="shadow-[0_12px_28px_-8px_rgba(212,173,101,0.35)] hover:shadow-[0_18px_36px_-6px_rgba(212,173,101,0.5)]"
            >
              {t("ctaSubsidiaries")}
            </Button>
            <Button href="/contact" variant="secondary">
              {t("ctaContact")}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Indicateur de Diaporama Élégant (Bottom-Right) ── */}
      {len > 1 && (
        <div className="absolute right-6 sm:right-10 md:right-14 bottom-8 sm:bottom-10 z-20 hidden sm:flex items-center gap-3 rounded-full border border-white/10 bg-petrol/40 px-4 py-2 backdrop-blur-md">
          <span className="font-mono text-xs font-semibold text-gold tracking-widest">
            {String(safeIndex + 1).padStart(2, "0")}
          </span>
          <div className="h-0.5 w-12 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              key={safeIndex}
              className="h-full bg-gold"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
            />
          </div>
          <span className="font-mono text-xs text-ivory/50 tracking-widest">
            {String(len).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* ── Scroll Cue Centré ── */}
      <button
        type="button"
        onClick={() => {
          const target = document.getElementById("home-group") ?? document.getElementById("nos-filiales");
          target?.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }}
        aria-label={t("scrollAria")}
        className="absolute bottom-6 sm:bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/70 transition-all duration-fine hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 cursor-pointer group"
      >
        <span className="text-[11px] font-medium tracking-[0.24em] uppercase text-ivory/60 group-hover:text-gold transition-colors">
          {t("scroll")}
        </span>
        <span
          aria-hidden
          className="relative flex h-10 w-6 items-center justify-center rounded-full border border-ivory/25 group-hover:border-gold/50 transition-colors"
        >
          <span className="animate-scroll-cue absolute top-1.5 h-2 w-1 rounded-full bg-gold" />
        </span>
      </button>
    </section>
  );
}

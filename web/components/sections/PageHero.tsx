"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Link } from "@/i18n/navigation";
import { dynalight } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import {
  DURATION_S,
  EASE,
  fadeUpTransition,
  fadeUpVariants,
  heroStaggerVariants,
} from "@/lib/motion";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Photo de fond — si fournie, bascule vers le format "page banner" (titre centré + fil d'Ariane). */
  image?: string;
  imageAlt?: string;
  homeLabel?: string;
  /** Libellé de la page courante dans le fil d'Ariane (ex. nav.events) — distinct de `eyebrow`. */
  currentPageLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  homeLabel,
  currentPageLabel,
}: PageHeroProps) {
  const reduced = useReducedMotion();

  if (image) {
    return (
      <section
        aria-labelledby="page-hero-title"
        className={`relative isolate flex min-h-[56vh] md:min-h-[64vh] items-center justify-center overflow-hidden bg-petrol py-24 md:py-32 ${dynalight.variable}`}
      >
        {/* Photo de fond avec Ken Burns */}
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury }}
        >
          <div className={`relative h-full w-full ${reduced ? "" : "animate-ken-burns"}`}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              placeholder="blur"
              blurDataURL={BLUR_PETROL}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Overlays cinématiques */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-petrol via-petrol/65 to-petrol/40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-petrol/70 via-transparent to-petrol/70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-48 w-full bg-gradient-to-t from-petrol via-petrol/80 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-gold/15 blur-3xl"
        />
        <div aria-hidden className="noise-overlay" />

        {/* Contenu textuel centré */}
        <motion.div
          className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center"
          initial={reduced ? false : "hidden"}
          animate={reduced ? undefined : "visible"}
          variants={reduced ? undefined : heroStaggerVariants}
        >
          {eyebrow && (
            <motion.div
              className="mb-4 flex items-center justify-center gap-3"
              variants={reduced ? undefined : fadeUpVariants}
              transition={fadeUpTransition}
            >
              <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
              <p className="eyebrow text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-gold [font-family:var(--font-dynalight),cursive]">
                {eyebrow}
              </p>
              <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
            </motion.div>
          )}

          <motion.h1
            id="page-hero-title"
            className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold leading-[1.04] tracking-[-0.032em] text-ivory text-balance"
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              className="mx-auto mt-5 max-w-2xl text-base sm:text-lg md:text-xl text-ivory/80 leading-relaxed font-normal"
              variants={reduced ? undefined : fadeUpVariants}
              transition={{ ...fadeUpTransition, delay: 0.08 }}
            >
              {description}
            </motion.p>
          )}

          {homeLabel && (
            <motion.nav
              aria-label="Breadcrumb"
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-petrol/60 px-5 py-2 text-xs sm:text-sm backdrop-blur-md shadow-lg"
              variants={reduced ? undefined : fadeUpVariants}
              transition={{ ...fadeUpTransition, delay: 0.12 }}
            >
              <Link href="/" className="text-ivory/70 transition-colors hover:text-gold">
                {homeLabel}
              </Link>
              {currentPageLabel && (
                <>
                  <span
                    aria-hidden
                    className="inline-flex h-1 w-1 rotate-45 bg-gold shadow-[0_0_6px_rgba(212,173,101,0.6)]"
                  />
                  <span className="font-medium text-gold">{currentPageLabel}</span>
                </>
              )}
            </motion.nav>
          )}
        </motion.div>
      </section>
    );
  }

  return (
    <section className={`relative overflow-hidden bg-petrol px-6 pb-20 pt-40 md:px-10 md:pb-24 md:pt-48 ${dynalight.variable}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
      />
      <div aria-hidden className="noise-overlay" />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        variants={reduced ? undefined : heroStaggerVariants}
      >
        {eyebrow && (
          <motion.div
            className="mb-5 flex items-center gap-3"
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
            <span aria-hidden className="inline-flex h-1.5 w-1.5 rotate-45 bg-gold" />
            <p className="eyebrow text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-gold [font-family:var(--font-dynalight),cursive]">
              {eyebrow}
            </p>
          </motion.div>
        )}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-ivory font-bold mb-6 tracking-[-0.032em] leading-[1.04] max-w-4xl"
          variants={reduced ? undefined : fadeUpVariants}
          transition={fadeUpTransition}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            className="text-ivory/80 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed"
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

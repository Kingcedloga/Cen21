"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Link } from "@/i18n/navigation";
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
        className="relative isolate flex min-h-[22rem] items-center overflow-hidden bg-petrol py-20 md:min-h-[26rem] md:py-24"
      >
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury }}
        >
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
        </motion.div>

        <div aria-hidden className="absolute inset-0 bg-petrol/70" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
        />

        <motion.div
          className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center md:px-6 lg:px-8"
          initial={reduced ? false : "hidden"}
          animate={reduced ? undefined : "visible"}
          variants={reduced ? undefined : heroStaggerVariants}
        >
          <motion.h1
            id="page-hero-title"
            className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-ivory md:text-5xl lg:text-6xl"
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            {title}
          </motion.h1>
          {homeLabel && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold md:text-base"
              variants={reduced ? undefined : fadeUpVariants}
              transition={fadeUpTransition}
            >
              <Link href="/" className="text-ivory transition-colors hover:text-gold">
                {homeLabel}
              </Link>
              {currentPageLabel && (
                <>
                  <span aria-hidden className="text-ivory/60">
                    -
                  </span>
                  <span className="text-gold">{currentPageLabel}</span>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </section>
    );
  }

  return (
    <section className="bg-petrol px-4 pb-16 pt-36 md:px-6 md:pb-20 md:pt-40 lg:px-8">
      <motion.div
        className="mx-auto max-w-7xl"
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        variants={reduced ? undefined : heroStaggerVariants}
      >
        {eyebrow && (
          <motion.div
            className="mb-5 flex flex-col gap-3 items-start"
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            <p className="text-gold text-[11px] font-medium tracking-[0.28em] uppercase">
              {eyebrow}
            </p>
            <span
              className="h-px w-12 bg-gradient-to-r from-gold/85 to-gold/20"
              aria-hidden
            />
          </motion.div>
        )}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl text-ivory font-bold mb-5 tracking-[-0.02em] leading-[1.08] max-w-4xl"
          variants={reduced ? undefined : fadeUpVariants}
          transition={fadeUpTransition}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            className="text-taupe text-base md:text-lg max-w-2xl leading-[1.65]"
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

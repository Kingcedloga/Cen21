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

export function AboutHero({
  title,
  homeLabel,
  currentPageLabel,
  image,
  imageAlt = "",
}: {
  title: string;
  homeLabel: string;
  currentPageLabel?: string;
  image: string;
  imageAlt?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-hero-title"
      className={`relative isolate flex min-h-[58vh] md:min-h-[66vh] items-center justify-center overflow-hidden bg-petrol py-24 md:py-32 ${dynalight.variable}`}
    >
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
        className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-gold/15 blur-3xl"
      />
      <div aria-hidden className="noise-overlay" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center"
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        variants={reduced ? undefined : heroStaggerVariants}
      >
        <motion.h1
          id="about-hero-title"
          className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold leading-[1.04] tracking-[-0.032em] text-ivory text-balance"
          variants={reduced ? undefined : fadeUpVariants}
          transition={fadeUpTransition}
        >
          {title}
        </motion.h1>

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

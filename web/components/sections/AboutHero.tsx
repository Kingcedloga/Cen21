"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { BLUR_PETROL } from "@/lib/image-blur";
import {
  DURATION_S,
  EASE,
  fadeUpTransition,
  fadeUpVariants,
  heroStaggerVariants,
} from "@/lib/motion";

/**
 * Hero éditorial pour la page À propos : image immersive en background,
 * triple voile petrol pour profondeur cinématique, texte premium au premier plan.
 */
export function AboutHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-hero-title"
      className="relative isolate overflow-hidden bg-petrol pt-32 pb-24 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32"
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

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/85 to-petrol/35"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(212,173,101,0.18)_0%,transparent_55%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8"
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
            <span
              aria-hidden
              className="h-px w-9 bg-gradient-to-r from-transparent to-gold/85"
            />
            <span
              aria-hidden
              className="inline-flex h-1.5 w-1.5 rotate-45 bg-gold/85 shadow-[0_0_10px_rgba(212,173,101,0.55)]"
            />
            <p className="text-gold text-[11px] font-semibold tracking-[0.32em] uppercase">
              {eyebrow}
            </p>
          </motion.div>
        )}
        <motion.h1
          id="about-hero-title"
          className="mb-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-ivory md:text-5xl lg:text-6xl"
          variants={reduced ? undefined : fadeUpVariants}
          transition={fadeUpTransition}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            className="max-w-2xl text-base leading-[1.65] text-ivory/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] md:text-lg"
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

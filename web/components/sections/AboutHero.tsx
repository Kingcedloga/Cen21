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

/**
 * Bandeau éditorial pour la page À propos : image immersive en background,
 * titre centré + fil d'Ariane (Accueil - {page}), à la manière d'un page banner.
 */
export function AboutHero({
  eyebrow,
  title,
  homeLabel,
  image,
  imageAlt = "",
}: {
  eyebrow?: string;
  title: string;
  homeLabel: string;
  image: string;
  imageAlt?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-hero-title"
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
          id="about-hero-title"
          className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-ivory md:text-5xl lg:text-6xl"
          variants={reduced ? undefined : fadeUpVariants}
          transition={fadeUpTransition}
        >
          {title}
        </motion.h1>
        <motion.div
          className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold md:text-base"
          variants={reduced ? undefined : fadeUpVariants}
          transition={fadeUpTransition}
        >
          <Link href="/" className="text-ivory transition-colors hover:text-gold">
            {homeLabel}
          </Link>
          {eyebrow && (
            <>
              <span aria-hidden className="text-ivory/60">
                -
              </span>
              <span className="text-gold">{eyebrow}</span>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

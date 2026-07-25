"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { dynalight } from "@/lib/fonts";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
};

const textTransition = (i: number) => ({
  duration: DURATION_S.luxe,
  ease: EASE.luxury,
  delay: i * 0.08,
});

/**
 * Section "Origines / Notre histoire" — page À propos uniquement.
 * Bloc texte centré (eyebrow script doré, titre, description) + grande photo pleine largeur.
 */
export function AboutOriginsSection({ eyebrow, title, description, image, imageAlt = "" }: Props) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-origins-title"
      className={`bg-ivory px-4 py-20 md:px-6 md:py-24 ${dynalight.variable}`}
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          className="mb-4 text-2xl italic text-gold-mid [font-family:var(--font-dynalight),cursive]"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultScrollViewport}
          transition={textTransition(0)}
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          id="about-origins-title"
          className="text-3xl font-bold leading-[1.15] text-[#1a1208] md:text-4xl lg:text-5xl"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultScrollViewport}
          transition={textTransition(1)}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-[700px] leading-[1.75] text-[#4a4038]"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultScrollViewport}
          transition={textTransition(2)}
        >
          {description}
        </motion.p>
      </div>

      <motion.div
        className="relative mx-auto mt-12 aspect-[16/7] w-full max-w-[1200px] overflow-hidden rounded-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] md:mt-16"
        initial={reduced ? false : { opacity: 0, scale: 0.97 }}
        whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.shimmer, ease: EASE.luxury, delay: 0.2 }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}

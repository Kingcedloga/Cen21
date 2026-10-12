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

export function AboutOriginsSection({ eyebrow, title, description, image, imageAlt = "" }: Props) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-origins-title"
      className={`relative overflow-hidden bg-gradient-to-b from-[#efe0cf] via-[#e7d1bf] to-[#dfc8b3] px-6 py-24 md:px-10 md:py-32 ${dynalight.variable}`}
    >
      <div aria-hidden className="noise-overlay" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Eyebrow orné */}
        <motion.div
          className="mb-5 flex items-center justify-center gap-3"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultScrollViewport}
          transition={textTransition(0)}
        >
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-[#b58e48]" />
          <p className="eyebrow text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[#a67c33] [font-family:var(--font-dynalight),cursive]">
            {eyebrow}
          </p>
          <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-[#b58e48]" />
        </motion.div>

        {/* Titre & Description */}
        <motion.h2
          id="about-origins-title"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.06] text-[#1a1208] tracking-[-0.03em] text-balance"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultScrollViewport}
          transition={textTransition(1)}
        >
          {title}
        </motion.h2>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-[#42362b] font-normal"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultScrollViewport}
          transition={textTransition(2)}
        >
          {description}
        </motion.p>
      </div>

      {/* Cadre Visuel Majeur */}
      <motion.div
        className="relative z-10 mx-auto mt-14 aspect-[16/8] w-full max-w-[1240px] overflow-hidden rounded-3xl border border-gold/30 shadow-[0_28px_60px_-16px_rgba(26,18,8,0.28)] md:mt-20 group"
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.2 }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1240px) 100vw, 1240px"
          className="object-cover transition-transform duration-grand ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto rounded-2xl border border-white/15 bg-black/45 px-6 py-4 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.24em] font-semibold text-gold">
            Cen21 Hospitality
          </p>
          <p className="mt-0.5 text-sm sm:text-base font-medium text-white/95">
            L&apos;excellence & l&apos;art de vivre au cœur de Kinshasa
          </p>
        </div>
      </motion.div>
    </section>
  );
}

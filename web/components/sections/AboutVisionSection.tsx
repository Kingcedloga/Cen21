"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { dynalight } from "@/lib/fonts";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  images: [string, string, string];
};

const textTransition = (i: number) => ({
  duration: DURATION_S.luxe,
  ease: EASE.luxury,
  delay: i * 0.08,
});

export function AboutVisionSection({ eyebrow, title, description, cta, images }: Props) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-vision-title"
      className={`relative overflow-hidden bg-[#faf7f2] px-6 py-24 md:px-10 md:py-32 ${dynalight.variable}`}
    >
      <div aria-hidden className="noise-overlay" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Collage gauche (7 cols) */}
        <div className="relative min-h-[28rem] sm:min-h-[34rem] lg:col-span-7">
          <motion.div
            className="absolute left-0 top-0 h-[76%] w-[54%] overflow-hidden rounded-2xl border border-gold/20 shadow-[0_20px_45px_-12px_rgba(26,18,8,0.22)]"
            initial={reduced ? false : { opacity: 0, x: -30, rotate: -2 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0, rotate: -2 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury }}
          >
            <Image
              src={images[0]}
              alt=""
              fill
              sizes="(max-width: 1023px) 50vw, 30vw"
              className="object-cover transition-transform duration-grand ease-out hover:scale-105"
            />
          </motion.div>

          <motion.div
            className="absolute left-[32%] top-[12%] z-10 h-[52%] w-[44%] overflow-hidden rounded-2xl border border-white/60 shadow-[0_24px_50px_-10px_rgba(0,0,0,0.28)]"
            initial={reduced ? false : { opacity: 0, y: -20, scale: 0.95 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.1 }}
          >
            <Image
              src={images[1]}
              alt=""
              fill
              sizes="(max-width: 1023px) 42vw, 25vw"
              className="object-cover transition-transform duration-grand ease-out hover:scale-105"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-0 right-0 h-[76%] w-[54%] overflow-hidden rounded-2xl border border-gold/20 shadow-[0_20px_45px_-12px_rgba(26,18,8,0.22)]"
            initial={reduced ? false : { opacity: 0, x: 30, rotate: 2 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0, rotate: 2 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.15 }}
          >
            <Image
              src={images[2]}
              alt=""
              fill
              sizes="(max-width: 1023px) 50vw, 30vw"
              className="object-cover transition-transform duration-grand ease-out hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Contenu droite (5 cols) */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <motion.div
            className="mb-4 flex items-center gap-3"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={textTransition(0)}
          >
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-[#b58e48]" />
            <p className="eyebrow text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[#a67c33] [font-family:var(--font-dynalight),cursive]">
              {eyebrow}
            </p>
          </motion.div>

          <motion.h2
            id="about-vision-title"
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.08] text-[#1a1208] tracking-[-0.03em] text-balance"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={textTransition(1)}
          >
            {title}
          </motion.h2>

          <motion.p
            className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a4038]"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={textTransition(2)}
          >
            {description}
          </motion.p>

          <motion.div
            className="mt-8 pt-2"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={textTransition(3)}
          >
            <Button href="/filiales">
              {cta}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

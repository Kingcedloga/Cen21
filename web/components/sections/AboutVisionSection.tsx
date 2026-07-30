"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Link } from "@/i18n/navigation";
import { dynalight } from "@/lib/fonts";
import { ArrowRight } from "@/lib/icons";
import { DURATION_S, EASE } from "@/lib/motion";

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

/**
 * Section "Notre Vision" — page À propos uniquement.
 * Collage 3 photos asymétrique à gauche, bloc texte centré verticalement à droite.
 */
export function AboutVisionSection({ eyebrow, title, description, cta, images }: Props) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-vision-title"
      className={`bg-white px-4 py-20 md:px-6 md:py-24 ${dynalight.variable}`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Collage gauche */}
        <div className="relative min-h-[26rem] md:min-h-[32rem]">
          <motion.div
            className="absolute left-0 top-0 h-[78%] w-[52%] overflow-hidden rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            initial={reduced ? false : { opacity: 0, x: -30, rotate: -2 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0, rotate: -2 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury }}
          >
            <Image
              src={images[0]}
              alt=""
              fill
              sizes="(max-width: 1023px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute left-[30%] top-[14%] z-10 h-[46%] w-[42%] overflow-hidden rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            initial={reduced ? false : { opacity: 0, y: -20, scale: 0.95 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.1 }}
          >
            <Image
              src={images[1]}
              alt=""
              fill
              sizes="(max-width: 1023px) 42vw, 21vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-0 right-0 h-[78%] w-[52%] overflow-hidden rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            initial={reduced ? false : { opacity: 0, x: 30, rotate: 1 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0, rotate: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.15 }}
          >
            <Image
              src={images[2]}
              alt=""
              fill
              sizes="(max-width: 1023px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Contenu droite */}
        <div className="flex flex-col justify-center">
          <motion.p
            className="text-2xl font-bold italic text-gold-mid [font-family:var(--font-dynalight),cursive]"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={textTransition(0)}
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            id="about-vision-title"
            className="mt-4 text-3xl font-bold leading-[1.15] text-[#1a1208] md:text-4xl lg:text-5xl"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={textTransition(1)}
          >
            {title}
          </motion.h2>
          <motion.p
            className="mt-6 max-w-xl leading-[1.75] text-[#4a4038]"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={textTransition(2)}
          >
            {description}
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={textTransition(3)}
          >
            <Link
              href="/filiales"
              className="mt-8 inline-flex items-center gap-2 bg-gold-mid px-7 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors duration-fine ease-luxury hover:bg-gold-deep"
            >
              {cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

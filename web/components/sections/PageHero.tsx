"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  fadeUpTransition,
  fadeUpVariants,
  heroStaggerVariants,
} from "@/lib/motion";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const reduced = useReducedMotion();

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

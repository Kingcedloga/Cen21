"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { EASE_GSAP } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/gallery-reveal.css";

/** Orbix (galerie de travaux) : entrée à −8 % du bas de l'écran, une fois. */
const REVEAL_VIEWPORT = { once: true, margin: "0px 0px -8% 0px" } as const;
const revealVariants: Variants = {
  hidden: { opacity: 0.2, filter: "blur(3px)", y: 35, scale: 0.98 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 },
};
const sheenVariants: Variants = {
  hidden: { y: "-120%" },
  visible: { y: "120%" },
};

/**
 * Carte révélée à son entrée dans l'écran (Orbix, galerie de travaux) : flou
 * et opacité .2 → net, puis un reflet or la traverse une fois. Délai en
 * cascade sur trois colonnes (`index`). L'état passe par `animate` (piloté
 * par useInView), jamais par `initial`, que la transition de page bloque au
 * premier chargement. Reduced motion : état final, sans reflet.
 *
 * Le conteneur doit couper le reflet (`overflow: hidden`, coins arrondis).
 */
export function RevealCard({
  index = 0,
  className = "",
  sheen = true,
  children,
}: {
  index?: number;
  className?: string;
  sheen?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);
  const reduced = useReducedMotionSafe();
  const delay = (index % 3) * 0.12;

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={reduced || inView ? "visible" : "hidden"}
      variants={revealVariants}
      transition={reduced ? { duration: 0 } : { duration: 1, ease: EASE_GSAP.power3Out, delay }}
      className={`gallery-reveal ${className}`}
    >
      {children}
      {sheen && !reduced && (
        <motion.span
          aria-hidden
          className="gallery-sheen"
          variants={sheenVariants}
          transition={{ duration: 1.15, ease: EASE_GSAP.power2InOut, delay: delay + 0.6 }}
        />
      )}
    </motion.div>
  );
}

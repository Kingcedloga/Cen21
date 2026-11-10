"use client";

import { motion, useAnimationControls, useInView } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

import {
  clipRevealTransition,
  clipRevealVariants,
  defaultScrollViewport,
  fadeScaleTransition,
  fadeScaleVariants,
  fadeUpTransition,
  fadeUpVariants,
  slideInTransition,
  slideInVariants,
} from "@/lib/motion";
import { REDUCED_MOTION_QUERY } from "@/lib/use-media-query";

export type AnimateInVariant = "fadeUp" | "fadeScale" | "slideIn" | "clipReveal";

const variantMap = {
  fadeUp: { variants: fadeUpVariants, transition: fadeUpTransition },
  fadeScale: { variants: fadeScaleVariants, transition: fadeScaleTransition },
  slideIn: { variants: slideInVariants, transition: slideInTransition },
  clipReveal: { variants: clipRevealVariants, transition: clipRevealTransition },
};

/**
 * Révélation au défilement.
 *
 * Le contenu est visible dans le HTML serveur (pas de dépendance au JavaScript,
 * pas de retard sur le LCP). Au montage, un bloc encore sous l'écran est masqué
 * — hors champ, donc sans flash — puis révélé à son arrivée. Un bloc déjà
 * visible reste tel quel.
 *
 * L'état passe par des contrôles d'animation et non par `initial` : la
 * transition de page (RouteTransition, AnimatePresence initial={false})
 * neutralise `initial` au premier chargement, et ces révélations ne jouaient
 * qu'après une navigation interne.
 */
export function AnimateIn({
  children,
  className = "",
  delay = 0,
  variant = "fadeUp",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimateInVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const inView = useInView(ref, defaultScrollViewport);
  const armed = useRef(false);
  const config = variantMap[variant] ?? variantMap.fadeUp;

  // Après le montage (contrôles attachés) : masquer seulement ce qui est
  // encore sous l'écran. Reduced motion : rien n'est masqué.
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    if (element.getBoundingClientRect().top > window.innerHeight) {
      controls.set("hidden");
      armed.current = true;
    }
  }, [controls]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    armed.current = false;
    void controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={controls}
      variants={config.variants}
      transition={{ ...config.transition, delay }}
    >
      {children}
    </motion.div>
  );
}

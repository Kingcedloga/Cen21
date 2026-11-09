"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Pourcentage de lecture de la page (0 → 100, arrondi), comme le compteur de
 * la capsule d'Orbix. Valeur animée : l'afficher directement dans un
 * `<motion.span>{percent}</motion.span>`, sans re-rendu React.
 * Fonctionne avec ou sans Lenis (qui fait défiler la fenêtre nativement).
 */
export function useScrollPercent(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, (value) => Math.round(Math.min(1, Math.max(0, value)) * 100));
}

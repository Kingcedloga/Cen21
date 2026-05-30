"use client";

import type { Transition, Variants } from "framer-motion";
import { useReducedMotion } from "framer-motion";

/**
 * Système motion centralisé — Cen21 Hospitality
 * Miroir des tokens CSS `--duration-*` et `--ease-*` (globals.css).
 */

/** Durées en secondes (Framer Motion) */
export const DURATION_S = {
  fine: 0.2,
  base: 0.32,
  luxe: 0.48,
  grand: 0.7,
  shimmer: 0.9,
  heroCrossfade: 1,
} as const;

/** Courbes d'easing — miroir CSS */
export const EASE = {
  luxury: [0.16, 1, 0.3, 1] as const,
  outSoft: [0.22, 1, 0.36, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
} as const;

/** Stagger enfant — 40–80 ms (Emil: garder court) */
export const STAGGER = {
  min: 0.04,
  default: 0.05,
  max: 0.08,
} as const;

export function staggerDelay(index: number, step = STAGGER.default): number {
  return index * step;
}

export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}

/* ── Variantes d'entrée scroll ───────────────────────────────────────── */

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
};

export const fadeUpTransition: Transition = {
  duration: DURATION_S.luxe,
  ease: EASE.luxury,
};

export const fadeScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const fadeScaleTransition: Transition = {
  duration: DURATION_S.luxe,
  ease: EASE.luxury,
};

export const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

export const slideInTransition: Transition = {
  duration: DURATION_S.luxe,
  ease: EASE.luxury,
};

/** Conteneur stagger — enfant doit utiliser fadeUp / fadeScale / slideIn */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.default,
      delayChildren: 0,
    },
  },
};

/* ── Lightbox (AnimatePresence) ──────────────────────────────────────── */

export const lightboxBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const lightboxImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

export const lightboxTransition: Transition = {
  duration: DURATION_S.luxe,
  ease: EASE.luxury,
};

/** Entrée panneau mobile / toast — sortie plus rapide (Emil: asymmetric) */
export const panelEnterTransition: Transition = {
  duration: DURATION_S.base,
  ease: EASE.outSoft,
};

export const panelExitTransition: Transition = {
  duration: DURATION_S.fine,
  ease: EASE.outSoft,
};

/** Toast — entrée scale 0.96, sortie plus rapide */
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 12, scale: 0.98 },
};

export const toastEnterTransition: Transition = panelEnterTransition;
export const toastExitTransition: Transition = panelExitTransition;

/* ── Transitions inter-pages ─────────────────────────────────────────── */

export const routeTransitionMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: DURATION_S.base, ease: EASE.outSoft },
} as const;

/* ── Viewport par défaut scroll-driven ───────────────────────────────── */

export const defaultScrollViewport = {
  once: true,
  margin: "-80px",
} as const;

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

/** Hero / PageHero — eyebrow → titre → description (40 ms entre chaque) */
export const heroStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.min,
      delayChildren: 0.06,
    },
  },
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

/** Panneau menu mobile — sortie plus rapide que l'entrée + stagger enfants */
export const mobileNavPanelVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...panelEnterTransition,
      staggerChildren: STAGGER.min,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: panelExitTransition,
  },
};

/* ── Lightbox (AnimatePresence) ──────────────────────────────────────── */

export const lightboxTransition: Transition = {
  duration: DURATION_S.luxe,
  ease: EASE.luxury,
};

export const lightboxImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: lightboxTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: panelExitTransition,
  },
};

export const lightboxBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: lightboxTransition,
  },
  exit: {
    opacity: 0,
    transition: panelExitTransition,
  },
};

/** Lignes décoratives SectionHeading — scaleX 0→1 au scroll */
export const ornamentLineVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1 },
};

export const ornamentLineTransition: Transition = {
  duration: DURATION_S.base,
  ease: EASE.luxury,
};

/** Losange SectionHeading */
export const ornamentDiamondVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export const ornamentDiamondTransition: Transition = {
  duration: DURATION_S.base,
  ease: EASE.luxury,
};

/** Fil d'Ariane — fade slide depuis le haut */
export const breadcrumbVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
};

export const breadcrumbTransition: Transition = {
  duration: DURATION_S.base,
  ease: EASE.outSoft,
};

/** MapEmbed — fade-in discret au scroll */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInTransition: Transition = {
  duration: DURATION_S.base,
  ease: EASE.outSoft,
};

/** Items menu mobile — stagger à l'ouverture */
export const mobileNavItemVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0 },
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

/* ── Icon pop — scale 0.6→1 + opacity pour icônes stat ─────────────── */

export const iconPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1 },
};

export const iconPopTransition: Transition = {
  duration: DURATION_S.base,
  ease: EASE.spring,
};

/* ── Stat stagger container — 80ms entre chaque stat ───────────────── */

export const statStaggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.max,
      delayChildren: 0,
    },
  },
};

/** Conteneur stagger pour footer — 60ms entre chaque colonne */
export const footerStaggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

/* ── Viewport par défaut scroll-driven ───────────────────────────────── */

export const defaultScrollViewport = {
  once: true,
  margin: "-80px",
} as const;

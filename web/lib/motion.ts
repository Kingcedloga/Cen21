"use client";

import { useReducedMotion } from "framer-motion";

export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

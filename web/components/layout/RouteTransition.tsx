"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { routeTransitionMotion } from "@/lib/motion";

/**
 * Crossfade subtil entre routes. Désactivé si l'utilisateur a demandé
 * `prefers-reduced-motion: reduce` — le contenu apparaît alors instantanément.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} {...routeTransitionMotion}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

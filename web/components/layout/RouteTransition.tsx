"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

import { DURATION_S, EASE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();
  const [prevPath, setPrevPath] = useState(pathname);
  const [direction, setDirection] = useState(1);

  if (pathname !== prevPath) {
    setDirection((pathname?.length ?? 0) >= (prevPath?.length ?? 0) ? 1 : -1);
    setPrevPath(pathname);
  }

  const xOut = -16 * direction;
  const xIn = 16 * direction;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        // Même structure en reduced motion (sinon le HTML serveur et le
        // premier rendu client diffèrent : erreur React #418) ; changement
        // de page instantané.
        initial={reduced ? false : { opacity: 0, x: xIn }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduced ? undefined : { opacity: 0, x: xOut }}
        transition={reduced ? { duration: 0 } : { duration: DURATION_S.base, ease: EASE.outSoft }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

import { DURATION_S, EASE } from "@/lib/motion";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [prevPath, setPrevPath] = useState(pathname);
  const [direction, setDirection] = useState(1);

  if (pathname !== prevPath) {
    setDirection((pathname?.length ?? 0) >= (prevPath?.length ?? 0) ? 1 : -1);
    setPrevPath(pathname);
  }

  if (reduced) return <>{children}</>;

  const xOut = -16 * direction;
  const xIn = 16 * direction;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: xIn }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: xOut }}
        transition={{ duration: DURATION_S.base, ease: EASE.outSoft }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

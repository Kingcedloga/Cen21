"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";

import { DURATION_S, EASE } from "@/lib/motion";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const prevPath = useRef(pathname);
  const direction = useRef(1);

  useEffect(() => {
    if (pathname !== prevPath.current) {
      direction.current =
        (pathname?.length ?? 0) >= (prevPath.current?.length ?? 0) ? 1 : -1;
      prevPath.current = pathname;
    }
  }, [pathname]);

  if (reduced) return <>{children}</>;

  const xOut = -16 * direction.current;
  const xIn = 16 * direction.current;

  return (
    <AnimatePresence mode="wait" initial={false}>
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

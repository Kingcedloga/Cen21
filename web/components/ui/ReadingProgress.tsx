"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useState } from "react";

export function ReadingProgress({ barClassName }: { barClassName?: string }) {
  const { scrollYProgress, scrollY } = useScroll();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={
        barClassName ??
        "fixed left-0 right-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-gold via-gold/85 to-gold/55"
      }
    />
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right";

const clipFrom: Record<Direction, string> = {
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

const clipTo = "inset(0 0 0 0)";

export function ClipReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = DURATION_S.luxe,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: clipFrom[direction], opacity: 0.3 }}
      whileInView={{ clipPath: clipTo, opacity: 1 }}
      viewport={defaultScrollViewport}
      transition={{
        clipPath: { duration, ease: EASE.luxury },
        opacity: { duration: duration * 0.4, ease: EASE.outSoft },
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

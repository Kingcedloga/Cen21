"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  clipRevealTransition,
  clipRevealVariants,
  defaultScrollViewport,
  fadeScaleTransition,
  fadeScaleVariants,
  fadeUpTransition,
  fadeUpVariants,
  slideInTransition,
  slideInVariants,
} from "@/lib/motion";

export type AnimateInVariant = "fadeUp" | "fadeScale" | "slideIn" | "clipReveal";

const variantMap = {
  fadeUp: { variants: fadeUpVariants, transition: fadeUpTransition },
  fadeScale: { variants: fadeScaleVariants, transition: fadeScaleTransition },
  slideIn: { variants: slideInVariants, transition: slideInTransition },
  clipReveal: { variants: clipRevealVariants, transition: clipRevealTransition },
};

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  variant = "fadeUp",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimateInVariant;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const config = variantMap[variant] ?? variantMap.fadeUp;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultScrollViewport}
      variants={config.variants}
      transition={{ ...config.transition, delay }}
    >
      {children}
    </motion.div>
  );
}

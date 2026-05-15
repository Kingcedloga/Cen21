"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUpTransition, fadeUpVariants } from "@/lib/motion";

export function AnimateIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUpVariants}
      transition={{ ...fadeUpTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

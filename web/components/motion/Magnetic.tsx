"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/motion-primitives.css";

/** Amplitude d'Orbix : ±10 px en x, ±8 px en y ; le contenu suit avec 40 % de plus. */
const PULL = { x: 10, y: 8 } as const;
const CONTENT_PARALLAX = 0.4;
const FOLLOW = { stiffness: 260, damping: 18, mass: 0.6 } as const;

/**
 * Effet aimant : l'élément suit légèrement le curseur tant qu'il le survole,
 * puis revient en place sur un ressort. Le contenu marqué `.magnetic__content`
 * se décale un peu plus (parallaxe). Souris uniquement, coupé en reduced motion.
 */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const reduced = useReducedMotionSafe();
  const enabled = finePointer && !reduced;

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, FOLLOW);
  const y = useSpring(targetY, FOLLOW);
  const contentX = useTransform(x, (value) => `${value * CONTENT_PARALLAX}px`);
  const contentY = useTransform(y, (value) => `${value * CONTENT_PARALLAX}px`);

  const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    targetX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * PULL.x);
    targetY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * PULL.y);
  };

  const release = () => {
    targetX.set(0);
    targetY.set(0);
  };

  const style = { x, y, "--magnet-x": contentX, "--magnet-y": contentY } as MotionStyle;

  return (
    <motion.span
      className={`magnetic ${className}`}
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={release}
    >
      {children}
    </motion.span>
  );
}

"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useId } from "react";

import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/mexicana.css";

/** Drapeau découpé (viewBox 0 0 60 76) : bas en dents de scie, motifs évidés. */
const FLAG =
  "M0 0H60V66L55 72L50 66L45 72L40 66L35 72L30 66L25 72L20 66L15 72L10 66L5 72L0 66Z" +
  // Losange central.
  "M30 20L39 32L30 44L21 32Z" +
  // Quatre ronds.
  "M10 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z" +
  "M42 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z" +
  "M10 50a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z" +
  "M42 50a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z" +
  // Petits losanges au-dessus des dents.
  "M30 54L33 58L30 62L27 58Z" +
  "M18 56L20 59L18 62L16 59Z" +
  "M42 56L44 59L42 62L40 59Z";

/** Reduced motion : valeur fixe explicite. */
const STILL = { rotate: 0 };

/**
 * Guirlande de papel picado (drapeaux de papier découpé) suspendue à un fil,
 * aux couleurs de la maison. Les drapeaux se balancent au rythme du
 * défilement de la page — chacun avec son décalage — et s'immobilisent
 * quand on ne défile plus. Décoratif. Reduced motion : immobiles.
 */
export function MexicanaPapel({ count = 14, className = "" }: { count?: number; className?: string }) {
  const reduced = useReducedMotionSafe();
  const id = useId();
  const { scrollY } = useScroll();

  return (
    <div aria-hidden="true" className={`mx-papel ${className}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <path id={id} d={FLAG} fillRule="evenodd" />
        </defs>
      </svg>
      {Array.from({ length: count }, (_, index) => (
        <Flag key={index} index={index} flagId={id} scrollY={scrollY} still={reduced} />
      ))}
    </div>
  );
}

function Flag({ index, flagId, scrollY, still }: { index: number; flagId: string; scrollY: MotionValue<number>; still: boolean }) {
  const rotate = useTransform(scrollY, (y) => Math.sin(y / 120 + index * 1.3) * 7);
  return (
    <motion.svg
      viewBox="0 0 60 76"
      className={`mx-papel__flag mx-papel__flag--${index % 4}`}
      style={still ? STILL : { rotate }}
    >
      <use href={`#${flagId}`} />
    </motion.svg>
  );
}

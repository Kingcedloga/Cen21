"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/mexicana.css";

/** Reduced motion : valeurs fixes explicites. */
const STILL = { y: "0%", rotate: -6 };

/**
 * La mascotte de la maison (le mariachi) qui passe la tête au-dessus de la
 * section qu'elle accompagne (la réservation) : elle monte en même temps que
 * la section arrive à l'écran, en se penchant. Décorative. Reduced motion :
 * posée, immobile.
 */
export function MexicanaMascot({ src, children }: { src: string; children: ReactNode }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const y = useTransform(scrollYProgress, [0, 1], ["70%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [8, -6]);

  return (
    <div ref={ref} className="mx-mascot-wrap">
      <div aria-hidden="true" className="mx-mascot">
        <motion.div className="mx-mascot__figure" style={reduced ? STILL : { y, rotate }}>
          <Image src={src} alt="" fill sizes="12rem" className="object-contain object-bottom" />
        </motion.div>
      </div>
      {children}
    </div>
  );
}

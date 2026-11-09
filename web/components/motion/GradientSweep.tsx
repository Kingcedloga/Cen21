"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

import { EASE_GSAP } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/motion-primitives.css";

export type SweepTone = "dark" | "light" | "gold";

const running = new WeakMap<HTMLElement, AnimationPlaybackControls>();

/**
 * Classes d'un élément balayé : `dark` (or sur ivoire, fonds sombres),
 * `light` (or sur pétrole, fonds clairs), `gold` (reflet sable sur un mot doré).
 */
export function sweepClassName(tone: SweepTone = "dark") {
  if (tone === "light") return "gradient-sweep gradient-sweep--light";
  if (tone === "gold") return "gradient-sweep gradient-sweep--gold";
  return "gradient-sweep";
}

/**
 * Fait passer le reflet or d'un bout à l'autre du texte (Orbix : 2 s, power3.out).
 * Le texte reste dans sa couleur de base avant et après.
 */
export function playSweep(element: HTMLElement, duration = 2) {
  running.get(element)?.stop();
  const controls = animate(
    element,
    { backgroundPosition: ["100% 0%", "0% 0%"] },
    { duration, ease: EASE_GSAP.power3Out },
  );
  running.set(element, controls);
  return controls;
}

/**
 * Mot ou groupe de mots balayé en or quand il traverse la bande centrale de
 * l'écran (marges −25 %), à chaque passage. Statique en reduced motion.
 *
 * Dans un titre révélé lettre à lettre, utiliser plutôt la prop `sweep` de
 * <SpectrumText> : le balayage part alors à la fin de la révélation.
 */
export function GradientSweep({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: SweepTone;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) playSweep(element);
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      running.get(element)?.stop();
    };
  }, [reduced]);

  return (
    <span ref={ref} className={`${sweepClassName(tone)} ${className}`}>
      {children}
    </span>
  );
}

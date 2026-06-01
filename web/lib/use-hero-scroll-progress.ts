"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";

import { computeFilialeRevealProgress } from "./filiale-scroll-reveal";

export function useHeroScrollProgress(
  sectionRef: RefObject<HTMLElement | null>,
): number {
  const reduced = useReducedMotion() ?? false;
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      setProgress(computeFilialeRevealProgress(section));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced, sectionRef]);

  return progress;
}

"use client";

import { useEffect, useState, type RefObject } from "react";

import { computeFilialeRevealProgress } from "./filiale-scroll-reveal";
import { useReducedMotionSafe } from "./use-media-query";

export function useHeroScrollProgress(
  sectionRef: RefObject<HTMLElement | null>,
): number {
  const reduced = useReducedMotionSafe();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;

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

  // Reduced motion : état final, sans suivre le défilement.
  return reduced ? 1 : progress;
}

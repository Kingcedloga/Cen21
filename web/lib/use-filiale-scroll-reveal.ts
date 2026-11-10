"use client";

import { useEffect, useState } from "react";

import { computeFilialeRevealProgress } from "./filiale-scroll-reveal";
import { useReducedMotionSafe } from "./use-media-query";

/** Progression 0→1 pour effets immersifs filiale (navbar, logo) */
export function useFilialeScrollReveal(enabled: boolean): number {
  const reduced = useReducedMotionSafe();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled || reduced) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const hero = document.querySelector<HTMLElement>(".subsidiary-hero");
      setProgress(computeFilialeRevealProgress(hero));
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
  }, [enabled, reduced]);

  // Hors filiale ou reduced motion : état final, sans suivre le défilement.
  return enabled && !reduced ? progress : 1;
}

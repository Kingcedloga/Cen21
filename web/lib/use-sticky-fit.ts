"use client";

import { useEffect, type RefObject } from "react";

/**
 * Rideau (styles/hero-curtain.css) : le hero reste collé pendant que la
 * section suivante monte par-dessus. Un hero plus haut que l'écran doit coller
 * par son bas, sinon son contenu passerait sous le rideau : on publie l'écart
 * (≤ 0) dans `--hero-fit-top`, lu par la règle `top` du hero.
 */
export function useStickyFit(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      el.style.setProperty("--hero-fit-top", `${Math.min(0, window.innerHeight - el.offsetHeight)}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref]);
}

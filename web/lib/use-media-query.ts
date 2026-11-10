"use client";

import { useSyncExternalStore } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * Media query sûre pour l'hydratation : `false` côté serveur et pendant
 * l'hydratation, puis la vraie valeur. Le premier rendu client est donc
 * identique au HTML serveur (pas d'erreur React #418).
 *
 * Pour un rendu statique immédiat (avant hydratation), doubler par une
 * règle CSS `@media` — voir styles/motion-primitives.css.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** `true` si l'utilisateur demande de réduire les animations (après hydratation). */
export function useReducedMotionSafe(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}

const noopSubscribe = () => () => {};

/**
 * `false` côté serveur et pendant l'hydratation, `true` ensuite. Pour ce qui
 * ne peut pas être rendu à l'identique des deux côtés (heure courante, portail
 * vers document.body…).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

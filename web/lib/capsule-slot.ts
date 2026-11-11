"use client";

import { useSyncExternalStore } from "react";

/** Emplacement de la capsule de navigation où une page rend ses commandes. */
export const CAPSULE_SLOT_ID = "capsule-slot";

/**
 * Relecture une image plus tard : en arrivant d'une fiche filiale (sans
 * capsule), la capsule et la page sont montées dans le même rendu.
 */
function subscribeNextFrame(onChange: () => void) {
  const frame = requestAnimationFrame(onChange);
  return () => cancelAnimationFrame(frame);
}

/**
 * Élément d'accueil de la capsule (pages groupe), ou `null` côté serveur,
 * pendant l'hydratation et sur les pages sans capsule (fiches filiales).
 * À utiliser avec `createPortal` : la capsule s'élargit quand l'emplacement
 * n'est pas vide (styles/capsule-nav.css).
 */
export function useCapsuleSlot(): HTMLElement | null {
  return useSyncExternalStore(
    subscribeNextFrame,
    () => document.getElementById(CAPSULE_SLOT_ID),
    () => null,
  );
}

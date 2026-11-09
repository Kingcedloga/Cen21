"use client";

/**
 * Signal « site prêt » : émis par SiteLoader quand son voile commence à
 * disparaître. Les animations d'entrée (SpectrumText en mode « load »)
 * l'attendent pour ne pas jouer sous le loader.
 *
 * Après une navigation côté client, le loader a déjà disparu : le signal est
 * acquis et les rappels partent immédiatement.
 */

/** Délai de secours si aucun loader n'émet le signal (ms). */
const FALLBACK_MS = 3000;

let ready = false;
const callbacks = new Set<() => void>();

export function markSiteReady() {
  if (ready) return;
  ready = true;
  callbacks.forEach((callback) => callback());
  callbacks.clear();
}

/** Appelle `callback` dès que le site est prêt. Retourne une fonction d'annulation. */
export function onSiteReady(callback: () => void): () => void {
  if (ready) {
    callback();
    return () => {};
  }
  callbacks.add(callback);
  const fallback = window.setTimeout(() => {
    if (callbacks.delete(callback)) callback();
  }, FALLBACK_MS);
  return () => {
    callbacks.delete(callback);
    window.clearTimeout(fallback);
  };
}

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

let navigated = false;
/** Chemin du document chargé (le module est évalué à l'arrivée sur le site). */
const initialPath = typeof window === "undefined" ? "" : window.location.pathname;

/** Appelé par SiteLoader à chaque changement de page côté client. */
export function markNavigated() {
  navigated = true;
}

/**
 * Révélation d'entrée manquée : sur la page d'arrivée, le titre est déjà
 * visible quand son animation pourrait démarrer — le loader est parti
 * (`ready`), ou son plafond CSS d'environ une seconde (globals.css) a
 * commencé à l'effacer avant que le JavaScript ne prenne la main. Masquer le
 * texte pour le rejouer ferait clignoter la page : on le laisse tel quel.
 * Après une navigation interne, les révélations jouent normalement.
 */
export function introMissed(): boolean {
  if (navigated || window.location.pathname !== initialPath) {
    navigated = true;
    return false;
  }
  if (ready) return true;
  const loader = document.querySelector<HTMLElement>("[data-site-loader]:not([data-js])");
  return loader !== null && parseFloat(getComputedStyle(loader).opacity) < 0.98;
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

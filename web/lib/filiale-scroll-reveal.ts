/** Seuil scroll partagé logo + navbar filiale (0 → 1) */
export const FILIALE_REVEAL_RATIO = 0.42;

export function computeFilialeRevealProgress(
  hero?: HTMLElement | null,
): number {
  const threshold = hero
    ? Math.max(hero.offsetHeight * FILIALE_REVEAL_RATIO, 120)
    : Math.max(
        (typeof window !== "undefined" ? window.innerHeight : 800) *
          FILIALE_REVEAL_RATIO,
        120,
      );
  if (typeof window === "undefined") return 0;
  return Math.min(1, Math.max(0, window.scrollY / threshold));
}

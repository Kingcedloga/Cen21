/**
 * Fiches passées au socle de la refonte (R5 et suivantes) : composition en
 * blocs, palette de la maison posée sur toute la page, capsule de navigation
 * et footer du groupe aux couleurs de la maison. Les autres fiches gardent
 * leur en-tête et leur footer à charte jusqu'à leur refonte.
 */
export const MIGRATED_FILIALES: ReadonlySet<string> = new Set<string>([
  "filiale-02", // Wabi Sabi — pilote (R6)
  "filiale-03", // K Lounge (R7)
  "filiale-04", // Millionaire Club (R8)
  "filiale-06", // Moka & More (R9)
]);

export function isMigratedFiliale(slug: string | null | undefined): boolean {
  return Boolean(slug) && MIGRATED_FILIALES.has(slug as string);
}

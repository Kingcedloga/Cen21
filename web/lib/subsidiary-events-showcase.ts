export type SubsidiaryEventShowcaseConfig = {
  /** Nombre d'événements affichés dans la vitrine. */
  maxEvents: number;
  /** Colonnes alignées sur desktop (ex. 5 cartes pleine largeur). */
  desktopColumns: number;
};

const EVENT_SHOWCASE_CONFIG: Partial<Record<string, SubsidiaryEventShowcaseConfig>> = {
  "filiale-04": { maxEvents: 5, desktopColumns: 5 },
};

export function getSubsidiaryEventShowcaseConfig(
  slug: string,
): SubsidiaryEventShowcaseConfig | undefined {
  return EVENT_SHOWCASE_CONFIG[slug];
}

export function hasSubsidiaryEventShowcase(slug: string): boolean {
  return slug in EVENT_SHOWCASE_CONFIG;
}

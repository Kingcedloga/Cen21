import type { Subsidiary } from "@/lib/types";

/** Une implantation d'une maison : adresse précise dans une ville. */
export type SubsidiaryPlace = {
  subsidiary: Subsidiary;
  city: string;
  address: string;
  phone?: string;
  /** Ville principale du groupe (Kinshasa) : la première implantation. */
  main: boolean;
};

const MAIN_CITY = "Kinshasa";

/** Adresse précise (pas seulement le nom de la ville) : une carte peut s'y placer. */
function isPrecise(address: string | undefined, city: string): address is string {
  const value = address?.trim();
  return Boolean(value) && value!.toLowerCase() !== city.toLowerCase();
}

/**
 * Implantations des maisons qui ont une adresse précise : une par ville
 * (`practicalInfo.locations`), sinon l'adresse principale. Kinshasa d'abord,
 * les autres villes ensuite (ordre des maisons conservé). Utilisé par
 * « Nos adresses » (/contact) et les chiffres d'À propos.
 */
export function subsidiaryPlaces(subsidiaries: Subsidiary[]): SubsidiaryPlace[] {
  const places = subsidiaries.flatMap((s) => {
    const sources = s.practicalInfo.locations?.length
      ? s.practicalInfo.locations
      : [{ city: MAIN_CITY, address: s.practicalInfo.address ?? "", phone: s.practicalInfo.phone ?? "" }];
    return sources
      .filter((place) => isPrecise(place.address, place.city))
      .map((place) => ({
        subsidiary: s,
        city: place.city,
        address: place.address,
        phone: place.phone || undefined,
        main: place.city === MAIN_CITY,
      }));
  });
  // Tri stable : Kinshasa d'abord.
  return places.sort((a, b) => Number(b.main) - Number(a.main));
}

/** Villes des implantations, ville principale en tête. */
export function placeCities(places: SubsidiaryPlace[]): string[] {
  return [...new Set([MAIN_CITY, ...places.map((place) => place.city)])].filter((city) =>
    places.some((place) => place.city === city),
  );
}

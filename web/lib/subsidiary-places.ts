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

/** Pays des villes du groupe (codes ISO 3166) : RD Congo et Congo-Brazzaville. */
const CITY_COUNTRY: Record<string, string> = {
  Kinshasa: "CD",
  Lubumbashi: "CD",
  "Pointe-Noire": "CG",
};

/** Présence du groupe dans une ville : toutes les maisons qui y sont, adresse précise ou non. */
export type CityPresence = { city: string; country?: string; houses: Subsidiary[] };

/**
 * Villes du groupe et leurs maisons (carte d'À propos, AboutCities) : une
 * maison compte dans chaque ville de `practicalInfo.locations`, sinon à
 * Kinshasa. Contrairement à `subsidiaryPlaces`, une ville sans adresse
 * précise compte aussi (ex. Pointe-Noire). Kinshasa d'abord, puis les villes
 * qui comptent le plus de maisons.
 */
export function cityPresence(subsidiaries: Subsidiary[]): CityPresence[] {
  const byCity = new Map<string, Subsidiary[]>();
  for (const s of subsidiaries) {
    const cities = s.practicalInfo.locations?.length ? s.practicalInfo.locations.map((place) => place.city) : [MAIN_CITY];
    for (const city of new Set(cities)) byCity.set(city, [...(byCity.get(city) ?? []), s]);
  }
  return [...byCity]
    .map(([city, houses]) => ({ city, country: CITY_COUNTRY[city], houses }))
    .sort((a, b) => Number(b.city === MAIN_CITY) - Number(a.city === MAIN_CITY) || b.houses.length - a.houses.length);
}
